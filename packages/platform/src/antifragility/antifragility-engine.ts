/** Organizational Antifragility Engine — contracts (Sprint 3 Phase D) */

import type { ForesightMetricDetail } from "../foresight/foresight-engine.js";

export const ANTIFRAGILITY_ENGINE_VERSION = "1.0.0";

export interface StressGain extends ForesightMetricDetail {
  score: number;
}

export interface AdaptationSpeed extends ForesightMetricDetail {
  rate: number;
  domains: string[];
}

export interface FailureLearning extends ForesightMetricDetail {
  lessonsRecorded: number;
  domains: string[];
}

export interface Elasticity extends ForesightMetricDetail {
  score: number;
}

export interface RecoveryAcceleration extends ForesightMetricDetail {
  score: number;
  daysToRecover: number;
}

export interface InnovationPressure extends ForesightMetricDetail {
  score: number;
  sources: string[];
}

export interface ExperimentQuality extends ForesightMetricDetail {
  score: number;
  simulationCount: number;
}

export interface ResilienceMetric extends ForesightMetricDetail {
  score: number;
}

export interface RecoveryCurve extends ForesightMetricDetail {
  curveShape: "linear" | "exponential" | "plateau";
  estimatedDays: number;
}

export interface OrganizationalFlexibility extends ForesightMetricDetail {
  score: number;
  domains: string[];
}

export interface InstitutionalGrowth extends ForesightMetricDetail {
  score: number;
  indicators: string[];
}

export interface OrganizationalAntifragility {
  companyId: string;
  assembledAt: string;
  version: string;
  stressGain: StressGain;
  adaptationSpeed: AdaptationSpeed;
  failureLearning: FailureLearning;
  elasticity: Elasticity;
  recoveryAcceleration: RecoveryAcceleration;
  innovationPressure: InnovationPressure;
  experimentQuality: ExperimentQuality;
  resilience: ResilienceMetric;
  recoveryCurve: RecoveryCurve;
  organizationalFlexibility: OrganizationalFlexibility;
  institutionalGrowth: InstitutionalGrowth;
}

export interface OrganizationalAntifragilityPort {
  assess(companyId: string): Promise<OrganizationalAntifragility>;
}
