/** Sprint 4 Phase C — Executive Compliance Suite extension gates */

export const PHASE_C_ECS_GATES = [
  "attention_budget_compliance",
  "attention_allocation_compliance",
  "attention_saturation_detection",
  "attention_debt_compliance",
  "attention_recovery_validation",
  "autonomy_governance_validation",
  "founder_override_validation",
  "mission_control_validation",
  "explainability_validation",
] as const;

export type PhaseCEcsGate = (typeof PHASE_C_ECS_GATES)[number];

export interface PhaseCEcsCheckResult {
  gate: PhaseCEcsGate;
  checkId: string;
  name: string;
  passed: boolean;
  evidence: string;
}
