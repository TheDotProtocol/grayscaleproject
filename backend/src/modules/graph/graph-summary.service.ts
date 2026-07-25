import { Injectable } from "@nestjs/common";
import type { GraphSummary, CompanyHealthSummary, GraphHub } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";
import { GraphNodeService } from "./graph-node.service";

@Injectable()
export class GraphSummaryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly nodes: GraphNodeService,
  ) {}

  async getSummary(companyId: string): Promise<GraphSummary> {
    const [nodeCount, edgeCount, nodesByType, edgesByType, memoryCount] =
      await Promise.all([
        this.prisma.graphNode.count({
          where: { companyId, lifecycleStatus: "active" },
        }),
        this.prisma.graphEdge.count({
          where: { companyId, lifecycleStatus: "active" },
        }),
        this.prisma.graphNode.groupBy({
          by: ["nodeType"],
          where: { companyId, lifecycleStatus: "active" },
          _count: true,
        }),
        this.prisma.graphEdge.groupBy({
          by: ["relationshipType"],
          where: { companyId, lifecycleStatus: "active" },
          _count: true,
        }),
        this.prisma.memoryRecord.count({
          where: { companyId, status: "active" },
        }),
      ]);

    const byNodeType: Record<string, number> = {};
    for (const g of nodesByType) byNodeType[g.nodeType] = g._count;

    const byRelationshipType: Record<string, number> = {};
    for (const g of edgesByType) byRelationshipType[g.relationshipType] = g._count;

    const hubNodes = await this.computeHubs(companyId);
    const orphanNodeCount = await this.countOrphans(companyId);
    const knowledgeCoverage =
      nodeCount === 0 ? 0 : Math.min(1, memoryCount / nodeCount);

    return {
      companyId,
      nodeCount,
      edgeCount,
      orphanNodeCount,
      byNodeType,
      byRelationshipType,
      hubNodes,
      knowledgeCoverage: Math.round(knowledgeCoverage * 100) / 100,
    };
  }

  async getCompanyHealthSummary(companyId: string): Promise<CompanyHealthSummary> {
    const [graph, memoryRecordCount, recentEventCount] = await Promise.all([
      this.getSummary(companyId),
      this.prisma.memoryRecord.count({ where: { companyId, status: "active" } }),
      this.prisma.domainEvent.count({
        where: {
          companyId,
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    return { companyId, graph, memoryRecordCount, recentEventCount };
  }

  private async computeHubs(companyId: string, limit = 5): Promise<GraphHub[]> {
    const nodes = await this.prisma.graphNode.findMany({
      where: { companyId, lifecycleStatus: "active" },
      select: { id: true, displayName: true, nodeType: true },
      take: 100,
    });

    const hubs: GraphHub[] = [];
    for (const n of nodes) {
      const edgeCount = await this.prisma.graphEdge.count({
        where: {
          companyId,
          lifecycleStatus: "active",
          OR: [{ sourceNodeId: n.id }, { targetNodeId: n.id }],
        },
      });
      if (edgeCount > 0) {
        hubs.push({
          nodeId: n.id,
          displayName: n.displayName,
          nodeType: n.nodeType,
          edgeCount,
        });
      }
    }

    return hubs.sort((a, b) => b.edgeCount - a.edgeCount).slice(0, limit);
  }

  private async countOrphans(companyId: string): Promise<number> {
    const nodes = await this.prisma.graphNode.findMany({
      where: { companyId, lifecycleStatus: "active" },
      select: { id: true },
    });

    let orphans = 0;
    for (const n of nodes) {
      const count = await this.prisma.graphEdge.count({
        where: {
          companyId,
          lifecycleStatus: "active",
          OR: [{ sourceNodeId: n.id }, { targetNodeId: n.id }],
        },
      });
      if (count === 0) orphans++;
    }
    return orphans;
  }
}
