/** Attention Budget Certification — deterministic gates (Sprint 4 Phase C) */

export const ATTENTION_BUDGET_ECS_GATES = [
  "attention_finite",
  "attention_measurable",
  "attention_budgeted",
  "attention_explainable",
  "attention_versioned",
  "attention_auditable",
  "allocation_organizational",
  "executives_consume_only",
  "context_switch_measurable",
  "debt_accumulates",
  "starvation_measurable",
  "overload_measurable",
  "strategic_over_noise",
  "urgency_not_importance",
  "budget_adapts_not_oscillates",
] as const;

export type AttentionBudgetEcsGate = (typeof ATTENTION_BUDGET_ECS_GATES)[number];

export interface AttentionBudgetCertificationCheck {
  gate: AttentionBudgetEcsGate;
  checkId: string;
  name: string;
  passed: boolean;
  evidence: string;
}

export interface AttentionBudgetCertificationReport {
  companyId: string;
  generatedAt: string;
  passed: boolean;
  score: number;
  checks: AttentionBudgetCertificationCheck[];
  version: string;
}

export function computeAttentionBudgetCertScore(checks: AttentionBudgetCertificationCheck[]): number {
  if (checks.length === 0) return 0;
  return Math.round((checks.filter((c) => c.passed).length / checks.length) * 100);
}

export function isAttentionBudgetCertified(report: AttentionBudgetCertificationReport): boolean {
  return report.passed && report.score >= 90;
}

export interface AttentionBudgetCertificationPort {
  certify(companyId: string): Promise<AttentionBudgetCertificationReport>;
}
