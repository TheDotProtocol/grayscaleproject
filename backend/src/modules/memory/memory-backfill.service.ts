import { Injectable, Logger } from "@nestjs/common";
import type { MemoryRecordInput } from "@grayscale/platform";
import { MEMORY_SOURCE_TABLES } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";
import { MemoryIngestionService } from "./memory-ingestion.service";

/**
 * One-time / admin backfill — indexes existing domain tables without rewriting them.
 * Idempotent via upsert on (sourceTable, sourceId).
 */
@Injectable()
export class MemoryBackfillService {
  private readonly logger = new Logger(MemoryBackfillService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly ingestion: MemoryIngestionService,
  ) {}

  async backfillCompany(companyId: string): Promise<{ indexed: number }> {
    let indexed = 0;

    const memories = await this.prisma.memory.findMany({ where: { companyId } });
    for (const m of memories) {
      await this.ingestion.upsert(this.memoryToInput(companyId, m));
      indexed++;
    }

    const journals = await this.prisma.journalEntry.findMany({ where: { companyId } });
    for (const j of journals) {
      await this.ingestion.upsert({
        companyId,
        userId: j.userId,
        memoryType: "journal",
        sourceTable: MEMORY_SOURCE_TABLES.JOURNAL_ENTRIES,
        sourceId: j.id,
        title: j.content.split("\n")[0]?.slice(0, 80) ?? "Journal entry",
        summary: j.summary ?? j.content.slice(0, 300),
        tags: j.tags,
        metadata: { mood: j.mood },
        occurredAt: j.entryDate.toISOString(),
      });
      indexed++;
    }

    const timeline = await this.prisma.timelineEvent.findMany({ where: { companyId } });
    for (const t of timeline) {
      await this.ingestion.upsert({
        companyId,
        memoryType: t.eventType === "meeting" ? "meeting" : "timeline",
        sourceTable: MEMORY_SOURCE_TABLES.TIMELINE_EVENTS,
        sourceId: t.id,
        title: t.title,
        summary: t.description ?? undefined,
        tags: [t.eventType],
        metadata: t.metadata as Record<string, unknown>,
        occurredAt: t.occurredAt.toISOString(),
      });
      indexed++;
    }

    const nodes = await this.prisma.knowledgeNode.findMany({ where: { companyId } });
    for (const n of nodes) {
      await this.ingestion.upsert({
        companyId,
        memoryType: "knowledge",
        sourceTable: MEMORY_SOURCE_TABLES.KNOWLEDGE_NODES,
        sourceId: n.id,
        title: n.label,
        summary: n.content ?? undefined,
        tags: [n.nodeType],
        metadata: n.metadata as Record<string, unknown>,
        occurredAt: n.createdAt.toISOString(),
      });
      indexed++;
    }

    const bills = await this.prisma.bill.findMany({ where: { companyId } });
    for (const b of bills) {
      await this.ingestion.upsert({
        companyId,
        memoryType: "bill",
        sourceTable: MEMORY_SOURCE_TABLES.BILLS,
        sourceId: b.id,
        title: b.name,
        summary: `${b.amountCents / 100} ${b.currency} due ${b.dueDate.toISOString().slice(0, 10)}`,
        tags: b.isPaid ? ["paid", "billing"] : ["billing"],
        metadata: {
          amountCents: b.amountCents,
          currency: b.currency,
          isPaid: b.isPaid,
        },
        occurredAt: b.dueDate.toISOString(),
      });
      indexed++;
    }

    const notifications = await this.prisma.notification.findMany({
      where: { companyId },
    });
    for (const n of notifications) {
      await this.ingestion.upsert({
        companyId,
        userId: n.userId,
        memoryType: "notification",
        sourceTable: MEMORY_SOURCE_TABLES.NOTIFICATIONS,
        sourceId: n.id,
        title: n.title,
        summary: n.body.slice(0, 300),
        tags: [n.type],
        metadata: n.metadata as Record<string, unknown>,
        occurredAt: n.createdAt.toISOString(),
      });
      indexed++;
    }

    const recommendations = await this.prisma.agentRecommendation.findMany({
      where: { agentRun: { companyId } },
    });
    for (const r of recommendations) {
      await this.ingestion.upsert({
        companyId,
        memoryType: "recommendation",
        sourceTable: MEMORY_SOURCE_TABLES.AGENT_RECOMMENDATIONS,
        sourceId: r.id,
        title: r.title,
        summary: r.summary,
        tags: ["recommendation"],
        metadata: {
          confidence: r.confidence,
          roiEstimate: r.roiEstimate,
        },
        occurredAt: r.createdAt.toISOString(),
      });
      indexed++;
    }

    this.logger.log(`Backfilled ${indexed} memory records for company ${companyId}`);
    return { indexed };
  }

  private memoryToInput(
    companyId: string,
    m: {
      id: string;
      title: string;
      content: string;
      summary: string | null;
      tags: string[];
      source: string;
      metadata: unknown;
      createdAt: Date;
      updatedAt: Date;
    },
  ): MemoryRecordInput {
    const metadata = (m.metadata ?? {}) as Record<string, unknown>;
    const memoryType =
      m.source === "github"
        ? "git_activity"
        : metadata.category === "idea"
          ? "idea"
          : "note";

    return {
      companyId,
      memoryType,
      sourceTable: MEMORY_SOURCE_TABLES.MEMORIES,
      sourceId: m.id,
      title: m.title,
      summary: m.summary ?? m.content.slice(0, 300),
      tags: m.tags,
      metadata: { ...metadata, source: m.source },
      occurredAt: m.updatedAt.toISOString(),
    };
  }
}
