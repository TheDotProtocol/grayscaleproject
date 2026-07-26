/** Policy Engine Certification — deterministic gates (Sprint 4 Phase D) */

export const POLICY_ECS_GATES = [
  "policies_versioned",
  "policies_explainable",
  "policies_auditable",
  "policies_deterministic",
  "founder_constitution_inherited",
  "oom_inherited",
  "architecture_lock_inherited",
  "executive_compliance_respected",
  "unknown_fails_safe",
  "no_implicit_permissions",
  "default_deny",
  "explicit_allow",
  "override_immutable",
  "emergency_temporary",
  "expired_deactivate",
] as const;

export type PolicyEcsGate = (typeof POLICY_ECS_GATES)[number];

export interface PolicyCertificationCheck {
  gate: PolicyEcsGate;
  checkId: string;
  name: string;
  passed: boolean;
  evidence: string;
}

export interface PolicyCertificationReport {
  companyId: string;
  generatedAt: string;
  passed: boolean;
  score: number;
  checks: PolicyCertificationCheck[];
  version: string;
}

export function computePolicyCertScore(checks: PolicyCertificationCheck[]): number {
  if (checks.length === 0) return 0;
  return Math.round((checks.filter((c) => c.passed).length / checks.length) * 100);
}

export function isPolicyCertified(report: PolicyCertificationReport): boolean {
  return report.passed && report.score >= 90;
}
