/** Organizational Emotional Engine — observe wellbeing, never manipulate (ADR-016) */

import type { EngineEvidenceRef, ExplainableScore } from "./common.js";

export const ORGANIZATIONAL_EMOTION_METRICS = [
  "founder_stress",
  "founder_energy",
  "founder_confidence",
  "founder_focus",
  "burnout_risk",
  "execution_momentum",
  "operational_stability",
  "decision_velocity",
  "innovation_excitement",
  "customer_confidence",
  "investor_confidence",
  "financial_anxiety",
  "product_confidence",
  "market_pressure",
  "launch_confidence",
  "organization_morale",
] as const;

export type OrganizationalEmotionMetric = (typeof ORGANIZATIONAL_EMOTION_METRICS)[number];

export interface EmotionMetricSnapshot {
  metric: OrganizationalEmotionMetric;
  score: ExplainableScore;
}

export interface OrganizationalEmotionalSnapshot {
  companyId: string;
  metrics: EmotionMetricSnapshot[];
  computedAt: string;
  /** Observation only — engine MUST NOT trigger manipulative actions */
  observationOnly: true;
}

export interface OrganizationalEmotionalEnginePort {
  readonly engineId: "organizational-emotion";
  getSnapshot(companyId: string): Promise<OrganizationalEmotionalSnapshot>;
  recordObservation(
    companyId: string,
    metric: OrganizationalEmotionMetric,
    score: Omit<ExplainableScore, "computedAt">,
    evidence: EngineEvidenceRef[],
  ): Promise<OrganizationalEmotionalSnapshot>;
  getMetricHistory(companyId: string, metric: OrganizationalEmotionMetric, limit?: number): Promise<ExplainableScore[]>;
}
