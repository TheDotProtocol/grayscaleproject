import { Injectable, NotFoundException } from "@nestjs/common";
import type {
  ExecutiveInboxPort,
  CreateInboxItemInput,
  ExecutiveInboxItem,
  ExecutiveInboxQueue,
  InboxSummary,
} from "@grayscale/platform";
import { EXECUTIVE_INBOX_QUEUES } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";
import { emptyInboxCounts, rowToInboxItem, rowToInstance, toInboxSummary } from "./executive.mapper";

@Injectable()
export class ExecutiveInboxService implements ExecutiveInboxPort {
  constructor(private readonly prisma: PrismaService) {}

  async enqueue(input: CreateInboxItemInput): Promise<ExecutiveInboxItem> {
    const row = await this.prisma.executiveInboxItem.create({
      data: {
        companyId: input.companyId,
        instanceId: input.instanceId,
        executiveId: input.executiveId,
        queue: input.queue,
        itemType: input.itemType,
        title: input.title,
        payload: (input.payload ?? {}) as object,
        priority: input.priority ?? 0,
        correlationId: input.correlationId,
        traceId: input.traceId,
      },
    });
    return rowToInboxItem(row);
  }

  async move(itemId: string, toQueue: ExecutiveInboxQueue): Promise<ExecutiveInboxItem> {
    const row = await this.prisma.executiveInboxItem.update({
      where: { id: itemId },
      data: { queue: toQueue },
    });
    return rowToInboxItem(row);
  }

  async list(instanceId: string, queue?: ExecutiveInboxQueue): Promise<ExecutiveInboxItem[]> {
    const rows = await this.prisma.executiveInboxItem.findMany({
      where: { instanceId, ...(queue ? { queue } : {}) },
      orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
    });
    return rows.map(rowToInboxItem);
  }

  async summary(instanceId: string): Promise<InboxSummary> {
    const instance = await this.prisma.executiveInstance.findUnique({
      where: { id: instanceId },
    });
    if (!instance) throw new NotFoundException("Executive instance not found");

    const grouped = await this.prisma.executiveInboxItem.groupBy({
      by: ["queue"],
      where: { instanceId },
      _count: true,
    });

    const counts = emptyInboxCounts();
    for (const g of grouped) {
      if (EXECUTIVE_INBOX_QUEUES.includes(g.queue as ExecutiveInboxQueue)) {
        counts[g.queue as ExecutiveInboxQueue] = g._count;
      }
    }

    return toInboxSummary(rowToInstance(instance), counts);
  }
}
