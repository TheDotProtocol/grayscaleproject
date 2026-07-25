/** Executive Compliance Suite (ECS) — deterministic certification (Sprint 2) */

export const ECS_CATEGORIES = [
  "identity",
  "trust",
  "notebook",
  "curiosity",
  "skeptic",
  "discovery",
  "explainability",
  "recommendation_lifecycle",
  "policy_compliance",
  "constraint_compliance",
  "founder_constitution",
  "architecture_lock",
  "manifesto",
  "certification",
  "philosophy",
  "company_context",
  "memory_integrity",
  "graph_integrity",
  "strategy_integrity",
  "intent_integrity",
  "organizational_intelligence",
] as const;

export type EcsCategory = (typeof ECS_CATEGORIES)[number];

export type EcsSeverity = "critical" | "standard";

export interface EcsCheckResult {
  category: EcsCategory;
  checkId: string;
  name: string;
  passed: boolean;
  severity: EcsSeverity;
  evidence: string;
  metadata?: Record<string, unknown>;
}

export interface EcsCertificationReport {
  executiveId: string;
  companyId: string;
  generatedAt: string;
  score: number;
  passed: boolean;
  criticalFailures: number;
  checks: EcsCheckResult[];
  verdict: "CERTIFIED_DORMANT" | "NOT_CERTIFIED" | "PENDING";
  executivesEnabled: false;
}

export interface ExecutiveComplianceSuitePort {
  runCertification(companyId: string, executiveId: string): Promise<EcsCertificationReport>;
}

export function computeEcsScore(checks: EcsCheckResult[]): number {
  if (checks.length === 0) return 0;
  const critical = checks.filter((c) => c.severity === "critical");
  const criticalPass = critical.filter((c) => c.passed).length;
  const standard = checks.filter((c) => c.severity === "standard");
  const standardPass = standard.filter((c) => c.passed).length;
  const criticalScore = critical.length ? (criticalPass / critical.length) * 70 : 70;
  const standardScore = standard.length ? (standardPass / standard.length) * 30 : 30;
  return Math.round(criticalScore + standardScore);
}

export function isEcsCertified(report: EcsCertificationReport): boolean {
  return report.passed && report.criticalFailures === 0 && report.score >= 90;
}
