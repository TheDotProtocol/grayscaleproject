import { Injectable } from "@nestjs/common";
import { DOMAIN_EVENTS } from "@grayscale/shared";
import { EventsService } from "../events/events.service";
import { GraphNodeService } from "../graph/graph-node.service";
import { GraphEdgeService } from "../graph/graph-edge.service";
import { GraphExportService } from "../graph/graph-import-export.service";
import type { GraphNodeType } from "@grayscale/platform";

/**
 * Legacy knowledge API — delegates to GraphModule (AIP-9).
 * @deprecated Use /companies/:id/graph/* endpoints
 */
@Injectable()
export class KnowledgeService {
  constructor(
    private readonly events: EventsService,
    private readonly nodes: GraphNodeService,
    private readonly edges: GraphEdgeService,
    private readonly graphExport: GraphExportService,
  ) {}

  async getGraph(companyId: string) {
    return this.graphExport.exportJson(companyId);
  }

  async createNode(
    companyId: string,
    data: { label: string; nodeType: string; content?: string },
  ) {
    const nodeType = (data.nodeType === "decision" || data.nodeType === "architecture_decision"
      ? data.nodeType
      : "knowledge_article") as GraphNodeType;

    const sourceId = crypto.randomUUID();
    const node = await this.nodes.upsertFromEntity({
      companyId,
      nodeType,
      displayName: data.label,
      summary: data.content,
      sourceTable: "knowledge_nodes",
      sourceId,
      source: "manual",
    });

    await this.events.publish(DOMAIN_EVENTS.KNOWLEDGE_NODE_CREATED, companyId, {
      id: sourceId,
      label: data.label,
      nodeType: data.nodeType,
      content: data.content,
    });

    return {
      id: sourceId,
      companyId,
      label: data.label,
      nodeType: data.nodeType,
      content: data.content,
      graphNodeId: node.id,
    };
  }

  async createEdge(
    companyId: string,
    data: { fromNodeId: string; toNodeId: string; relationship: string },
  ) {
    const rel = data.relationship.toUpperCase().replace(/\s+/g, "_");
    const edge = await this.edges.create({
      companyId,
      sourceNodeId: data.fromNodeId,
      targetNodeId: data.toNodeId,
      relationshipType: rel as never,
      source: "manual",
    });

    await this.events.publish(DOMAIN_EVENTS.KNOWLEDGE_EDGE_CREATED, companyId, {
      id: edge.id,
      fromNodeId: data.fromNodeId,
      toNodeId: data.toNodeId,
      relationship: data.relationship,
    });

    return {
      id: edge.id,
      companyId,
      fromNodeId: data.fromNodeId,
      toNodeId: data.toNodeId,
      relationship: data.relationship,
    };
  }
}
