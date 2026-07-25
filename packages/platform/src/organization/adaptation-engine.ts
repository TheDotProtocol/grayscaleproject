/** Organizational Adaptation Engine — change readiness (ADR-022) */

import type { EngineEvidenceRef, ExplainableScore } from "./common.js";

export const ADAPTATION_METRICS = [
  "speed_of_improvement",
  "speed_of_learning",
  "speed_of_execution",
  "resistance_to_change",
  "innovation_adoption",
  "technical_debt",
  "business_maturity",
  "architecture_maturity",
  "platform_maturity",
] as const;

export type AdaptationMetric = (typeof ADAPTATION_METRICS)[number];

export interface AdaptationMetricSnapshot {
  metric: AdaptationMetric;
  score: ExplainableScore;
}

export interface OrganizationalAdaptationSnapshot {
  companyId: string;
  metrics: AdaptationMetricSnapshot[];
  adaptationIndex: ExplainableScore;
  computedAt: string;
}

export interface OrganizationalAdaptationEnginePort {
  readonly engineId: "organizational-adaptation";
  getSnapshot(companyId: string): Promise<OrganizationalAdaptationSnapshot>;
  recordMetric(
    companyId: string,
    metric: AdaptationMetric,
    score: Omit<ExplainableScore, "computedAt">,
    evidence: EngineEvidenceRef[],
  ): Promise<OrganizationalAdaptationSnapshot>;
  getIndexHistory(companyId: string, limit?: number): Promise<ExplainableScore[]>;
}
