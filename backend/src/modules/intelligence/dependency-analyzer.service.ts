import { Injectable } from "@nestjs/common";
import type { IntelligenceEngine, DependencyReport } from "@grayscale/platform";
import { GraphTraversalService } from "../graph/graph-traversal.service";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class DependencyAnalyzerService implements IntelligenceEngine {
  readonly id = "dependencies";
  readonly name = "Dependency Analyzer";
  readonly version = 1;

  constructor(
    private readonly prisma: PrismaService,
    private readonly traversal: GraphTraversalService,
  ) {}

  async contribute(companyId: string) {
    const report = await this.analyze(companyId);
    return {
      engineId: this.id,
      data: { dependencyReport: report },
      computedAt: new Date().toISOString(),
    };
  }

  async analyze(companyId: string): Promise<DependencyReport> {
    const blockedEdges = await this.prisma.graphEdge.findMany({
      where: {
        companyId,
        lifecycleStatus: "active",
        relationshipType: { in: ["DEPENDS_ON", "REQUIRES", "BLOCKS"] },
      },
      include: { sourceNode: true, targetNode: true },
      take: 200,
    });

    const blockedProjects: DependencyReport["blockedProjects"] = [];
    const blockedTasks: DependencyReport["blockedTasks"] = [];
    const chains: DependencyReport["crossProjectDependencies"] = [];

    for (const edge of blockedEdges) {
      const entity = {
        entityType: edge.sourceNode.nodeType,
        entityId: edge.sourceNode.sourceId ?? edge.sourceNode.id,
        displayName: edge.sourceNode.displayName,
        blockedBy: [
          {
            type: edge.targetNode.nodeType,
            id: edge.targetNode.sourceId ?? edge.targetNode.id,
            relationship: edge.relationshipType,
          },
        ],
      };

      if (edge.sourceNode.nodeType === "project") {
        blockedProjects.push(entity);
      } else if (edge.sourceNode.nodeType === "task") {
        blockedTasks.push(entity);
      }

      if (edge.sourceNode.nodeType === "project" && edge.targetNode.nodeType === "project") {
        chains.push({
          rootId: edge.sourceNode.id,
          chain: [
            {
              nodeId: edge.sourceNode.id,
              nodeType: edge.sourceNode.nodeType,
              relationship: edge.relationshipType,
            },
            {
              nodeId: edge.targetNode.id,
              nodeType: edge.targetNode.nodeType,
              relationship: edge.relationshipType,
            },
          ],
          depth: 2,
        });
      }
    }

    return {
      companyId,
      generatedAt: new Date().toISOString(),
      blockedProjects,
      blockedTasks,
      crossProjectDependencies: chains,
      summary: {
        totalBlockers: blockedProjects.length + blockedTasks.length,
        criticalPathLength: chains.length > 0 ? Math.max(...chains.map((c) => c.depth)) : 0,
      },
    };
  }
}
