/** Twin certification gates — Sprint 3 Phase C (ECS extension) */

export const TWIN_ECS_GATES = [
  "historical_replay_consistency",
  "state_reconstruction",
  "version_integrity",
  "timeline_integrity",
  "simulation_isolation",
  "reality_protection",
  "forecast_explainability",
  "scenario_reproducibility",
  "twin_synchronization",
  "twin_audit_consistency",
  "twin_evolution_consistency",
] as const;

export type TwinEcsGate = (typeof TWIN_ECS_GATES)[number];

export interface TwinCertificationCheck {
  gate: TwinEcsGate;
  checkId: string;
  name: string;
  passed: boolean;
  evidence: string;
}

export interface TwinCertificationReport {
  companyId: string;
  generatedAt: string;
  passed: boolean;
  score: number;
  checks: TwinCertificationCheck[];
}

export function computeTwinCertScore(checks: TwinCertificationCheck[]): number {
  if (checks.length === 0) return 0;
  const passed = checks.filter((c) => c.passed).length;
  return Math.round((passed / checks.length) * 100);
}

export function isTwinCertified(report: TwinCertificationReport): boolean {
  return report.passed && report.score >= 90;
}
