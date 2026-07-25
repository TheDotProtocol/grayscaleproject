import type { GraphNode, GraphNodeQuery, UpsertGraphNodeInput, CreateSyntheticNodeInput } from "./nodes.js";
import type {
  GraphEdge,
  CreateGraphEdgeInput,
  GraphEdgeQuery,
  GraphRelationshipType,
} from "./edges.js";

export interface GraphNeighbor {
  node: GraphNode;
  edge: GraphEdge;
  direction: "outbound" | "inbound";
}

export interface GraphSubgraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  truncated: boolean;
}

export interface GraphPath {
  nodes: GraphNode[];
  edges: GraphEdge[];
  depth: number;
}

export interface TraversalOptions {
  relationshipTypes?: GraphRelationshipType[];
  direction?: "outbound" | "inbound" | "both";
  nodeTypes?: string[];
  maxDepth?: number;
  limit?: number;
}

export interface RelatedToQuery {
  q?: string;
  nodeType?: string | string[];
  relationshipTypes?: GraphRelationshipType[];
  depth?: number;
  limit?: number;
}

export interface GraphSummary {
  companyId: string;
  nodeCount: number;
  edgeCount: number;
  orphanNodeCount: number;
  byNodeType: Record<string, number>;
  byRelationshipType: Record<string, number>;
  hubNodes: GraphHub[];
  knowledgeCoverage: number;
}

export interface GraphHub {
  nodeId: string;
  displayName: string;
  nodeType: string;
  edgeCount: number;
}

export interface CompanyHealthSummary {
  companyId: string;
  graph: GraphSummary;
  memoryRecordCount: number;
  recentEventCount: number;
}

export interface GraphNodePort {
  upsertFromEntity(input: UpsertGraphNodeInput): Promise<GraphNode>;
  getById(companyId: string, nodeId: string): Promise<GraphNode | null>;
  getBySource(
    companyId: string,
    sourceTable: string,
    sourceId: string,
  ): Promise<GraphNode | null>;
  find(companyId: string, query: GraphNodeQuery): Promise<GraphNode[]>;
  ensureCompanyNode(companyId: string, displayName: string): Promise<GraphNode>;
}

export interface GraphEdgePort {
  create(input: CreateGraphEdgeInput): Promise<GraphEdge>;
  archive(companyId: string, edgeId: string): Promise<void>;
  findBetween(
    companyId: string,
    sourceNodeId: string,
    targetNodeId: string,
  ): Promise<GraphEdge[]>;
  upsert(input: CreateGraphEdgeInput): Promise<GraphEdge>;
}

export interface GraphTraversalPort {
  neighbors(
    companyId: string,
    nodeId: string,
    opts?: TraversalOptions,
  ): Promise<GraphNeighbor[]>;
  expand(
    companyId: string,
    nodeId: string,
    depth: number,
    opts?: TraversalOptions,
  ): Promise<GraphSubgraph>;
  shortestPath(
    companyId: string,
    fromNodeId: string,
    toNodeId: string,
    maxDepth?: number,
  ): Promise<GraphPath | null>;
  relatedTo(companyId: string, query: RelatedToQuery): Promise<GraphSubgraph>;
}

export interface GraphSearchPort {
  searchNodes(companyId: string, query: GraphNodeQuery): Promise<GraphNode[]>;
}

export interface GraphValidationPort {
  validateEdge(
    companyId: string,
    sourceNode: GraphNode,
    targetNode: GraphNode,
    relationshipType: GraphRelationshipType,
  ): Promise<{ valid: boolean; reason?: string }>;
}

export interface GraphImportPort {
  importJson(
    companyId: string,
    payload: { nodes: UpsertGraphNodeInput[]; edges: CreateGraphEdgeInput[] },
  ): Promise<{ nodesImported: number; edgesImported: number; errors: string[] }>;
}

export interface GraphExportPort {
  exportJson(companyId: string): Promise<{
    nodes: GraphNode[];
    edges: GraphEdge[];
    exportedAt: string;
  }>;
  exportForProvider?(companyId: string, provider: string): Promise<unknown>;
}

export interface CompanyGraphContext {
  companyId: string;
  seedNodes: GraphNode[];
  subgraph: GraphSubgraph;
  summary: GraphSummary;
}
