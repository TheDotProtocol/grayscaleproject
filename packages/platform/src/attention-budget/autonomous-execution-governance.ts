/** Autonomous Execution Governance — constitutional rules (Sprint 4 Phase C, NOT activation) */

export const AUTONOMOUS_EXECUTION_VERSION = "1.0.0";
export const AUTONOMOUS_EXECUTION_ENABLED = false as const;

export const AUTONOMY_GOVERNANCE_ECS_GATES = [
  "autonomy_earned",
  "autonomy_certified",
  "autonomy_policy_driven",
  "autonomy_reversible",
  "autonomy_explainable",
  "autonomy_traceable",
  "founder_constitution_respected",
  "organizational_runtime_respected",
  "executive_compliance_respected",
  "council_not_bypassed",
  "mission_control_not_bypassed",
  "immutable_evidence",
  "revocable_anytime",
  "autonomy_disabled",
] as const;

export type AutonomyGovernanceEcsGate = (typeof AUTONOMY_GOVERNANCE_ECS_GATES)[number];

export interface AutonomyGovernanceCheck {
  gate: AutonomyGovernanceEcsGate;
  checkId: string;
  name: string;
  passed: boolean;
  evidence: string;
}

export interface AutonomyGovernanceReport {
  companyId: string;
  generatedAt: string;
  passed: boolean;
  score: number;
  checks: AutonomyGovernanceCheck[];
  autonomousExecutionEnabled: false;
  version: string;
}

export function computeAutonomyGovernanceScore(checks: AutonomyGovernanceCheck[]): number {
  if (checks.length === 0) return 0;
  return Math.round((checks.filter((c) => c.passed).length / checks.length) * 100);
}

export interface AutonomyGovernancePort {
  validate(companyId: string): Promise<AutonomyGovernanceReport>;
}
