/** Organizational Signal Bus — what changed, not what happened (ADR-026) */

import type { EngineEvidenceRef } from "../organization/common.js";

export const ORGANIZATIONAL_SIGNAL_TYPES = [
  "founder_stress_increased",
  "founder_stress_decreased",
  "culture_improving",
  "culture_declining",
  "execution_slowing",
  "execution_accelerating",
  "decision_velocity_rising",
  "decision_velocity_falling",
  "customer_confidence_falling",
  "customer_confidence_rising",
  "cash_risk_increasing",
  "cash_risk_decreasing",
  "learning_velocity_improving",
  "learning_velocity_declining",
  "intent_coverage_gap",
  "adaptation_readiness_changed",
  "reputation_shift",
  "momentum_shift",
] as const;

export type OrganizationalSignalType = (typeof ORGANIZATIONAL_SIGNAL_TYPES)[number];

export interface OrganizationalSignal {
  id: string;
  companyId: string;
  type: OrganizationalSignalType;
  title: string;
  description: string;
  magnitude: number;
  direction: "up" | "down" | "neutral";
  evidence: EngineEvidenceRef[];
  sourceEngineId: string;
  sourceEventId?: string;
  detectedAt: string;
  expiresAt?: string;
  consumed: boolean;
}

export interface OrganizationalSignalSnapshot {
  companyId: string;
  assembledAt: string;
  activeSignals: OrganizationalSignal[];
  recentSignals: OrganizationalSignal[];
}

export interface OrganizationalSignalBusPort {
  emit(signal: Omit<OrganizationalSignal, "id" | "detectedAt" | "consumed">): Promise<OrganizationalSignal>;
  getActive(companyId: string): Promise<OrganizationalSignal[]>;
  getSnapshot(companyId: string): Promise<OrganizationalSignalSnapshot>;
  markConsumed(signalId: string): Promise<void>;
  /** Strategy consumes signals — executives consume context only */
  subscribeStrategyConsumer(companyId: string): Promise<OrganizationalSignal[]>;
}

/** Signals ≠ Events. Events record facts; signals record meaningful change. */
export function isSignalDistinctFromEvent(): true {
  return true;
}
