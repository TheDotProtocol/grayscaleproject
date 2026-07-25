/** Executive Skeptic Engine — challenge before recommendation finalization (ADR-030) */

export type SkepticChallengeType =
  | "assumption"
  | "missing_evidence"
  | "alternative_explanation"
  | "bias"
  | "contradiction"
  | "low_confidence"
  | "dependency_failure"
  | "policy_conflict"
  | "constraint_violation";

export interface SkepticChallenge {
  type: SkepticChallengeType;
  severity: "info" | "warning" | "blocking";
  summary: string;
  detail: string;
  evidenceRefs?: string[];
}

export interface SkepticPassInput {
  companyId: string;
  executiveId: string;
  recommendationTitle: string;
  recommendationSummary: string;
  assumptions: string[];
  evidenceIds: string[];
  confidence: number;
  policyIds?: string[];
  constraintIds?: string[];
}

export interface SkepticPassResult {
  passed: boolean;
  challenges: SkepticChallenge[];
  whatCouldMakeThisWrong: string;
  adjustedConfidence: number;
  completedAt: string;
  /** Part 9 mandatory skeptic questions — populated by Executive Skeptic Engine */
  mandatoryQuestions?: {
    whatCouldMakeThisWrong: string;
    contradictingEvidence: string;
    weakAssumptions: string;
    missingInformation: string;
    bestAlternative: string;
  };
}

export interface ExecutiveSkepticEnginePort {
  runPass(input: SkepticPassInput): Promise<SkepticPassResult>;
}

/** Every recommendation must include "What could make this wrong?" */
export function requiresSkepticField(result: SkepticPassResult): boolean {
  return result.whatCouldMakeThisWrong.trim().length > 0;
}
