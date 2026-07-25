/** Organizational Wisdom Engine — principles from repeated learning (ADR-019) */

import type { EngineEvidenceRef, EngineLinkRef, VersionedEngineRecord } from "./common.js";

export type WisdomApprovalStatus = "draft" | "pending_approval" | "approved" | "superseded" | "archived";

export interface WisdomRecord extends VersionedEngineRecord {
  principle: string;
  statement: string;
  rationale: string;
  evidenceChain: EngineEvidenceRef[];
  supportingMemoryIds: string[];
  supportingDecisionIds: string[];
  supportingOutcomeIds: string[];
  links: EngineLinkRef;
  confidence: number;
  approvalStatus: WisdomApprovalStatus;
  approvedBy?: string;
  approvedAt?: string;
  supersededById?: string;
  versionHistory: Array<{ version: number; changedAt: string; summary: string }>;
}

export interface OrganizationalWisdomEnginePort {
  readonly engineId: "organizational-wisdom";
  /** Executives consume before Strategy evaluation */
  listApproved(companyId: string): Promise<WisdomRecord[]>;
  get(id: string): Promise<WisdomRecord | null>;
  propose(input: Omit<WisdomRecord, "id" | "version" | "approvalStatus" | "versionHistory" | "createdAt" | "updatedAt">): Promise<WisdomRecord>;
  approve(id: string, approverId: string): Promise<WisdomRecord>;
  getHistory(companyId: string): Promise<WisdomRecord[]>;
}

/** Wisdom ≠ Memory ≠ Learning */
export function isWisdomDistinctFromMemory(): true {
  return true;
}
