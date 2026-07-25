import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import type {
  ExecutiveBusPort,
  SendExecutiveMessageInput,
  ExecutiveBusMessage,
} from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";
import { EventsService } from "../events/events.service";
import { ExecutiveAuditService } from "./executive-audit.service";
import { rowToBusMessage } from "./executive.mapper";

@Injectable()
export class ExecutiveBusService implements ExecutiveBusPort {
  private readonly logger = new Logger(ExecutiveBusService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventsService,
    private readonly audit: ExecutiveAuditService,
  ) {}

  async send(input: SendExecutiveMessageInput): Promise<ExecutiveBusMessage> {
    const correlationId = input.correlationId ?? crypto.randomUUID();
    const traceId = input.traceId ?? correlationId;
    const timeoutAt = input.timeoutMs
      ? new Date(Date.now() + input.timeoutMs)
      : undefined;

    const row = await this.prisma.executiveMessage.create({
      data: {
        companyId: input.companyId,
        instanceId: input.instanceId,
        messageType: input.messageType,
        fromExecutiveId: input.fromExecutiveId,
        toExecutiveId: input.toExecutiveId,
        subject: input.subject,
        payload: (input.payload ?? {}) as object,
        correlationId,
        traceId,
        causationId: input.causationId,
        maxRetries: input.maxRetries ?? 3,
        timeoutAt,
      },
    });

    await this.events.publish(
      "executive.message.sent",
      input.companyId,
      {
        messageId: row.id,
        messageType: input.messageType,
        fromExecutiveId: input.fromExecutiveId,
        toExecutiveId: input.toExecutiveId,
      },
      { correlationId, traceId, causationId: input.causationId, source: "executive-bus" },
    );

    await this.audit.log({
      companyId: input.companyId,
      instanceId: input.instanceId,
      executiveId: input.fromExecutiveId,
      action: `bus.send.${input.messageType}`,
      actorType: "executive",
      actorId: input.fromExecutiveId,
      metadata: { subject: input.subject, toExecutiveId: input.toExecutiveId },
      correlationId,
      traceId,
    });

    return rowToBusMessage(row);
  }

  async respond(
    originalMessageId: string,
    payload: Record<string, unknown>,
    fromExecutiveId: string,
  ): Promise<ExecutiveBusMessage> {
    const original = await this.prisma.executiveMessage.findUnique({
      where: { id: originalMessageId },
    });
    if (!original) throw new NotFoundException("Original message not found");

    const response = await this.send({
      companyId: original.companyId,
      messageType: "response",
      fromExecutiveId,
      toExecutiveId: original.fromExecutiveId ?? undefined,
      instanceId: original.instanceId ?? undefined,
      subject: `Re: ${original.subject}`,
      payload,
      correlationId: original.correlationId,
      traceId: original.traceId ?? undefined,
      causationId: original.id,
    });

    await this.markDelivered(originalMessageId);
    return response;
  }

  async getPending(companyId: string, executiveId: string): Promise<ExecutiveBusMessage[]> {
    const rows = await this.prisma.executiveMessage.findMany({
      where: {
        companyId,
        toExecutiveId: executiveId,
        status: { in: ["pending", "retrying"] },
      },
      orderBy: { createdAt: "asc" },
      take: 100,
    });
    return rows.map(rowToBusMessage);
  }

  async markDelivered(messageId: string): Promise<ExecutiveBusMessage> {
    const row = await this.prisma.executiveMessage.update({
      where: { id: messageId },
      data: { status: "delivered", deliveredAt: new Date() },
    });
    return rowToBusMessage(row);
  }

  async retry(messageId: string): Promise<ExecutiveBusMessage> {
    const existing = await this.prisma.executiveMessage.findUnique({
      where: { id: messageId },
    });
    if (!existing) throw new NotFoundException("Message not found");

    if (existing.retryCount >= existing.maxRetries) {
      const failed = await this.prisma.executiveMessage.update({
        where: { id: messageId },
        data: { status: "failed" },
      });
      this.logger.warn(`Message ${messageId} exceeded max retries`);
      return rowToBusMessage(failed);
    }

    const row = await this.prisma.executiveMessage.update({
      where: { id: messageId },
      data: { status: "retrying", retryCount: existing.retryCount + 1 },
    });
    return rowToBusMessage(row);
  }
}
