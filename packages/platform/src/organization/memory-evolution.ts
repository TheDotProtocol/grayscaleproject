/** Organizational Memory Evolution Engine — Sprint 4 (ADR-046) */

import type { EngineEvidenceRef, VersionedEngineRecord } from "./common.js";

export const MEMORY_EVOLUTION_STAGES = [
  "observation",
  "pattern",
  "learning",
  "validated_learning",
  "wisdom",
  "institutional_principle",
] as const;

export type MemoryEvolutionStage = (typeof MEMORY_EVOLUTION_STAGES)[number];

/** Additional evolution layer — memory itself remains immutable */
export interface MemoryEvolutionLayer extends VersionedEngineRecord {
  sourceMemoryId: string;
  stage: MemoryEvolutionStage;
  summary: string;
  evidence: EngineEvidenceRef[];
  confidence: number;
  reason: string;
  alternatives: string[];
  impact: string;
  rollbackStrategy: string;
  correlationId: string;
}

export interface MemoryEvolutionPort {
  readonly engineId: "memory-evolution";
  evolve(input: Omit<MemoryEvolutionLayer, "id" | "version" | "createdAt" | "updatedAt">): Promise<MemoryEvolutionLayer>;
  getLayers(companyId: string, filters?: { stage?: MemoryEvolutionStage; sourceMemoryId?: string }): Promise<MemoryEvolutionLayer[]>;
  getTimeline(companyId: string, limit?: number): Promise<MemoryEvolutionLayer[]>;
  getIntegrity(companyId: string): Promise<{ immutableMemoryPreserved: boolean; layerCount: number }>;
}
