import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import type {
  GraphNode,
  GraphNodePort,
  GraphNodeQuery,
  UpsertGraphNodeInput,
} from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";
import { rowToGraphNode } from "./graph.mapper";

@Injectable()
export class GraphNodeService implements GraphNodePort {
  private readonly logger = new Logger(GraphNodeService.name);

  constructor(private readonly prisma: PrismaService) {}

  async upsertFromEntity(input: UpsertGraphNodeInput): Promise<GraphNode> {
    if (!input.sourceTable || !input.sourceId) {
      throw new Error("Entity-backed nodes require sourceTable and sourceId");
    }

    const row = await this.prisma.graphNode.upsert({
      where: {
        companyId_sourceTable_sourceId: {
          companyId: input.companyId,
          sourceTable: input.sourceTable,
          sourceId: input.sourceId,
        },
      },
      create: {
        companyId: input.companyId,
        nodeType: input.nodeType,
        displayName: input.displayName,
        summary: input.summary,
        sourceTable: input.sourceTable,
        sourceId: input.sourceId,
        source: input.source ?? "event",
        metadata: (input.metadata ?? {}) as object,
        memoryRecordId: input.memoryRecordId,
        lifecycleStatus: input.lifecycleStatus ?? "active",
      },
      update: {
        nodeType: input.nodeType,
        displayName: input.displayName,
        summary: input.summary,
        metadata: (input.metadata ?? {}) as object,
        memoryRecordId: input.memoryRecordId,
        lifecycleStatus: input.lifecycleStatus ?? "active",
        version: { increment: 1 },
      },
    });

    this.logger.debug(`Upserted graph node ${row.id} (${input.nodeType})`);
    return rowToGraphNode(row);
  }

  async getById(companyId: string, nodeId: string): Promise<GraphNode | null> {
    const row = await this.prisma.graphNode.findFirst({
      where: { id: nodeId, companyId },
    });
    return row ? rowToGraphNode(row) : null;
  }

  async getBySource(
    companyId: string,
    sourceTable: string,
    sourceId: string,
  ): Promise<GraphNode | null> {
    const row = await this.prisma.graphNode.findUnique({
      where: {
        companyId_sourceTable_sourceId: { companyId, sourceTable, sourceId },
      },
    });
    return row ? rowToGraphNode(row) : null;
  }

  async find(companyId: string, query: GraphNodeQuery): Promise<GraphNode[]> {
    const types = query.nodeType
      ? Array.isArray(query.nodeType)
        ? query.nodeType
        : [query.nodeType]
      : undefined;

    const rows = await this.prisma.graphNode.findMany({
      where: {
        companyId,
        lifecycleStatus: query.lifecycleStatus ?? "active",
        ...(types?.length ? { nodeType: { in: types } } : {}),
        ...(query.sourceTable ? { sourceTable: query.sourceTable } : {}),
        ...(query.q?.trim()
          ? {
              OR: [
                { displayName: { contains: query.q.trim(), mode: "insensitive" } },
                { summary: { contains: query.q.trim(), mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { updatedAt: "desc" },
      take: query.limit ?? 50,
      skip: query.offset ?? 0,
    });

    return rows.map(rowToGraphNode);
  }

  async ensureCompanyNode(
    companyId: string,
    displayName: string,
  ): Promise<GraphNode> {
    const existing = await this.getBySource(companyId, "companies", companyId);
    if (existing) return existing;

    const row = await this.prisma.graphNode.create({
      data: {
        companyId,
        nodeType: "company",
        displayName,
        sourceTable: "companies",
        sourceId: companyId,
        source: "system",
      },
    });
    return rowToGraphNode(row);
  }

  async archiveNode(companyId: string, nodeId: string): Promise<GraphNode> {
    const row = await this.prisma.graphNode.update({
      where: { id: nodeId },
      data: { lifecycleStatus: "archived", version: { increment: 1 } },
    });
    if (row.companyId !== companyId) {
      throw new NotFoundException("Graph node not found");
    }
    return rowToGraphNode(row);
  }
}
