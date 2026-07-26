import type { CouncilDecisionLifecycleStage } from "./constitution.js";
import type { CouncilConsensusLevel } from "./constitution.js";
import type { CouncilMinorityOpinion } from "./deliberation.js";

export interface CouncilExplanation {
  id: string;
  companyId: string;
  sessionId: string;
  issueId: string;
  resolutionId?: string;
  issueSummary: string;
  decisionPath: CouncilDecisionLifecycleStage[];
  participatingExecutives: { executiveId: string; roles: string[] }[];
  evidenceSummary: { ref: string; sourceType: string; summary: string }[];
  contradictingEvidence: { ref: string; summary: string }[];
  voteRecord: { executiveId: string; vote: string; evidenceRefs: string[] }[];
  consensusLevel: CouncilConsensusLevel;
  minorityOpinions: Pick<CouncilMinorityOpinion, "executiveId" | "position" | "evidenceRefs" | "rationale">[];
  confidence: number;
  confidenceSources: { type: string; summary: string; weight: number }[];
  policiesEvaluated: string[];
  constraintsEvaluated: string[];
  constitutionalCompliance: Record<string, boolean>;
  founderReviewRequired: boolean;
  founderReviewReason?: string;
  founderApprovalRecord?: { approverRef: string; approvedAt: string; notes?: string };
  rollbackPlan?: string;
  whatCouldMakeThisWrong: string;
  intentChain?: string[];
  organizationalStateRef?: string;
  signalIds: string[];
  insightIds: string[];
  memoryRefs: string[];
  graphRefs: string[];
  correlationId: string;
  generatedAt: string;
}

export function isCouncilExplanationComplete(
  exp: Partial<CouncilExplanation>,
): exp is CouncilExplanation {
  return Boolean(
    exp.issueSummary &&
      exp.decisionPath &&
      exp.decisionPath.length > 0 &&
      exp.whatCouldMakeThisWrong &&
      exp.consensusLevel &&
      typeof exp.confidence === "number" &&
      exp.correlationId,
  );
}
