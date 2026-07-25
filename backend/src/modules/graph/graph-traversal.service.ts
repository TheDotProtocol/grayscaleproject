import { Injectable } from "@nestjs/common";
import type {
  GraphTraversalPort,
  GraphNeighbor,
  GraphSubgraph,
  GraphPath,
  TraversalOptions,
  RelatedToQuery,
  GraphNode,
  GraphEdge,
} from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";
import { GraphNodeService } from "./graph-node.service";
import { rowToGraphEdge, rowToGraphNode } from "./graph.mapper";

@Injectable()
export class GraphTraversalService implements GraphTraversalPort {
  constructor(
    private readonly prisma: PrismaService,
    private readonly nodes: GraphNodeService,
  ) {}

  async neighbors(
    companyId: string,
    nodeId: string,
    opts: TraversalOptions = {},
  ): Promise<GraphNeighbor[]> {
    const direction = opts.direction ?? "both";
    const relTypes = opts.relationshipTypes;
    const limit = opts.limit ?? 100;

    const results: GraphNeighbor[] = [];

    if (direction === "outbound" || direction === "both") {
      const outbound = await this.prisma.graphEdge.findMany({
        where: {
          companyId,
          sourceNodeId: nodeId,
          lifecycleStatus: "active",
          ...(relTypes?.length ? { relationshipType: { in: relTypes } } : {}),
        },
        include: { targetNode: true },
        take: limit,
      });
      for (const e of outbound) {
        if (opts.nodeTypes?.length && !opts.nodeTypes.includes(e.targetNode.nodeType)) {
          continue;
        }
        results.push({
          node: rowToGraphNode(e.targetNode),
          edge: rowToGraphEdge(e),
          direction: "outbound",
        });
      }
    }

    if (direction === "inbound" || direction === "both") {
      const inbound = await this.prisma.graphEdge.findMany({
        where: {
          companyId,
          targetNodeId: nodeId,
          lifecycleStatus: "active",
          ...(relTypes?.length ? { relationshipType: { in: relTypes } } : {}),
        },
        include: { sourceNode: true },
        take: limit,
      });
      for (const e of inbound) {
        if (opts.nodeTypes?.length && !opts.nodeTypes.includes(e.sourceNode.nodeType)) {
          continue;
        }
        results.push({
          node: rowToGraphNode(e.sourceNode),
          edge: rowToGraphEdge(e),
          direction: "inbound",
        });
      }
    }

    return results.slice(0, limit);
  }

  async expand(
    companyId: string,
    nodeId: string,
    depth: number,
    opts: TraversalOptions = {},
  ): Promise<GraphSubgraph> {
    const maxDepth = Math.min(opts.maxDepth ?? depth, 5);
    const limit = opts.limit ?? 500;

    const nodeMap = new Map<string, GraphNode>();
    const edgeMap = new Map<string, GraphEdge>();
    let truncated = false;

    const start = await this.nodes.getById(companyId, nodeId);
    if (!start) return { nodes: [], edges: [], truncated: false };
    nodeMap.set(start.id, start);

    let frontier = [nodeId];
    for (let d = 0; d < maxDepth; d++) {
      const nextFrontier: string[] = [];
      for (const nid of frontier) {
        const nbrs = await this.neighbors(companyId, nid, opts);
        for (const n of nbrs) {
          nodeMap.set(n.node.id, n.node);
          edgeMap.set(n.edge.id, n.edge);
          if (!nodeMap.has(n.node.id)) nextFrontier.push(n.node.id);
          if (nodeMap.size + edgeMap.size >= limit) {
            truncated = true;
            break;
          }
        }
        if (truncated) break;
      }
      if (truncated) break;
      frontier = [...new Set(nextFrontier)];
    }

    return {
      nodes: [...nodeMap.values()],
      edges: [...edgeMap.values()],
      truncated,
    };
  }

  async shortestPath(
    companyId: string,
    fromNodeId: string,
    toNodeId: string,
    maxDepth = 6,
  ): Promise<GraphPath | null> {
    if (fromNodeId === toNodeId) {
      const node = await this.nodes.getById(companyId, fromNodeId);
      return node ? { nodes: [node], edges: [], depth: 0 } : null;
    }

    type QueueItem = { nodeId: string; path: string[]; edges: string[] };
    const queue: QueueItem[] = [{ nodeId: fromNodeId, path: [fromNodeId], edges: [] }];
    const visited = new Set<string>([fromNodeId]);

    while (queue.length > 0) {
      const { nodeId, path, edges: edgeIds } = queue.shift()!;
      if (path.length > maxDepth + 1) continue;

      const nbrs = await this.neighbors(companyId, nodeId, { direction: "outbound" });
      for (const n of nbrs) {
        if (visited.has(n.node.id)) continue;
        visited.add(n.node.id);
        const newPath = [...path, n.node.id];
        const newEdges = [...edgeIds, n.edge.id];

        if (n.node.id === toNodeId) {
          const nodes = await Promise.all(
            newPath.map((id) => this.nodes.getById(companyId, id)),
          );
          const edgeRows = await this.prisma.graphEdge.findMany({
            where: { id: { in: newEdges } },
          });
          return {
            nodes: nodes.filter(Boolean) as GraphNode[],
            edges: edgeRows.map(rowToGraphEdge),
            depth: newPath.length - 1,
          };
        }

        queue.push({ nodeId: n.node.id, path: newPath, edges: newEdges });
      }
    }

    return null;
  }

  async relatedTo(
    companyId: string,
    query: RelatedToQuery,
  ): Promise<GraphSubgraph> {
    const seeds = await this.nodes.find(companyId, {
      q: query.q,
      nodeType: query.nodeType as never,
      limit: 10,
    });

    const nodeMap = new Map<string, GraphNode>();
    const edgeMap = new Map<string, GraphEdge>();
    let truncated = false;
    const depth = Math.min(query.depth ?? 2, 5);

    for (const seed of seeds) {
      const sub = await this.expand(companyId, seed.id, depth, {
        relationshipTypes: query.relationshipTypes,
        limit: query.limit ?? 200,
      });
      for (const n of sub.nodes) nodeMap.set(n.id, n);
      for (const e of sub.edges) edgeMap.set(e.id, e);
      if (sub.truncated) truncated = true;
    }

    return {
      nodes: [...nodeMap.values()],
      edges: [...edgeMap.values()],
      truncated,
    };
  }
}
