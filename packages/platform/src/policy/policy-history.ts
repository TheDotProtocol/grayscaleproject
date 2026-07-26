/** Policy History — immutable, versioned (Sprint 4 Phase D) */

export interface PolicyHistoryEntry {
  entryId: string;
  companyId: string;
  action: "evaluate" | "approve" | "deny" | "exception" | "override";
  summary: string;
  policyVersion: string;
  correlationId: string;
  recordedAt: string;
  immutable: true;
}

export interface PolicyHistory {
  companyId: string;
  entries: PolicyHistoryEntry[];
  from: string;
  to: string;
}
