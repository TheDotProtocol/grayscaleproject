/** Organizational DNA Engine — immutable company identity (ADR-015) */

import type {
  EngineAuditEntry,
  EngineEvidenceRef,
  EngineLinkRef,
  VersionedEngineRecord,
} from "./common.js";

export interface OrganizationalDnaContent {
  vision: string;
  mission: string;
  coreValues: string[];
  operatingPrinciples: string[];
  leadershipPhilosophy: string;
  productPhilosophy: string;
  hiringPhilosophy: string;
  innovationPhilosophy: string;
  customerPhilosophy: string;
  ethicalStandards: string[];
  brandPersonality: string;
  communicationStyle: string;
  riskAppetite: "conservative" | "moderate" | "aggressive" | "unknown";
  strategicPriorities: string[];
  decisionStyle: string;
  competitivePhilosophy: string;
  longTermAmbitions: string[];
  culturePrinciples: string[];
  nonNegotiables: string[];
}

export interface OrganizationalDnaRecord extends VersionedEngineRecord, OrganizationalDnaContent {
  evidence: EngineEvidenceRef[];
  auditTrail: EngineAuditEntry[];
  links: EngineLinkRef;
  /** Immutable history — prior versions retained */
  evolutionHistory: Array<{ version: number; changedAt: string; summary: string }>;
}

export interface OrganizationalDnaEnginePort {
  readonly engineId: "organizational-dna";
  get(companyId: string): Promise<OrganizationalDnaRecord | null>;
  /** Updates require approval workflow — executives MUST NOT call */
  proposeUpdate(
    companyId: string,
    patch: Partial<OrganizationalDnaContent>,
    evidence: EngineEvidenceRef[],
    actorId: string,
  ): Promise<OrganizationalDnaRecord>;
  approveVersion(companyId: string, versionId: string, approverId: string): Promise<OrganizationalDnaRecord>;
  getHistory(companyId: string): Promise<OrganizationalDnaRecord[]>;
}
