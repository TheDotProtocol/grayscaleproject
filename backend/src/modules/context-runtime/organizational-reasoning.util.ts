import type { ForesightMetricDetail } from "@grayscale/platform";

export function foresightMetric(
  value: number,
  reason: string,
  evidence: string[],
  trend: ForesightMetricDetail["trend"] = "stable",
): ForesightMetricDetail {
  return {
    value,
    reason,
    confidence: Math.min(0.95, 0.55 + evidence.length * 0.08),
    evidence,
    trend,
    history: [{ recordedAt: new Date().toISOString(), value }],
  };
}

export function alignmentScore(score: number, reason: string, evidence: string[], gaps: string[] = []) {
  return {
    score,
    confidence: Math.min(0.95, 0.5 + evidence.length * 0.1),
    evidence,
    reason,
    gaps,
  };
}

export function deterministicUnit(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}
