/** Homeostasis metric detail — every score is explainable (Sprint 3 Phase C) */

export type HomeostasisTrend = "rising" | "stable" | "falling" | "improving" | "declining";

export interface HomeostasisMetricHistoryPoint {
  recordedAt: string;
  value: number;
}

/** Canonical homeostasis metric — reason, confidence, evidence, trend, history required */
export interface HomeostasisMetricDetail {
  value: number;
  reason: string;
  confidence: number;
  evidence: string[];
  trend: HomeostasisTrend;
  history: HomeostasisMetricHistoryPoint[];
}
