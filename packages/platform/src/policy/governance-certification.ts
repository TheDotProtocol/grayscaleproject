/** Governance Kernel Certification (Sprint 4 Phase D) */

export const GOVERNANCE_ECS_GATES = [
  "kernel_checkpoint",
  "policy_evaluation_integrated",
  "constraint_enforcement",
  "approval_routing",
  "founder_authority",
  "council_authority",
  "exception_handling",
  "audit_append_only",
  "governance_explainable",
  "automation_enforcement_ready",
  "default_deny_enforced",
  "no_reasoning_in_kernel",
] as const;

export type GovernanceEcsGate = (typeof GOVERNANCE_ECS_GATES)[number];

export interface GovernanceCertificationCheck {
  gate: GovernanceEcsGate;
  checkId: string;
  name: string;
  passed: boolean;
  evidence: string;
}

export interface GovernanceCertificationReport {
  companyId: string;
  generatedAt: string;
  passed: boolean;
  score: number;
  checks: GovernanceCertificationCheck[];
  version: string;
}

export function computeGovernanceCertScore(checks: GovernanceCertificationCheck[]): number {
  if (checks.length === 0) return 0;
  return Math.round((checks.filter((c) => c.passed).length / checks.length) * 100);
}

export function isGovernanceCertified(report: GovernanceCertificationReport): boolean {
  return report.passed && report.score >= 90;
}
