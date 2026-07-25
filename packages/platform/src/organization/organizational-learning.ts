/** Organizational Learning Engine — capture lessons (ADR-018) */

import type { EngineEvidenceRef, EngineLinkRef, VersionedEngineRecord } from "./common.js";

export const LEARNING_RECORD_TYPES = [
  "failure",
  "success",
  "experiment",
  "launch_review",
  "retrospective",
  "incident_review",
  "customer_discovery",
  "market_discovery",
  "engineering_lesson",
  "financial_lesson",
  "operational_lesson",
] as const;

export type LearningRecordType = (typeof LEARNING_RECORD_TYPES)[number];

export interface OrganizationalLearningRecord extends VersionedEngineRecord {
  type: LearningRecordType;
  title: string;
  summary: string;
  whatHappened: string;
  whyItMattered: string;
  takeaway: string;
  evidence: EngineEvidenceRef[];
  links: EngineLinkRef;
  recordedBy: string;
  recordedAt: string;
}

export interface OrganizationalLearningEnginePort {
  readonly engineId: "organizational-learning";
  record(input: Omit<OrganizationalLearningRecord, "id" | "version" | "createdAt" | "updatedAt">): Promise<OrganizationalLearningRecord>;
  get(id: string): Promise<OrganizationalLearningRecord | null>;
  list(companyId: string, filters?: { type?: LearningRecordType; limit?: number }): Promise<OrganizationalLearningRecord[]>;
  /** Auto-link to memory, graph, strategy, timeline, projects */
  linkRecord(id: string, links: EngineLinkRef): Promise<OrganizationalLearningRecord>;
  getTimeline(companyId: string, limit?: number): Promise<OrganizationalLearningRecord[]>;
}
