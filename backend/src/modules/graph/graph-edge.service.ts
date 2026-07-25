import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import type { GraphEdge, GraphEdgePort, CreateGraphEdgeInput } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";
import { GraphValidationService } from "./graph-validation.service";
import { GraphNodeService } from "./graph-node.service";
import { rowToGraphEdge } from "./graph.mapper";

@Injectable()
export class GraphEdgeService implements GraphEdgePort {
  private readonly logger = new Logger(GraphEdgeService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly validation: GraphValidationService,
    private readonly nodes: GraphNodeService,
  ) {}

  async create(input: CreateGraphEdgeInput): Promise<GraphEdge> {
    const source = await this.nodes.getById(input.companyId, input.sourceNodeId);
    const target = await this.nodes.getById(input.companyId, input.targetNodeId);
    if (!source || !target) {
      throw new NotFoundException("Source or target node not found");
    }

    const check = await this.validation.validateEdge(
      input.companyId,
      source,
      target,
      input.relationshipType,
    );
    if (!check.valid) {
      throw new Error(check.reason ?? "Invalid relationship");
    }

    const row = await this.prisma.graphEdge.create({
      data: {
        companyId: input.companyId,
        sourceNodeId: input.sourceNodeId,
        targetNodeId: input.targetNodeId,
        relationshipType: input.relationshipType,
        strength: input.strength ?? 1.0,
        confidence: input.confidence ?? "unknown",
        direction: input.direction ?? "directed",
        metadata: (input.metadata ?? {}) as object,
        evidence: (input.evidence ?? []) as object,
        reason: input.reason,
        createdBy: input.createdBy,
        edgeSource: input.source ?? "manual",
        sourceEventId: input.sourceEventId,
        correlationId: input.correlationId,
      },
    });

    this.logger.debug(
      `Created edge ${source.displayName} -[${input.relationshipType}]-> ${target.displayName}`,
    );
    return rowToGraphEdge(row);
  }

  async upsert(input: CreateGraphEdgeInput): Promise<GraphEdge> {
    const source = await this.nodes.getById(input.companyId, input.sourceNodeId);
    const target = await this.nodes.getById(input.companyId, input.targetNodeId);
    if (!source || !target) {
      throw new NotFoundException("Source or target node not found");
    }

    const check = await this.validation.validateEdge(
      input.companyId,
      source,
      target,
      input.relationshipType,
    );
    if (!check.valid) {
      throw new Error(check.reason ?? "Invalid relationship");
    }

    const row = await this.prisma.graphEdge.upsert({
      where: {
        companyId_sourceNodeId_targetNodeId_relationshipType: {
          companyId: input.companyId,
          sourceNodeId: input.sourceNodeId,
          targetNodeId: input.targetNodeId,
          relationshipType: input.relationshipType,
        },
      },
      create: {
        companyId: input.companyId,
        sourceNodeId: input.sourceNodeId,
        targetNodeId: input.targetNodeId,
        relationshipType: input.relationshipType,
        strength: input.strength ?? 1.0,
        confidence: input.confidence ?? "unknown",
        direction: input.direction ?? "directed",
        metadata: (input.metadata ?? {}) as object,
        evidence: (input.evidence ?? []) as object,
        reason: input.reason,
        createdBy: input.createdBy,
        edgeSource: input.source ?? "manual",
        sourceEventId: input.sourceEventId,
        correlationId: input.correlationId,
      },
      update: {
        strength: input.strength ?? undefined,
        reason: input.reason,
        confidence: input.confidence,
        version: { increment: 1 },
        lifecycleStatus: "active",
      },
    });

    return rowToGraphEdge(row);
  }

  async archive(companyId: string, edgeId: string): Promise<void> {
    const row = await this.prisma.graphEdge.findFirst({
      where: { id: edgeId, companyId },
    });
    if (!row) throw new NotFoundException("Graph edge not found");
    await this.prisma.graphEdge.update({
      where: { id: edgeId },
      data: { lifecycleStatus: "archived", version: { increment: 1 } },
    });
  }

  async findBetween(
    companyId: string,
    sourceNodeId: string,
    targetNodeId: string,
  ): Promise<GraphEdge[]> {
    const rows = await this.prisma.graphEdge.findMany({
      where: {
        companyId,
        lifecycleStatus: "active",
        OR: [
          { sourceNodeId, targetNodeId },
          { sourceNodeId: targetNodeId, targetNodeId: sourceNodeId },
        ],
      },
    });
    return rows.map(rowToGraphEdge);
  }
}
