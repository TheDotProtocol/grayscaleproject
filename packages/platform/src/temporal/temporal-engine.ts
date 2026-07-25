/** Temporal Intelligence — historical evolution only, no forecasting (ADR-025) */

import type { EngineEvidenceRef, ExplainableScore } from "../organization/common.js";

export const SNAPSHOT_PERIODS = ["weekly", "monthly", "quarterly", "yearly"] as const;
export type SnapshotPeriod = (typeof SNAPSHOT_PERIODS)[number];

export interface HistoricalSnapshotRef {
  id: string;
  companyId: string;
  period: SnapshotPeriod;
  capturedAt: string;
  label: string;
}

export interface TrendAnalysis {
  metric: string;
  direction: "improving" | "declining" | "stable" | "unknown";
  magnitude: number;
  evidence: EngineEvidenceRef[];
  fromSnapshotId: string;
  toSnapshotId: string;
  reason: string;
}

export interface PatternDetection {
  pattern: string;
  confidence: number;
  evidence: EngineEvidenceRef[];
  firstObservedAt: string;
  lastObservedAt: string;
}

export interface TrajectoryPoint {
  at: string;
  value: number;
  label?: string;
}

export interface MilestoneHistoryEntry {
  id: string;
  title: string;
  occurredAt: string;
  category: string;
  impact: "positive" | "negative" | "neutral";
  evidence: EngineEvidenceRef[];
}

export interface GrowthPhase {
  id: string;
  name: string;
  startedAt: string;
  endedAt?: string;
  description: string;
}

export interface TemporalIntelligenceContext {
  companyId: string;
  assembledAt: string;
  organizationAgeDays: number;
  evolutionIndex: ExplainableScore;
  growthPhases: GrowthPhase[];
  milestones: MilestoneHistoryEntry[];
  trends: TrendAnalysis[];
  patterns: PatternDetection[];
  regressions: TrendAnalysis[];
  accelerations: TrendAnalysis[];
  snapshotRefs: HistoricalSnapshotRef[];
  historicalComparisons: Array<{
    metric: string;
    current: number;
    prior: number;
    period: SnapshotPeriod;
    reason: string;
  }>;
}

export interface TemporalEnginePort {
  readonly engineId: "temporal-intelligence";
  getContext(companyId: string): Promise<TemporalIntelligenceContext>;
  captureSnapshot(companyId: string, period: SnapshotPeriod): Promise<HistoricalSnapshotRef>;
  analyzeTrends(companyId: string, fromSnapshotId: string, toSnapshotId: string): Promise<TrendAnalysis[]>;
  detectPatterns(companyId: string): Promise<PatternDetection[]>;
  getMilestoneHistory(companyId: string, limit?: number): Promise<MilestoneHistoryEntry[]>;
}
