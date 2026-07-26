/** Attention Budget History — versioned allocation trail (Sprint 4 Phase C) */

export interface AttentionBudgetHistoryEntry {
  entryId: string;
  companyId: string;
  action: "allocate" | "recover" | "debt_accumulate" | "debt_recover" | "capacity_measure";
  summary: string;
  correlationId: string;
  version: string;
  recordedAt: string;
}

export interface AttentionBudgetHistory {
  companyId: string;
  entries: AttentionBudgetHistoryEntry[];
  from: string;
  to: string;
}
