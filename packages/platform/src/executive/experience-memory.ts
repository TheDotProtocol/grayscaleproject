/** Executive Experience Memory — lessons learned (≠ Company Memory) (ADR-014) */

export type ExperienceEntryType =
  | "lesson_learned"
  | "founder_correction"
  | "recommendation_outcome"
  | "communication_improvement"
  | "success_pattern"
  | "behaviour_observation";

export interface ExecutiveExperienceEntry {
  id: string;
  companyId: string;
  executiveId: string;
  type: ExperienceEntryType;
  title: string;
  summary: string;
  recommendationId?: string;
  outcome?: "success" | "failure" | "partial" | "unknown";
  evidenceRefs: string[];
  metadata: Record<string, unknown>;
  recordedAt: string;
}

export interface ExecutiveExperienceMemoryPort {
  record(entry: Omit<ExecutiveExperienceEntry, "id" | "recordedAt">): Promise<ExecutiveExperienceEntry>;
  list(executiveId: string, companyId: string, type?: ExperienceEntryType, limit?: number): Promise<ExecutiveExperienceEntry[]>;
  get(id: string): Promise<ExecutiveExperienceEntry | null>;
  /** Experience memory MUST NOT overwrite company memory */
  assertSeparateFromCompanyMemory(): true;
}
