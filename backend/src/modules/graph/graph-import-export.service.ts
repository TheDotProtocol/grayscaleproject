import { Injectable, Logger } from "@nestjs/common";
import type {
  GraphImportPort,
  GraphExportPort,
  UpsertGraphNodeInput,
  CreateGraphEdgeInput,
  GraphNode,
  GraphEdge,
} from "@grayscale/platform";
import { GraphNodeService } from "./graph-node.service";
import { GraphEdgeService } from "./graph-edge.service";
import { PrismaService } from "../../prisma/prisma.service";
import { rowToGraphEdge, rowToGraphNode } from "./graph.mapper";

@Injectable()
export class GraphImportService implements GraphImportPort {
  private readonly logger = new Logger(GraphImportService.name);

  constructor(
    private readonly nodes: GraphNodeService,
    private readonly edges: GraphEdgeService,
  ) {}

  async importJson(
    companyId: string,
    payload: { nodes: UpsertGraphNodeInput[]; edges: CreateGraphEdgeInput[] },
  ): Promise<{ nodesImported: number; edgesImported: number; errors: string[] }> {
    const errors: string[] = [];
    let nodesImported = 0;
    let edgesImported = 0;

    const idMap = new Map<string, string>();

    for (const node of payload.nodes) {
      try {
        const input = { ...node, companyId, source: node.source ?? "import" };
        const created = node.sourceTable && node.sourceId
          ? await this.nodes.upsertFromEntity(input)
          : await this.nodes.ensureCompanyNode(companyId, node.displayName);
        if (node.sourceId) idMap.set(node.sourceId, created.id);
        nodesImported++;
      } catch (err) {
        errors.push(`Node ${node.displayName}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    for (const edge of payload.edges) {
      try {
        await this.edges.upsert({ ...edge, companyId, source: edge.source ?? "import" });
        edgesImported++;
      } catch (err) {
        errors.push(`Edge ${edge.relationshipType}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    this.logger.log(
      `Imported ${nodesImported} nodes, ${edgesImported} edges for ${companyId}`,
    );
    return { nodesImported, edgesImported, errors };
  }
}

@Injectable()
export class GraphExportService implements GraphExportPort {
  constructor(private readonly prisma: PrismaService) {}

  async exportJson(companyId: string): Promise<{
    nodes: GraphNode[];
    edges: GraphEdge[];
    exportedAt: string;
  }> {
    const [nodeRows, edgeRows] = await Promise.all([
      this.prisma.graphNode.findMany({
        where: { companyId, lifecycleStatus: "active" },
      }),
      this.prisma.graphEdge.findMany({
        where: { companyId, lifecycleStatus: "active" },
      }),
    ]);

    return {
      nodes: nodeRows.map(rowToGraphNode),
      edges: edgeRows.map(rowToGraphEdge),
      exportedAt: new Date().toISOString(),
    };
  }

  async exportForProvider(companyId: string, provider: string): Promise<unknown> {
    const data = await this.exportJson(companyId);
    return {
      provider,
      format: provider === "neo4j" ? "cypher-ready" : "json",
      ...data,
      note: "Full provider sync not implemented — export payload only",
    };
  }
}
