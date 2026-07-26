/** Attention Budget Audit — append-only (Sprint 4 Phase C) */

export interface AttentionBudgetAuditEntry {
  entryId: string;
  companyId: string;
  action: string;
  actorId: string;
  correlationId: string;
  traceId: string;
  details: Record<string, unknown>;
  recordedAt: string;
}
