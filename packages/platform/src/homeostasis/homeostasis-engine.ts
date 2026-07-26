/** Organizational Homeostasis Engine — constitutional contracts (Sprint 3 Phase B/C) */

import type { HomeostasisMetricDetail, HomeostasisTrend } from "./homeostasis-metric.js";

export const HOMEOSTASIS_ENGINE_VERSION = "1.1.0";

export interface OrganizationalStability extends HomeostasisMetricDetail {
  score: number;
  status: "stable" | "strained" | "unstable";
  assessedAt: string;
}

export interface StressIndex extends HomeostasisMetricDetail {
  value: number;
  contributors: string[];
  trend: HomeostasisTrend;
}

export interface RecoveryCapacity extends HomeostasisMetricDetail {
  score: number;
  recoveryWindowsAvailable: number;
  estimatedRecoveryDays: number;
}

export interface AdaptationRate extends HomeostasisMetricDetail {
  rate: number;
  domains: string[];
  measuredAt: string;
}

export interface AdaptiveCapacity extends HomeostasisMetricDetail {
  score: number;
  domains: string[];
}

export interface RecoveryVelocity extends HomeostasisMetricDetail {
  score: number;
  daysToEquilibrium: number;
}

export interface BurnoutRisk extends HomeostasisMetricDetail {
  level: "low" | "moderate" | "high" | "critical";
  score: number;
  indicators: string[];
}

export interface OperationalEquilibrium extends HomeostasisMetricDetail {
  score: number;
  imbalanceDomains: string[];
}

export interface OrganizationalBalance extends HomeostasisMetricDetail {
  score: number;
  imbalanceDomains: string[];
}

export interface ResilienceIndex extends HomeostasisMetricDetail {
  score: number;
  failureCascadeResistance: number;
}

export interface FailureCascadeResistance extends HomeostasisMetricDetail {
  score: number;
  vulnerableDomains: string[];
}

export interface DecisionSaturation extends HomeostasisMetricDetail {
  score: number;
  openDecisions: number;
}

export interface AttentionSaturationMetric extends HomeostasisMetricDetail {
  score: number;
  status: "healthy" | "elevated" | "critical" | "overload";
}

export interface ExecutiveLoadMetric extends HomeostasisMetricDetail {
  score: number;
  executiveCount: number;
}

export interface FounderLoadMetric extends HomeostasisMetricDetail {
  score: number;
  pendingFounderActions: number;
}

export interface OperationalRecovery extends HomeostasisMetricDetail {
  score: number;
  estimatedRecoveryDays: number;
}

export interface HealthMomentum extends HomeostasisMetricDetail {
  score: number;
  direction: "accelerating" | "stable" | "decelerating";
}

export interface OrganizationalLoad {
  totalLoad: number;
  executiveLoad: number;
  operationalLoad: number;
  councilLoad: number;
}

export interface OrganizationalFatigue extends HomeostasisMetricDetail {
  score: number;
  sustainedDays: number;
  domains: string[];
}

export interface RecoveryWindow {
  id: string;
  startAt: string;
  endAt: string;
  capacityRestored: number;
}

export interface StabilityTrend {
  direction: "improving" | "stable" | "declining";
  delta: number;
  periodDays: number;
}

export interface EquilibriumIndex extends HomeostasisMetricDetail {
  value: number;
  components: Record<string, number>;
  computedAt: string;
}

export interface OrganizationalHomeostasis {
  companyId: string;
  assembledAt: string;
  version: string;
  stability: OrganizationalStability;
  stressIndex: StressIndex;
  recoveryCapacity: RecoveryCapacity;
  adaptationRate: AdaptationRate;
  adaptiveCapacity: AdaptiveCapacity;
  recoveryVelocity: RecoveryVelocity;
  burnoutRisk: BurnoutRisk;
  operationalEquilibrium: OperationalEquilibrium;
  organizationalBalance: OrganizationalBalance;
  resilienceIndex: ResilienceIndex;
  failureCascadeResistance: FailureCascadeResistance;
  decisionSaturation: DecisionSaturation;
  attentionSaturation: AttentionSaturationMetric;
  executiveLoad: ExecutiveLoadMetric;
  founderLoad: FounderLoadMetric;
  operationalRecovery: OperationalRecovery;
  healthMomentum: HealthMomentum;
  organizationalLoad: OrganizationalLoad;
  organizationalFatigue: OrganizationalFatigue;
  recoveryWindows: RecoveryWindow[];
  stabilityTrend: StabilityTrend;
  equilibriumIndex: EquilibriumIndex;
}

export interface OrganizationalHomeostasisPort {
  assess(companyId: string): Promise<OrganizationalHomeostasis>;
}
