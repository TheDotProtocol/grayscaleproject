/** Graph node types — every significant platform object */
export const GRAPH_NODE_TYPES = [
  "founder",
  "user",
  "company",
  "department",
  "project",
  "task",
  "meeting",
  "bill",
  "recommendation",
  "goal",
  "objective",
  "risk",
  "opportunity",
  "document",
  "memory",
  "architecture_decision",
  "decision",
  "git_commit",
  "plugin",
  "integration",
  "timeline_event",
  "notification",
  "journal_entry",
  "knowledge_article",
  "future_executive",
] as const;

export type GraphNodeType = (typeof GRAPH_NODE_TYPES)[number];

export const GRAPH_LIFECYCLE_STATUS = [
  "active",
  "archived",
  "deleted",
] as const;
export type GraphLifecycleStatus = (typeof GRAPH_LIFECYCLE_STATUS)[number];

export const GRAPH_NODE_SOURCES = [
  "event",
  "manual",
  "import",
  "inference",
  "system",
  "migration",
] as const;
export type GraphNodeSource = (typeof GRAPH_NODE_SOURCES)[number];

export interface GraphNode {
  id: string;
  companyId: string;
  nodeType: GraphNodeType;
  displayName: string;
  summary?: string;
  lifecycleStatus: GraphLifecycleStatus;
  sourceTable?: string;
  sourceId?: string;
  source: GraphNodeSource;
  schemaVersion: number;
  version: number;
  metadata: Record<string, unknown>;
  memoryRecordId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertGraphNodeInput {
  companyId: string;
  nodeType: GraphNodeType;
  displayName: string;
  summary?: string;
  sourceTable?: string;
  sourceId?: string;
  source?: GraphNodeSource;
  metadata?: Record<string, unknown>;
  memoryRecordId?: string;
  lifecycleStatus?: GraphLifecycleStatus;
}

export interface GraphNodeQuery {
  nodeType?: GraphNodeType | GraphNodeType[];
  q?: string;
  sourceTable?: string;
  lifecycleStatus?: GraphLifecycleStatus;
  limit?: number;
  offset?: number;
}

export interface CreateSyntheticNodeInput {
  companyId: string;
  nodeType: GraphNodeType;
  displayName: string;
  summary?: string;
  metadata?: Record<string, unknown>;
}
