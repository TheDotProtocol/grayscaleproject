/** Council certification gates — Sprint 3 Phase B (ECS extension) */

export const COUNCIL_ECS_GATES = [
  "session_integrity",
  "evidence_integrity",
  "consensus_integrity",
  "minority_opinion_preservation",
  "founder_escalation",
  "decision_traceability",
  "attention_engine_integration",
  "decision_classification",
  "explainability",
  "replay_consistency",
  "audit_consistency",
] as const;

export type CouncilEcsGate = (typeof COUNCIL_ECS_GATES)[number];

export interface CouncilCertificationCheck {
  gate: CouncilEcsGate;
  checkId: string;
  name: string;
  passed: boolean;
  evidence: string;
}

export interface CouncilCertificationReport {
  companyId: string;
  generatedAt: string;
  passed: boolean;
  score: number;
  checks: CouncilCertificationCheck[];
}

export function computeCouncilCertScore(checks: CouncilCertificationCheck[]): number {
  if (checks.length === 0) return 0;
  const passed = checks.filter((c) => c.passed).length;
  return Math.round((passed / checks.length) * 100);
}

export function isCouncilCertified(report: CouncilCertificationReport): boolean {
  return report.passed && report.score >= 90;
}
