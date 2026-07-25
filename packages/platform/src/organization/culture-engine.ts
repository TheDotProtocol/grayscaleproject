/** Organizational Culture Engine — model company behavior (ADR-020) */

import type { EngineEvidenceRef, ExplainableScore } from "./common.js";

export const CULTURE_DIMENSIONS = [
  "communication_quality",
  "decision_transparency",
  "execution_consistency",
  "meeting_quality",
  "documentation_health",
  "innovation_culture",
  "accountability",
  "ownership",
  "cross_team_collaboration",
  "feedback_culture",
  "governance_respect",
] as const;

export type CultureDimension = (typeof CULTURE_DIMENSIONS)[number];

export interface CultureDimensionScore {
  dimension: CultureDimension;
  score: ExplainableScore;
}

export interface OrganizationalCultureSnapshot {
  companyId: string;
  dimensions: CultureDimensionScore[];
  overallHealth: ExplainableScore;
  computedAt: string;
}

export interface OrganizationalCultureEnginePort {
  readonly engineId: "organizational-culture";
  /** Mission Control visualization primary consumer */
  getSnapshot(companyId: string): Promise<OrganizationalCultureSnapshot>;
  recordObservation(
    companyId: string,
    dimension: CultureDimension,
    score: Omit<ExplainableScore, "computedAt">,
    evidence: EngineEvidenceRef[],
  ): Promise<OrganizationalCultureSnapshot>;
}
