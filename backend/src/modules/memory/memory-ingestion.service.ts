import { Injectable, Logger } from "@nestjs/common";
import type {
  MemoryRecord,
  MemoryRecordInput,
  MemoryIngestionPort,
  MemoryProvenance,
  MemoryConfidence,
} from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class MemoryIngestionService implements MemoryIngestionPort {
  private readonly logger = new Logger(MemoryIngestionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async upsert(input: MemoryRecordInput): Promise<MemoryRecord> {
    const row = await this.prisma.memoryRecord.upsert({
      where: {
        sourceTable_sourceId: {
          sourceTable: input.sourceTable,
          sourceId: input.sourceId,
        },
      },
      create: this.buildCreateData(input),
      update: this.buildUpdateData(input),
    });

    this.logger.debug(
      `Indexed ${input.memoryType} ${input.sourceTable}/${input.sourceId}`,
    );

    return this.toRecord(row);
  }

  async remove(sourceTable: string, sourceId: string): Promise<void> {
    await this.prisma.memoryRecord.updateMany({
      where: { sourceTable, sourceId },
      data: { status: "deleted", version: { increment: 1 } },
    });
    this.logger.debug(`Archived index ${sourceTable}/${sourceId}`);
  }

  async linkGraphNode(memoryId: string, graphNodeId: string): Promise<MemoryRecord> {
    const row = await this.prisma.memoryRecord.update({
      where: { id: memoryId },
      data: { graphNodeId, version: { increment: 1 } },
    });
    return this.toRecord(row);
  }

  async linkGraphNodeBySource(
    sourceTable: string,
    sourceId: string,
    graphNodeId: string,
  ): Promise<MemoryRecord | null> {
    const existing = await this.prisma.memoryRecord.findUnique({
      where: { sourceTable_sourceId: { sourceTable, sourceId } },
    });
    if (!existing) return null;
    return this.linkGraphNode(existing.id, graphNodeId);
  }

  private buildCreateData(input: MemoryRecordInput) {
    return {
      companyId: input.companyId,
      userId: input.userId,
      department: input.department,
      memoryType: input.memoryType,
      sourceTable: input.sourceTable,
      sourceId: input.sourceId,
      title: input.title,
      summary: input.summary,
      tags: input.tags ?? [],
      metadata: (input.metadata ?? {}) as object,
      occurredAt: new Date(input.occurredAt),
      version: input.version ?? 1,
      status: input.status ?? "active",
      visibility: input.visibility ?? "company",
      provenance: input.provenance ?? "unknown",
      confidence: input.confidence ?? "unknown",
      parentId: input.parentId,
      relatedIds: input.relatedIds ?? [],
      ownerId: input.ownerId,
      projectId: input.projectId,
      graphNodeId: input.graphNodeId,
    };
  }

  private buildUpdateData(input: MemoryRecordInput) {
    return {
      userId: input.userId,
      department: input.department,
      memoryType: input.memoryType,
      title: input.title,
      summary: input.summary,
      tags: input.tags ?? [],
      metadata: (input.metadata ?? {}) as object,
      occurredAt: new Date(input.occurredAt),
      provenance: input.provenance,
      confidence: input.confidence,
      parentId: input.parentId,
      relatedIds: input.relatedIds,
      ownerId: input.ownerId,
      projectId: input.projectId,
      graphNodeId: input.graphNodeId,
      version: { increment: 1 },
    };
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
      provenance: row.provenance as MemoryProvenance,
      confidence: row.confidence as MemoryConfidence,
      parentId: row.parentId ?? undefined,
      relatedIds: row.relatedIds,
      ownerId: row.ownerId ?? undefined,
      projectId: row.projectId ?? undefined,
      graphNodeId: row.graphNodeId ?? undefined,
    };
  }
}
