/** Signal Correlation Engine — contracts only (Sprint 3 Phase B / ONS) */

import type { OrganizationalSignal } from "./signal-bus.js";

export const SIGNAL_CORRELATION_VERSION = "1.0.0";

export type SignalLifecycleStage =
  | "emerging"
  | "active"
  | "amplifying"
  | "suppressed"
  | "resolved"
  | "expired";

export interface SignalCluster {
  id: string;
  companyId: string;
  signalIds: string[];
  domain: string;
  theme: string;
  confidence: number;
  detectedAt: string;
}

export interface SignalCascade {
  id: string;
  companyId: string;
  rootSignalId: string;
  derivedSignalIds: string[];
  amplificationFactor: number;
  detectedAt: string;
}

export interface SignalAmplification {
  signalId: string;
  factor: number;
  reason: string;
  correlatedSignalIds: string[];
}

export interface SignalSuppression {
  signalId: string;
  reason: "noise_filter" | "duplicate" | "stale" | "low_confidence";
  suppressedAt: string;
}

export interface SignalCorrelation {
  id: string;
  companyId: string;
  signalIds: string[];
  correlationScore: number;
  crossDomain: boolean;
  domains: string[];
  detectedAt: string;
}

export interface SignalPriority {
  signalId: string;
  rank: number;
  urgency: number;
  importance: number;
  freshness: number;
}

export interface SignalEscalation {
  signalId: string;
  escalatedTo: "attention" | "council" | "founder";
  reason: string;
  escalatedAt: string;
}

export interface SignalTimelineEntry {
  signalId: string;
  stage: SignalLifecycleStage;
  occurredAt: string;
  note?: string;
}

export interface SignalTimeline {
  companyId: string;
  entries: SignalTimelineEntry[];
  from: string;
  to: string;
}

export interface SignalCorrelationSnapshot {
  companyId: string;
  assembledAt: string;
  version: string;
  clusters: SignalCluster[];
  cascades: SignalCascade[];
  correlations: SignalCorrelation[];
  priorities: SignalPriority[];
  weakSignals: OrganizationalSignal[];
  emergingSignals: OrganizationalSignal[];
  criticalSignals: OrganizationalSignal[];
  blindSpots: string[];
}

export interface SignalCorrelationPort {
  correlate(companyId: string): Promise<SignalCorrelationSnapshot>;
  getTimeline(companyId: string, options?: { from?: string; to?: string }): Promise<SignalTimeline>;
}
