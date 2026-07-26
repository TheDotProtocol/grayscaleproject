import { Injectable } from "@nestjs/common";
import type { OrgIntelligenceEdge, OrgIntelligenceGraph, OrgIntelligenceGraphPort, OrgIntelligenceNode } from "@grayscale/platform";
import { EventsService } from "../events/events.service";

@Injectable()
export class IntelligenceGraphService implements OrgIntelligenceGraphPort {
  private readonly nodes = new Map<string, OrgIntelligenceNode>();
  private readonly edges = new Map<string, OrgIntelligenceEdge>();

  constructor(private readonly events: EventsService) {}

  async upsertNode(input: Omit<OrgIntelligenceNode, "nodeId" | "createdAt">): Promise<OrgIntelligenceNode> {
    const existing = [...this.nodes.values()].find(
      (n) => n.companyId === input.companyId && n.sourceRecordId === input.sourceRecordId && n.type === input.type,
    );
    const node: OrgIntelligenceNode = existing
      ? { ...existing, ...input, version: existing.version + 1 }
      : { ...input, nodeId: crypto.randomUUID(), createdAt: new Date().toISOString() };
    this.nodes.set(node.nodeId, node);
    await this.events.publish("org-intelligence-graph.updated", node.companyId, { nodeId: node.nodeId, type: node.type });
    return node;
  }

  async linkNodes(input: Omit<OrgIntelligenceEdge, "edgeId" | "createdAt">): Promise<OrgIntelligenceEdge> {
    const edge: OrgIntelligenceEdge = { ...input, edgeId: crypto.randomUUID(), createdAt: new Date().toISOString() };
    this.edges.set(edge.edgeId, edge);
    return edge;
  }

  async assemble(companyId: string): Promise<OrgIntelligenceGraph> {
    return {
      companyId,
      nodes: [...this.nodes.values()].filter((n) => n.companyId === companyId),
      edges: [...this.edges.values()].filter((e) => e.companyId === companyId),
      assembledAt: new Date().toISOString(),
    };
  }
}
