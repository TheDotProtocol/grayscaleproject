/** Organizational Policy Engine — core contracts (Sprint 4 Phase D) */

export const POLICY_ENGINE_VERSION = "1.0.0";

export type PolicyVerdict =
  | "permitted"
  | "requires_founder_approval"
  | "requires_council_consensus"
  | "requires_executive_approval"
  | "requires_evidence"
  | "requires_exception"
  | "prohibited"
  | "unknown_denied";

export type PolicyActionKind =
  | "executive_action"
  | "runtime_orchestration"
  | "workflow"
  | "simulation"
  | "automation"
  | "integration"
  | "plugin"
  | "api_call";

export interface OrganizationalPolicySnapshot {
  companyId: string;
  assembledAt: string;
  version: string;
  activePolicyCount: number;
  defaultDeny: true;
  correlationId: string;
}

export interface PolicyHealth {
  companyId: string;
  score: number;
  status: "healthy" | "degraded" | "critical";
  violationCount: number;
  pendingApprovals: number;
  assessedAt: string;
}

export interface PolicyConstraintSnapshot {
  companyId: string;
  constraints: Array<{ id: string; type: string; limit: number; currentUsage: number; isHard: boolean }>;
  violationCount: number;
  assessedAt: string;
}

export interface PolicyApprovalSnapshot {
  companyId: string;
  pending: Array<{ approvalId: string; kind: "founder" | "council" | "executive"; actionRef: string; requestedAt: string }>;
  completed: number;
  assessedAt: string;
}

export interface PolicyExceptionSnapshot {
  companyId: string;
  active: Array<{ exceptionId: string; policyRef: string; reason: string; expiresAt?: string; immutable: true }>;
  assessedAt: string;
}

export interface PolicyDecision {
  decisionId: string;
  companyId: string;
  actionKind: PolicyActionKind;
  actionRef: string;
  verdict: PolicyVerdict;
  reasons: string[];
  requiredApprovals: Array<"founder" | "council" | "executive">;
  evidenceRequired: boolean;
  correlationId: string;
  evaluatedAt: string;
  version: string;
}

export interface PolicyEvaluationRequest {
  companyId: string;
  actionKind: PolicyActionKind;
  actionRef: string;
  context?: Record<string, unknown>;
  correlationId: string;
}

/** Sprint 5 extension points — NOT implemented */
export interface PolicyExtensionPoints {
  policyInheritance?: "reserved";
  crossCompanyFederation?: "reserved";
  policyTemplates?: "reserved";
  industryCompliancePacks?: "reserved";
  regulatoryPolicies?: "reserved";
  regionalGovernance?: "reserved";
  autonomousPolicyEnforcement?: "reserved";
  multiOrganizationGovernance?: "reserved";
}
