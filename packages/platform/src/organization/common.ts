/** Shared types for Organizational Intelligence engines (ADR-015–022) */

export const ORGANIZATIONAL_ENGINE_IDS = [
  "organizational-dna",
  "founder-dna",
  "organizational-emotion",
  "organizational-cognitive",
  "organizational-learning",
  "organizational-wisdom",
  "organizational-culture",
  "organizational-reputation",
  "organizational-adaptation",
] as const;

export type OrganizationalEngineId = (typeof ORGANIZATIONAL_ENGINE_IDS)[number];

export interface EngineEvidenceRef {
  type: string;
  sourceId: string;
  summary: string;
  recordedAt: string;
  metadata?: Record<string, unknown>;
}

export interface EngineLinkRef {
  memoryIds?: string[];
  graphNodeIds?: string[];
  strategyIds?: string[];
  timelineEntryIds?: string[];
  projectIds?: string[];
  decisionIds?: string[];
}

export interface VersionedEngineRecord {
  id: string;
  companyId: string;
  version: number;
  previousVersionId?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EngineAuditEntry {
  action: string;
  actorId: string;
  at: string;
  reason?: string;
  metadata?: Record<string, unknown>;
}

export type ScoreTrend = "rising" | "stable" | "falling" | "unknown";

/** Every organizational score is explainable — no hidden reasoning */
export interface ExplainableScore {
  value: number;
  confidence: number;
  reason: string;
  trend: ScoreTrend;
  evidence: EngineEvidenceRef[];
  supportingEventIds?: string[];
  timeline?: Array<{ at: string; value: number; note?: string }>;
  computedAt: string;
}

export interface OrganizationalEnginePort {
  readonly engineId: OrganizationalEngineId;
}

export interface EngineUpdateInput<T> {
  companyId: string;
  patch: Partial<T>;
  evidence: EngineEvidenceRef[];
  actorId: string;
  reason?: string;
}

/** Executives consume organizational intelligence read-only */
export interface ReadOnlyOrganizationalEnginePort extends OrganizationalEnginePort {
  getSnapshot(companyId: string): Promise<unknown>;
}
