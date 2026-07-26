/** Policy Audit — append-only (Sprint 4 Phase D) */

export interface PolicyAuditEntry {
  entryId: string;
  companyId: string;
  action: string;
  actorId: string;
  correlationId: string;
  traceId: string;
  details: Record<string, unknown>;
  recordedAt: string;
}
