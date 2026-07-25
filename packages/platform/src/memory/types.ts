/**
 * Memory Engine v2 — identity, provenance, confidence, relationship readiness.
 */

export const MEMORY_STATUS = ["active", "archived", "deleted"] as const;
export type MemoryStatus = (typeof MEMORY_STATUS)[number];

export const MEMORY_VISIBILITY = [
  "company",
  "department",
  "private",
  "system",
] as const;
export type MemoryVisibility = (typeof MEMORY_VISIBILITY)[number];

export const MEMORY_PROVENANCE = [
  "user_created",
  "imported",
  "github",
  "calendar",
  "plugin",
  "ai_generated",
  "ai_inferred",
  "system_generated",
  "manual",
] as const;
export type MemoryProvenance = (typeof MEMORY_PROVENANCE)[number];

export const MEMORY_CONFIDENCE = [
  "verified",
  "trusted",
  "imported",
  "generated",
  "inferred",
  "unknown",
] as const;
export type MemoryConfidence = (typeof MEMORY_CONFIDENCE)[number];

export const MEMORY_TYPES = [
  "note",
  "journal",
  "timeline",
  "meeting",
  "bill",
  "notification",
  "recommendation",
  "knowledge",
  "git_activity",
  "integration",
  "idea",
  "document",
  "adr",
  "project",
  "task",
  "approval",
  "bookmark",
  "decision",
] as const;

export type MemoryType = (typeof MEMORY_TYPES)[number];

export const MEMORY_SOURCE_TABLES = {
  MEMORIES: "memories",
  JOURNAL_ENTRIES: "journal_entries",
  TIMELINE_EVENTS: "timeline_events",
  KNOWLEDGE_NODES: "knowledge_nodes",
  KNOWLEDGE_EDGES: "knowledge_edges",
  BILLS: "bills",
  NOTIFICATIONS: "notifications",
  AGENT_RECOMMENDATIONS: "agent_recommendations",
  GRAPH_NODES: "graph_nodes",
  NORMALIZED_ENTITIES: "normalized_entity_records",
} as const;

export type MemorySourceTable =
  (typeof MEMORY_SOURCE_TABLES)[keyof typeof MEMORY_SOURCE_TABLES];

export interface MemoryRecord {
  id: string;
  companyId: string;
  userId?: string;
  department?: string;
  memoryType: MemoryType;
  sourceTable: string;
  sourceId: string;
  title: string;
  summary?: string;
  tags: string[];
  metadata: Record<string, unknown>;
  occurredAt: string;
  createdAt: string;
  updatedAt: string;
  /** v2 identity */
  version: number;
  status: MemoryStatus;
  visibility: MemoryVisibility;
  provenance: MemoryProvenance;
  confidence: MemoryConfidence;
  /** v2 relationship readiness */
  parentId?: string;
  relatedIds: string[];
  ownerId?: string;
  projectId?: string;
  graphNodeId?: string;
}

export interface MemorySearchQuery {
  q?: string;
  type?: MemoryType | MemoryType[];
  tags?: string[];
  limit?: number;
  offset?: number;
  from?: string;
  to?: string;
  status?: MemoryStatus;
}

export interface MemorySearchResult {
  items: MemoryRecord[];
  total: number;
  query: MemorySearchQuery;
}

export interface MemoryRecordInput {
  companyId: string;
  userId?: string;
  department?: string;
  memoryType: MemoryType;
  sourceTable: string;
  sourceId: string;
  title: string;
  summary?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  occurredAt: string;
  version?: number;
  status?: MemoryStatus;
  visibility?: MemoryVisibility;
  provenance?: MemoryProvenance;
  confidence?: MemoryConfidence;
  parentId?: string;
  relatedIds?: string[];
  ownerId?: string;
  projectId?: string;
  graphNodeId?: string;
}

export interface MemoryIngestionPort {
  upsert(input: MemoryRecordInput): Promise<MemoryRecord>;
  remove(sourceTable: string, sourceId: string): Promise<void>;
  linkGraphNode(memoryId: string, graphNodeId: string): Promise<MemoryRecord>;
}

export interface MemoryQueryPort {
  search(companyId: string, query: MemorySearchQuery): Promise<MemorySearchResult>;
  getById(companyId: string, id: string): Promise<MemoryRecord | null>;
  getBySource(
    companyId: string,
    sourceTable: string,
    sourceId: string,
  ): Promise<MemoryRecord | null>;
}

/** Point-in-time memory — design only (Sprint 2+) */
export interface MemorySnapshotAnchor {
  id: string;
  companyId: string;
  asOf: string;
  trigger: "scheduled" | "deployment" | "sprint" | "manual";
  recordCount: number;
}

export type MemorySnapshotId = string;

export interface MemorySnapshotPort {
  capture(companyId: string, asOf: string): Promise<MemorySnapshotId>;
  queryAsOf(
    companyId: string,
    asOf: string,
    query: MemorySearchQuery,
  ): Promise<MemorySearchResult>;
  listAnchors(companyId: string): Promise<MemorySnapshotAnchor[]>;
}
