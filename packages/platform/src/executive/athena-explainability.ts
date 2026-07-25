/** Athena full explainability contract — Phase B (Manifesto §50 extended) */

import type { ExecutiveExplainability } from "./explainability.js";

export interface AthenaRecommendationExplainability extends ExecutiveExplainability {
  whyAthenaThinksThis: string;
  organizationalDnaFactors: string[];
  emotionalIndicators: string[];
  founderPreferenceFactors: string[];
  signalIds: string[];
  insightIds: string[];
  notebookEntryIds: string[];
  curiosityInvestigationIds: string[];
  contradictingEvidence: { id: string; summary: string; source: string }[];
  supportingEvidence: { id: string; summary: string; source: string }[];
  skepticChallenges: { type: string; summary: string; severity: string }[];
  whatCouldMakeThisWrong: string;
  trustScore?: number;
  rollbackPlan: string;
  discoveryStagesCompleted: string[];
}

export interface AthenaRecommendationDraft {
  title: string;
  summary: string;
  explainability: AthenaRecommendationExplainability;
  payload: Record<string, unknown>;
}

export function isAthenaExplainabilityComplete(
  exp: Partial<AthenaRecommendationExplainability>,
): exp is AthenaRecommendationExplainability {
  return Boolean(
    exp.whyAthenaThinksThis &&
      exp.whatCouldMakeThisWrong &&
      exp.rollbackPlan &&
      exp.supportingEvidence &&
      exp.discoveryStagesCompleted &&
      typeof exp.confidence === "number",
  );
}
