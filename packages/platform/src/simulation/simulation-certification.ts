/** Simulation Certification — deterministic gates (Sprint 3 Phase C) */

export const SIMULATION_ECS_GATES = [
  "replay_determinism",
  "explainability_complete",
  "scenario_reproducibility",
  "policy_compliance",
  "constraint_compliance",
  "founder_constitution_compliance",
  "homeostasis_validation",
  "audit_validation",
  "version_validation",
  "twin_synchronization",
  "reality_protection",
] as const;

export type SimulationEcsGate = (typeof SIMULATION_ECS_GATES)[number];

export interface SimulationCertificationCheck {
  gate: SimulationEcsGate;
  checkId: string;
  name: string;
  passed: boolean;
  evidence: string;
}

export interface SimulationCertificationReport {
  companyId: string;
  sessionId?: string;
  generatedAt: string;
  passed: boolean;
  score: number;
  checks: SimulationCertificationCheck[];
  version: string;
}

export function computeSimulationCertScore(checks: SimulationCertificationCheck[]): number {
  if (checks.length === 0) return 0;
  const passed = checks.filter((c) => c.passed).length;
  return Math.round((passed / checks.length) * 100);
}

export function isSimulationCertified(report: SimulationCertificationReport): boolean {
  return report.passed && report.score >= 90;
}

export interface SimulationCertificationPort {
  certify(companyId: string, sessionId?: string): Promise<SimulationCertificationReport>;
}
