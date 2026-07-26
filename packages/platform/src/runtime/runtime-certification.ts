/** Runtime Certification — deterministic gates (Sprint 4 Phase A) */

export const RUNTIME_ECS_GATES = [
  "heartbeat_stable",
  "schedulers_deterministic",
  "no_circular_orchestration",
  "no_duplicate_execution",
  "runtime_health_explainable",
  "orchestration_auditable",
  "constitutional_hierarchy_respected",
  "no_business_logic_in_runtime",
  "executives_not_schedulers",
  "event_driven_coordination",
  "version_integrity",
] as const;

export type RuntimeEcsGate = (typeof RUNTIME_ECS_GATES)[number];

export interface RuntimeCertificationCheck {
  gate: RuntimeEcsGate;
  checkId: string;
  name: string;
  passed: boolean;
  evidence: string;
}

export interface RuntimeCertificationReport {
  companyId: string;
  generatedAt: string;
  passed: boolean;
  score: number;
  checks: RuntimeCertificationCheck[];
  version: string;
}

export function computeRuntimeCertScore(checks: RuntimeCertificationCheck[]): number {
  if (checks.length === 0) return 0;
  return Math.round((checks.filter((c) => c.passed).length / checks.length) * 100);
}

export function isRuntimeCertified(report: RuntimeCertificationReport): boolean {
  return report.passed && report.score >= 90;
}

export interface RuntimeCertificationPort {
  certify(companyId: string): Promise<RuntimeCertificationReport>;
}
