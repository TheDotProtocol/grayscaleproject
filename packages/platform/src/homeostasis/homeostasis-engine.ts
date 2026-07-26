/** Organizational Homeostasis Engine — constitutional contracts (Sprint 3 Phase B / ONS) */

export const HOMEOSTASIS_ENGINE_VERSION = "1.0.0";

export interface OrganizationalStability {
  score: number;
  status: "stable" | "strained" | "unstable";
  assessedAt: string;
}

export interface StressIndex {
  value: number;
  contributors: string[];
  trend: "rising" | "stable" | "falling";
}

export interface RecoveryCapacity {
  score: number;
  recoveryWindowsAvailable: number;
  estimatedRecoveryDays: number;
}

export interface AdaptationRate {
  rate: number;
  domains: string[];
  measuredAt: string;
}

export interface BurnoutRisk {
  level: "low" | "moderate" | "high" | "critical";
  score: number;
  indicators: string[];
}

export interface OperationalEquilibrium {
  score: number;
  imbalanceDomains: string[];
}

export interface OrganizationalLoad {
  totalLoad: number;
  executiveLoad: number;
  operationalLoad: number;
  councilLoad: number;
}

export interface OrganizationalFatigue {
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

export interface EquilibriumIndex {
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
  burnoutRisk: BurnoutRisk;
  operationalEquilibrium: OperationalEquilibrium;
  organizationalLoad: OrganizationalLoad;
  organizationalFatigue: OrganizationalFatigue;
  recoveryWindows: RecoveryWindow[];
  stabilityTrend: StabilityTrend;
  equilibriumIndex: EquilibriumIndex;
}

export interface OrganizationalHomeostasisPort {
  assess(companyId: string): Promise<OrganizationalHomeostasis>;
}
