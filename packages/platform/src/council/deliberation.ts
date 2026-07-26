import type { CouncilBehaviorMode } from "../executive/executive-council.js";
import type { CouncilConsensusLevel, CouncilVoteValue } from "./constitution.js";

export interface CouncilDeliberationRecord {
  id: string;
  companyId: string;
  sessionId: string;
  issueId: string;
  mode: CouncilBehaviorMode;
  executiveId: string;
  roleAtDeliberation: string;
  position: string;
  evidenceRefs: string[];
  confidence: number;
  confidenceSources: { type: string; summary: string; weight: number }[];
  assumptions: string[];
  correlationId: string;
  recordedAt: string;
}

export interface CouncilVote {
  id: string;
  companyId: string;
  sessionId: string;
  issueId: string;
  executiveId: string;
  vote: CouncilVoteValue;
  evidenceRefs: string[];
  rationale: string;
  correlationId: string;
  castAt: string;
}

export interface CouncilMinorityOpinion {
  id: string;
  companyId: string;
  sessionId: string;
  issueId: string;
  executiveId: string;
  position: string;
  evidenceRefs: string[];
  rationale: string;
  preserved: true;
  correlationId: string;
  recordedAt: string;
}

export interface CouncilConsensus {
  id: string;
  companyId: string;
  sessionId: string;
  issueId: string;
  level: CouncilConsensusLevel;
  score: number;
  approveCount: number;
  rejectCount: number;
  abstainCount: number;
  dissentCount: number;
  evidenceAlignmentScore: number;
  founderReviewRequired: boolean;
  founderReviewReason?: string;
  measuredAt: string;
  correlationId: string;
}

export interface CouncilResolution {
  id: string;
  companyId: string;
  sessionId: string;
  issueId: string;
  title: string;
  summary: string;
  consensusId: string;
  status: "proposed" | "pending_founder_review" | "approved" | "rejected" | "deferred";
  explanationId: string;
  correlationId: string;
  proposedAt: string;
}

export interface CouncilDecision {
  id: string;
  companyId: string;
  resolutionId: string;
  approvedBy: "founder" | "automation_policy";
  approverRef: string;
  effectiveAt: string;
  executionApproved: boolean;
  rollbackPlan?: string;
  correlationId: string;
}
