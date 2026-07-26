/** Sprint 4 Phase D — Executive Compliance Suite extension gates */

export const PHASE_D_ECS_GATES = [
  "policy_compliance",
  "governance_compliance",
  "approval_compliance",
  "constraint_compliance",
  "policy_explainability",
  "policy_audit_validation",
  "founder_approval_validation",
  "council_approval_validation",
  "emergency_policy_validation",
  "default_deny_validation",
] as const;

export type PhaseDEcsGate = (typeof PHASE_D_ECS_GATES)[number];

export interface PhaseDEcsCheckResult {
  gate: PhaseDEcsGate;
  checkId: string;
  name: string;
  passed: boolean;
  evidence: string;
}
