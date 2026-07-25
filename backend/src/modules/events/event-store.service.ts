import { Injectable, Logger } from "@nestjs/common";
import {
  type PlatformEvent,
  type StoredDomainEvent,
  type EventStatus,
  storedToPlatformEvent,
} from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class EventStoreService {
  private readonly logger = new Logger(EventStoreService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** Append immutable event — source of truth before transport */
  async append(event: PlatformEvent): Promise<StoredDomainEvent> {
    const row = await this.prisma.domainEvent.create({
      data: {
        id: event.id,
        companyId: event.companyId,
        type: event.type,
        version: event.version,
        userId: event.userId,
        payload: event.payload as object,
        correlationId: event.metadata.correlationId,
        causationId: event.metadata.causationId,
        traceId: event.metadata.traceId,
        source: event.metadata.source,
        status: "pending",
      },
    });

    this.logger.debug(
      `Appended ${event.type} seq=${row.sequence} [${event.metadata.correlationId}]`,
    );

    return this.toStored(row);
  }

  async markStatus(
    eventId: string,
    status: EventStatus,
  ): Promise<void> {
    await this.prisma.domainEvent.update({
      where: { id: eventId },
      data: {
        status,
        processedAt: status === "processed" ? new Date() : undefined,
      },
    });
  }

  async recordFailure(input: {
    domainEventId: string;
    projector?: string;
    error: string;
    stack?: string;
    attempt?: number;
  }): Promise<void> {
    await this.prisma.domainEventFailure.create({
      data: {
        domainEventId: input.domainEventId,
        projector: input.projector,
        error: input.error,
        stack: input.stack,
        attempt: input.attempt ?? 1,
      },
    });

    await this.markStatus(input.domainEventId, "failed");
  }

  async findById(eventId: string): Promise<StoredDomainEvent | null> {
    const row = await this.prisma.domainEvent.findUnique({
      where: { id: eventId },
    });
    return row ? this.toStored(row) : null;
  }

  async findForReplay(input: {
    companyId: string;
    fromSequence?: bigint;
    toSequence?: bigint;
    types?: string[];
    limit?: number;
  }): Promise<StoredDomainEvent[]> {
    const rows = await this.prisma.domainEvent.findMany({
      where: {
        companyId: input.companyId,
        ...(input.fromSequence !== undefined || input.toSequence !== undefined
          ? {
              sequence: {
                ...(input.fromSequence !== undefined
                  ? { gte: input.fromSequence }
                  : {}),
                ...(input.toSequence !== undefined
                  ? { lte: input.toSequence }
                  : {}),
              },
            }
          : {}),
        ...(input.types?.length ? { type: { in: input.types } } : {}),
      },
      orderBy: { sequence: "asc" },
      take: input.limit ?? 1000,
    });

    return rows.map((row) => this.toStored(row));
  }

  async findByCorrelationId(
    correlationId: string,
  ): Promise<StoredDomainEvent[]> {
    const rows = await this.prisma.domainEvent.findMany({
      where: { correlationId },
      orderBy: { sequence: "asc" },
    });
    return rows.map((row) => this.toStored(row));
  }

  toPlatformEvent(stored: StoredDomainEvent): PlatformEvent {
    return storedToPlatformEvent(stored);
  }

  private toStored(row: {
    id: string;
    sequence: bigint;
    companyId: string;
    type: string;
    version: number;
    userId: string | null;
    payload: unknown;
    correlationId: string;
    causationId: string | null;
    traceId: string | null;
    source: string;
    status: string;
    processedAt: Date | null;
    createdAt: Date;
  }): StoredDomainEvent {
    return {
      id: row.id,
      sequence: row.sequence,
      companyId: row.companyId,
      type: row.type,
      version: row.version,
      userId: row.userId,
      payload: row.payload,
      correlationId: row.correlationId,
      causationId: row.causationId,
      traceId: row.traceId,
      source: row.source,
      status: row.status as EventStatus,
      processedAt: row.processedAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
