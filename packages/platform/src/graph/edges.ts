import type { GraphLifecycleStatus } from "./nodes.js";

/** Typed relationship vocabulary */
export const GRAPH_RELATIONSHIP_TYPES = [
  "OWNS",
  "BELONGS_TO",
  "PART_OF",
  "RELATED_TO",
  "CREATED",
  "UPDATED",
  "DEPENDS_ON",
  "BLOCKS",
  "ASSIGNED_TO",
  "GENERATED",
  "REFERENCES",
  "CONNECTED_TO",
  "IMPLEMENTS",
  "DISCUSSED_IN",
  "ATTACHED_TO",
  "APPROVED_BY",
  "RECOMMENDED_BY",
  "REQUIRES",
  "SUPPORTS",
] as const;

export type GraphRelationshipType = (typeof GRAPH_RELATIONSHIP_TYPES)[number];

export const GRAPH_EDGE_DIRECTIONS = ["directed", "bidirectional"] as const;
export type GraphEdgeDirection = (typeof GRAPH_EDGE_DIRECTIONS)[number];

export const GRAPH_EDGE_CONFIDENCE = [
  "verified",
  "trusted",
  "imported",
  "generated",
  "inferred",
  "unknown",
] as const;
export type GraphEdgeConfidence = (typeof GRAPH_EDGE_CONFIDENCE)[number];

export const GRAPH_EDGE_SOURCES = [
  "event",
  "manual",
  "import",
  "inference",
  "system",
  "migration",
] as const;
export type GraphEdgeSource = (typeof GRAPH_EDGE_SOURCES)[number];

export interface GraphEdgeAudit {
  createdBy?: string;
  source: GraphEdgeSource;
  sourceEventId?: string;
  correlationId?: string;
}

export interface GraphEdge {
  id: string;
  companyId: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationshipType: GraphRelationshipType;
  strength: number;
  confidence: GraphEdgeConfidence;
  direction: GraphEdgeDirection;
  lifecycleStatus: GraphLifecycleStatus;
  schemaVersion: number;
  version: number;
  metadata: Record<string, unknown>;
  evidence: unknown[];
  reason?: string;
  audit: GraphEdgeAudit;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGraphEdgeInput {
  companyId: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationshipType: GraphRelationshipType;
  strength?: number;
  confidence?: GraphEdgeConfidence;
  direction?: GraphEdgeDirection;
  metadata?: Record<string, unknown>;
  evidence?: unknown[];
  reason?: string;
  createdBy?: string;
  source?: GraphEdgeSource;
  sourceEventId?: string;
  correlationId?: string;
}

export interface GraphEdgeQuery {
  relationshipType?: GraphRelationshipType | GraphRelationshipType[];
  sourceNodeId?: string;
  targetNodeId?: string;
  lifecycleStatus?: GraphLifecycleStatus;
  limit?: number;
  offset?: number;
}
