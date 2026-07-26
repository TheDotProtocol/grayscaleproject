/** Executive Network — organizational relationship model (Sprint 3 Phase D) */

import type { ExecutiveCanonicalId } from "./executive-identity.js";

export type ExecutiveNetworkLifecycleState =
  | "registered"
  | "certifying"
  | "certified_dormant"
  | "active"
  | "suspended"
  | "retired";

export type ExecutiveBusMessageKind =
  | "request"
  | "evidence"
  | "challenge"
  | "delegation"
  | "counter_argument"
  | "consensus_update"
  | "confidence_change"
  | "new_evidence"
  | "escalation"
  | "replay";

export interface ExecutiveDependency {
  fromExecutiveId: string;
  toExecutiveId: string;
  dependencyType: "operational" | "financial" | "strategic" | "risk" | "communication" | "innovation";
  sharedDomains: string[];
  bidirectional: boolean;
}

export interface ExecutiveTrustEdge {
  fromExecutiveId: string;
  toExecutiveId: string;
  trustScore: number;
  collaborationCount: number;
  lastCollaborationAt?: string;
  evidenceBacked: boolean;
}

export interface ExecutiveCollaborationRecord {
  collaborationId: string;
  companyId: string;
  participantIds: string[];
  sessionId?: string;
  messageKind: ExecutiveBusMessageKind;
  occurredAt: string;
  correlationId: string;
}

export interface ExecutiveCoverage {
  executiveId: string;
  domainsCovered: string[];
  decisionClassesCovered: string[];
  coveragePercent: number;
}

export interface ExecutiveNetworkNode {
  executiveId: ExecutiveCanonicalId | "athena";
  title: string;
  lifecycleState: ExecutiveNetworkLifecycleState;
  certified: boolean;
  councilMember: boolean;
  dependencies: ExecutiveDependency[];
  trustEdges: ExecutiveTrustEdge[];
  coverage: ExecutiveCoverage;
}

export interface ExecutiveNetwork {
  companyId: string;
  assembledAt: string;
  version: string;
  nodes: ExecutiveNetworkNode[];
  collaborationFrequency: Record<string, number>;
  sharedResponsibilities: Array<{ domain: string; executiveIds: string[] }>;
  sharedRisks: string[];
  sharedOpportunities: string[];
}

export interface ExecutiveNetworkPort {
  assemble(companyId: string): Promise<ExecutiveNetwork>;
  getDependencies(companyId: string, executiveId: string): Promise<ExecutiveDependency[]>;
  getTrustEdges(companyId: string, executiveId: string): Promise<ExecutiveTrustEdge[]>;
  recordCollaboration(input: Omit<ExecutiveCollaborationRecord, "collaborationId" | "occurredAt">): Promise<ExecutiveCollaborationRecord>;
  getCollaborationHistory(companyId: string, filters?: { executiveId?: string }): Promise<ExecutiveCollaborationRecord[]>;
  getCoverage(companyId: string): Promise<ExecutiveCoverage[]>;
}
