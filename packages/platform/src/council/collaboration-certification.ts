/** Executive Collaboration Certification — ECS gates (Sprint 4 Phase B) */

export const COLLABORATION_ECS_GATES = [
  "delegation",
  "consensus",
  "challenge",
  "minority_report",
  "evidence_trace",
  "replay",
  "audit",
  "governance",
  "council_explainability",
  "founder_constitution_compliance",
  "organizational_runtime_compliance",
  "architecture_lock_compliance",
] as const;

export type CollaborationEcsGate = (typeof COLLABORATION_ECS_GATES)[number];

export interface CollaborationCertificationCheck {
  gate: CollaborationEcsGate;
  checkId: string;
  name: string;
  passed: boolean;
  evidence: string;
}

export interface CollaborationCertificationReport {
  companyId: string;
  generatedAt: string;
  passed: boolean;
  score: number;
  checks: CollaborationCertificationCheck[];
  version: string;
}

export function computeCollaborationCertScore(checks: CollaborationCertificationCheck[]): number {
  if (checks.length === 0) return 0;
  return Math.round((checks.filter((c) => c.passed).length / checks.length) * 100);
}

export function isCollaborationCertified(report: CollaborationCertificationReport): boolean {
  return report.passed && report.score >= 90;
}

export interface CollaborationCertificationPort {
  certify(companyId: string): Promise<CollaborationCertificationReport>;
}
