import { Injectable, NotFoundException } from "@nestjs/common";
import type {
  MemoryRecord,
  MemorySearchQuery,
  MemorySearchResult,
  MemoryQueryPort,
} from "@grayscale/platform";
import { MEMORY_SOURCE_TABLES } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class MemoryQueryService implements MemoryQueryPort {
  constructor(private readonly prisma: PrismaService) {}

  async search(
    companyId: string,
    query: MemorySearchQuery,
  ): Promise<MemorySearchResult> {
    const limit = Math.min(query.limit ?? 50, 100);
    const offset = query.offset ?? 0;

    const types = query.type
      ? Array.isArray(query.type)
        ? query.type
        : [query.type]
      : undefined;

    const where = {
      companyId,
      ...(types?.length ? { memoryType: { in: types } } : {}),
      ...(query.tags?.length
        ? { tags: { hasEvery: query.tags } }
        : {}),
      ...(query.from || query.to
        ? {
            occurredAt: {
              ...(query.from ? { gte: new Date(query.from) } : {}),
              ...(query.to ? { lte: new Date(query.to) } : {}),
            },
          }
        : {}),
      ...(query.q?.trim()
        ? {
            OR: [
              { title: { contains: query.q.trim(), mode: "insensitive" as const } },
              { summary: { contains: query.q.trim(), mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [rows, total] = await Promise.all([
      this.prisma.memoryRecord.findMany({
        where,
        orderBy: { occurredAt: "desc" },
        take: limit,
        skip: offset,
      }),
      this.prisma.memoryRecord.count({ where }),
    ]);

    return {
      items: rows.map((row) => this.toRecord(row)),
      total,
      query,
    };
  }

  async getById(companyId: string, id: string): Promise<MemoryRecord | null> {
    const row = await this.prisma.memoryRecord.findFirst({
      where: { id, companyId },
    });
    return row ? this.toRecord(row) : null;
  }

  async getBySource(
    companyId: string,
    sourceTable: string,
    sourceId: string,
  ): Promise<MemoryRecord | null> {
    const row = await this.prisma.memoryRecord.findFirst({
      where: { companyId, sourceTable, sourceId },
    });
    return row ? this.toRecord(row) : null;
  }

  /** Hydrate the original domain entity behind an index row */
  async resolveSource(record: MemoryRecord): Promise<unknown> {
    switch (record.sourceTable) {
      case MEMORY_SOURCE_TABLES.MEMORIES:
        return this.prisma.memory.findUnique({ where: { id: record.sourceId } });
      case MEMORY_SOURCE_TABLES.JOURNAL_ENTRIES:
        return this.prisma.journalEntry.findUnique({ where: { id: record.sourceId } });
      case MEMORY_SOURCE_TABLES.TIMELINE_EVENTS:
        return this.prisma.timelineEvent.findUnique({ where: { id: record.sourceId } });
      case MEMORY_SOURCE_TABLES.KNOWLEDGE_NODES:
        return this.prisma.knowledgeNode.findUnique({ where: { id: record.sourceId } });
      case MEMORY_SOURCE_TABLES.KNOWLEDGE_EDGES:
        return this.prisma.knowledgeEdge.findUnique({ where: { id: record.sourceId } });
      case MEMORY_SOURCE_TABLES.BILLS:
        return this.prisma.bill.findUnique({ where: { id: record.sourceId } });
      case MEMORY_SOURCE_TABLES.NOTIFICATIONS:
        return this.prisma.notification.findUnique({ where: { id: record.sourceId } });
      case MEMORY_SOURCE_TABLES.AGENT_RECOMMENDATIONS:
        return this.prisma.agentRecommendation.findUnique({
          where: { id: record.sourceId },
        });
      default:
        return null;
    }
  }

  async getWithSource(companyId: string, id: string) {
    const record = await this.getById(companyId, id);
    if (!record) throw new NotFoundException("Memory record not found");
    const source = await this.resolveSource(record);
    return { record, source };
  }

  private toRecord(row: {
    id: string;
    companyId: string;
    userId: string | null;
    department: string | null;
    memoryType: string;
    sourceTable: string;
    sourceId: string;
    title: string;
    summary: string | null;
    tags: string[];
    metadata: unknown;
    occurredAt: Date;
    createdAt: Date;
    updatedAt: Date;
    version: number;
    status: string;
    visibility: string;
    provenance: string;
    confidence: string;
    parentId: string | null;
    relatedIds: string[];
    ownerId: string | null;
    projectId: string | null;
    graphNodeId: string | null;
  }): MemoryRecord {
    return {
      id: row.id,
      companyId: row.companyId,
      userId: row.userId ?? undefined,
      department: row.department ?? undefined,
      memoryType: row.memoryType as MemoryRecord["memoryType"],
      sourceTable: row.sourceTable,
      sourceId: row.sourceId,
      title: row.title,
      summary: row.summary ?? undefined,
      tags: row.tags,
      metadata: (row.metadata ?? {}) as Record<string, unknown>,
      occurredAt: row.occurredAt.toISOString(),
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      version: row.version,
      status: row.status as MemoryRecord["status"],
      visibility: row.visibility as MemoryRecord["visibility"],
      provenance: row.provenance as MemoryRecord["provenance"],
      confidence: row.confidence as MemoryRecord["confidence"],
      parentId: row.parentId ?? undefined,
      relatedIds: row.relatedIds,
      ownerId: row.ownerId ?? undefined,
      projectId: row.projectId ?? undefined,
      graphNodeId: row.graphNodeId ?? undefined,
    };
  }
}
