/** Governance Kernel — constitutional enforcement checkpoint (Sprint 4 Phase D) */

export const GOVERNANCE_KERNEL_VERSION = "1.0.0";

export interface GovernanceState {
  companyId: string;
  kernelVersion: string;
  defaultDeny: true;
  lastEvaluationAt?: string;
  pendingApprovals: number;
  activeExceptions: number;
  riskEscalations: number;
  assembledAt: string;
}

export interface GovernanceHealth {
  companyId: string;
  score: number;
  status: "healthy" | "degraded" | "critical";
  issues: string[];
  assessedAt: string;
}

export interface GovernanceMetrics {
  companyId: string;
  periodStart: string;
  periodEnd: string;
  evaluationsTotal: number;
  permittedCount: number;
  deniedCount: number;
  approvalRoutedCount: number;
  exceptionCount: number;
}

export interface GovernanceEvaluationResult {
  evaluationId: string;
  companyId: string;
  permitted: boolean;
  policyDecisionId: string;
  verdict: import("./organizational-policy-engine.js").PolicyVerdict;
  checkpointPassed: boolean;
  correlationId: string;
  evaluatedAt: string;
  version: string;
}
