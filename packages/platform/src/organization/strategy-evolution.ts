/** Strategy Evolution Engine — proposes evolution, never auto-updates (Sprint 4) */

import type { EngineEvidenceRef, VersionedEngineRecord } from "./common.js";

export type StrategyEvolutionStatus = "proposed" | "under_review" | "approved" | "rejected" | "superseded";

export interface StrategyEvolutionProposal extends VersionedEngineRecord {
  title: string;
  summary: string;
  currentStrategyRef: string;
  proposedChange: string;
  evidence: EngineEvidenceRef[];
  confidence: number;
  reason: string;
  alternatives: Array<{ title: string; summary: string; tradeoffs: string }>;
  impact: string;
  rollbackStrategy: string;
  sources: Array<"learning" | "wisdom" | "forecast" | "twin_evolution" | "scenario" | "market" | "risk">;
  status: StrategyEvolutionStatus;
  twinVersionId?: string;
  correlationId: string;
}

export interface StrategyEvolutionPort {
  readonly engineId: "strategy-evolution";
  propose(input: Omit<StrategyEvolutionProposal, "id" | "version" | "status" | "createdAt" | "updatedAt">): Promise<StrategyEvolutionProposal>;
  list(companyId: string, filters?: { status?: StrategyEvolutionStatus }): Promise<StrategyEvolutionProposal[]>;
  get(id: string): Promise<StrategyEvolutionProposal | null>;
}
