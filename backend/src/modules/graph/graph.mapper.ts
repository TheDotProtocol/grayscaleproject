import type {
  GraphNode,
  GraphEdge,
  GraphNodeType,
  GraphLifecycleStatus,
  GraphNodeSource,
  GraphRelationshipType,
  GraphEdgeDirection,
  GraphEdgeConfidence,
  GraphEdgeSource,
} from "@grayscale/platform";

type GraphNodeRow = {
  id: string;
  companyId: string;
  nodeType: string;
  displayName: string;
  summary: string | null;
  lifecycleStatus: string;
  sourceTable: string | null;
  sourceId: string | null;
  source: string;
  schemaVersion: number;
  version: number;
  metadata: unknown;
  memoryRecordId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type GraphEdgeRow = {
  id: string;
  companyId: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationshipType: string;
  strength: number;
  confidence: string;
  direction: string;
  lifecycleStatus: string;
  schemaVersion: number;
  version: number;
  metadata: unknown;
  evidence: unknown;
  reason: string | null;
  createdBy: string | null;
  edgeSource: string;
  sourceEventId: string | null;
  correlationId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export function rowToGraphNode(row: GraphNodeRow): GraphNode {
  return {
    id: row.id,
    companyId: row.companyId,
    nodeType: row.nodeType as GraphNodeType,
    displayName: row.displayName,
    summary: row.summary ?? undefined,
    lifecycleStatus: row.lifecycleStatus as GraphLifecycleStatus,
    sourceTable: row.sourceTable ?? undefined,
    sourceId: row.sourceId ?? undefined,
    source: row.source as GraphNodeSource,
    schemaVersion: row.schemaVersion,
    version: row.version,
    metadata: (row.metadata ?? {}) as Record<string, unknown>,
    memoryRecordId: row.memoryRecordId ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function rowToGraphEdge(row: GraphEdgeRow): GraphEdge {
  return {
    id: row.id,
    companyId: row.companyId,
    sourceNodeId: row.sourceNodeId,
    targetNodeId: row.targetNodeId,
    relationshipType: row.relationshipType as GraphRelationshipType,
    strength: row.strength,
    confidence: row.confidence as GraphEdgeConfidence,
    direction: row.direction as GraphEdgeDirection,
    lifecycleStatus: row.lifecycleStatus as GraphLifecycleStatus,
    schemaVersion: row.schemaVersion,
    version: row.version,
    metadata: (row.metadata ?? {}) as Record<string, unknown>,
    evidence: Array.isArray(row.evidence) ? row.evidence : [],
    reason: row.reason ?? undefined,
    audit: {
      createdBy: row.createdBy ?? undefined,
      source: row.edgeSource as GraphEdgeSource,
      sourceEventId: row.sourceEventId ?? undefined,
      correlationId: row.correlationId ?? undefined,
    },
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
