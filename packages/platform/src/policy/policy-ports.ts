import type {
  GovernanceEvaluationResult,
  GovernanceHealth,
  GovernanceMetrics,
  GovernanceState,
} from "./governance-kernel.js";
import type {
  OrganizationalPolicySnapshot,
  PolicyConstraintSnapshot,
  PolicyDecision,
  PolicyEvaluationRequest,
  PolicyExceptionSnapshot,
  PolicyHealth,
  PolicyApprovalSnapshot,
} from "./organizational-policy-engine.js";
import type { PolicyAuditEntry } from "./policy-audit.js";
import type { PolicyExplainability } from "./policy-explainability.js";
import type { PolicyHistory } from "./policy-history.js";
import type { PolicyCertificationReport } from "./policy-certification.js";
import type { GovernanceCertificationReport } from "./governance-certification.js";

export interface PolicyEnginePort {
  getSnapshot(companyId: string): Promise<OrganizationalPolicySnapshot>;
  getHealth(companyId: string): Promise<PolicyHealth>;
}

export interface PolicyEvaluationPort {
  evaluate(request: PolicyEvaluationRequest): Promise<PolicyDecision>;
}

export interface PolicyDecisionPort {
  getDecision(decisionId: string): Promise<PolicyDecision | null>;
  listRecent(companyId: string): Promise<PolicyDecision[]>;
}

export interface PolicyConstraintPort {
  assess(companyId: string): Promise<PolicyConstraintSnapshot>;
}

export interface PolicyApprovalPort {
  getQueue(companyId: string): Promise<PolicyApprovalSnapshot>;
  routeApproval(input: {
    companyId: string;
    actionRef: string;
    kind: "founder" | "council" | "executive";
    correlationId: string;
  }): Promise<{ approvalId: string }>;
}

export interface PolicyExceptionPort {
  list(companyId: string): Promise<PolicyExceptionSnapshot>;
  recordException(input: {
    companyId: string;
    policyRef: string;
    reason: string;
    correlationId: string;
    expiresAt?: string;
  }): Promise<PolicyExceptionSnapshot["active"][0]>;
}

export interface PolicyAuditPort {
  append(entry: Omit<PolicyAuditEntry, "entryId" | "recordedAt">): Promise<PolicyAuditEntry>;
  list(companyId: string): Promise<PolicyAuditEntry[]>;
}

export interface PolicyHistoryPort {
  append(companyId: string, entry: Omit<PolicyHistory["entries"][0], "entryId">): Promise<void>;
  getHistory(companyId: string): Promise<PolicyHistory>;
}

export interface PolicyExplainabilityPort {
  explain(decisionId: string): Promise<PolicyExplainability>;
}

export interface PolicyCertificationPort {
  certify(companyId: string): Promise<PolicyCertificationReport>;
}

export interface GovernanceKernelPort {
  evaluate(request: PolicyEvaluationRequest): Promise<GovernanceEvaluationResult>;
  getState(companyId: string): Promise<GovernanceState>;
  getHealth(companyId: string): Promise<GovernanceHealth>;
  getMetrics(companyId: string): Promise<GovernanceMetrics>;
}

export interface GovernanceEvaluationPort {
  checkpoint(request: PolicyEvaluationRequest): Promise<GovernanceEvaluationResult>;
}

export interface GovernanceAuditPort {
  list(companyId: string): Promise<PolicyAuditEntry[]>;
}

export interface GovernanceMetricsPort {
  getMetrics(companyId: string): Promise<GovernanceMetrics>;
}

export interface GovernanceCertificationPort {
  certify(companyId: string): Promise<GovernanceCertificationReport>;
}
