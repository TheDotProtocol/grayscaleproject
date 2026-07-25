/** Organizational Reputation Engine — external perception (ADR-021) */

import type { EngineEvidenceRef, ExplainableScore } from "./common.js";

export const REPUTATION_SOURCES = [
  "customers",
  "investors",
  "partners",
  "press",
  "employees",
  "community",
] as const;

export type ReputationSource = (typeof REPUTATION_SOURCES)[number];

export interface ReputationSignal {
  source: ReputationSource;
  score: ExplainableScore;
  /** No external integrations in Phase A.2 — manual/evidence only */
  integrationStatus: "manual" | "pending" | "connected";
  evidence: EngineEvidenceRef[];
}

export interface OrganizationalReputationSnapshot {
  companyId: string;
  signals: ReputationSignal[];
  overallReputation: ExplainableScore;
  computedAt: string;
}

export interface OrganizationalReputationEnginePort {
  readonly engineId: "organizational-reputation";
  getSnapshot(companyId: string): Promise<OrganizationalReputationSnapshot>;
  /** Contracts only — no external API integrations yet */
  recordManualSignal(
    companyId: string,
    source: ReputationSource,
    score: Omit<ExplainableScore, "computedAt">,
    evidence: EngineEvidenceRef[],
  ): Promise<OrganizationalReputationSnapshot>;
}
