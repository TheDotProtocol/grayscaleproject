import type { CouncilEscalationReason, CouncilOverrideType } from "./constitution.js";

export interface CouncilGovernance {
  companyId: string;
  quorumMinimum: number;
  founderReviewOnWeakConsensus: boolean;
  founderReviewOnMaterialImpact: boolean;
  maxDeliberationRounds: number;
  evidenceRequiredForDissent: boolean;
  version: string;
  updatedAt: string;
}

export interface CouncilEscalation {
  id: string;
  companyId: string;
  sessionId: string;
  issueId: string;
  reason: CouncilEscalationReason;
  escalatedByExecutiveId?: string;
  detail: string;
  correlationId: string;
  escalatedAt: string;
}

export interface CouncilOverride {
  id: string;
  companyId: string;
  sessionId: string;
  issueId?: string;
  resolutionId?: string;
  overrideType: CouncilOverrideType;
  founderRef: string;
  previousOutcome: string;
  newOutcome: string;
  rationale: string;
  becomesLearning: true;
  correlationId: string;
  overriddenAt: string;
}

export interface CouncilConflictResolution {
  id: string;
  companyId: string;
  conflictingExecutiveIds: string[];
  domain: string;
  resolution: string;
  resolvedBy: "chair" | "founder" | "governance_policy";
  resolverRef: string;
  evidenceRefs: string[];
  correlationId: string;
  resolvedAt: string;
}

export interface CouncilTrust {
  companyId: string;
  executiveId: string;
  trustScore: number;
  evidenceQualityScore: number;
  participationScore: number;
  dissentQualityScore: number;
  calculatedAt: string;
  correlationId: string;
}

export interface CouncilHealth {
  companyId: string;
  activeSessions: number;
  openIssues: number;
  escalatedIssues: number;
  averageConsensusScore: number;
  complianceFailures: number;
  assessedAt: string;
}

export interface CouncilMetrics {
  companyId: string;
  periodStart: string;
  periodEnd: string;
  sessionsHeld: number;
  issuesResolved: number;
  strongConsensusRate: number;
  minorityOpinionRate: number;
  founderOverrideRate: number;
  averageDeliberationRounds: number;
}
