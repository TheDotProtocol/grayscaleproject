/** Organizational Autonomy Framework — constitutional automation (Sprint 4) */

import type { EngineEvidenceRef, VersionedEngineRecord } from "./common.js";

export type AutonomyPolicyStatus = "draft" | "approved" | "suspended" | "revoked";

export interface AutonomyPolicy extends VersionedEngineRecord {
  name: string;
  description: string;
  founderPolicyRef: string;
  riskAssessment: string;
  confidenceThreshold: number;
  rollbackCapability: string;
  auditRequired: true;
  explainabilityRequired: true;
  status: AutonomyPolicyStatus;
  approvedBy?: string;
  approvedAt?: string;
}

export interface AutonomyActionRecord {
  actionId: string;
  companyId: string;
  policyId: string;
  actionType: string;
  confidence: number;
  explainability: { reason: string; evidence: EngineEvidenceRef[] };
  rollbackAvailable: boolean;
  occurredAt: string;
  correlationId: string;
}

export interface AutonomyReadiness {
  companyId: string;
  approvedPolicies: number;
  suspendedPolicies: number;
  actionsRecorded: number;
  complianceScore: number;
  readyForAutonomy: boolean;
  computedAt: string;
}

export interface OrganizationalAutonomyPort {
  readonly engineId: "organizational-autonomy";
  proposePolicy(input: Omit<AutonomyPolicy, "id" | "version" | "status" | "createdAt" | "updatedAt">): Promise<AutonomyPolicy>;
  approvePolicy(id: string, approverId: string): Promise<AutonomyPolicy>;
  listPolicies(companyId: string): Promise<AutonomyPolicy[]>;
  recordAction(input: Omit<AutonomyActionRecord, "actionId" | "occurredAt">): Promise<AutonomyActionRecord>;
  getReadiness(companyId: string): Promise<AutonomyReadiness>;
}
