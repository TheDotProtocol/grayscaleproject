/** Council Memory — immutable searchable history (Sprint 4 Phase B) */

export type CouncilMemoryEntryType =
  | "minutes"
  | "evidence"
  | "vote"
  | "challenge"
  | "alternative"
  | "rejected_alternative"
  | "consensus"
  | "minority_report"
  | "founder_override"
  | "learning"
  | "audit"
  | "replay";

export interface CouncilMemoryEntry {
  entryId: string;
  companyId: string;
  sessionId: string;
  issueId?: string;
  entryType: CouncilMemoryEntryType;
  refId: string;
  summary: string;
  payload: Record<string, unknown>;
  correlationId: string;
  recordedAt: string;
  immutable: true;
}

export interface CouncilMinutes {
  minutesId: string;
  companyId: string;
  sessionId: string;
  issueId?: string;
  content: string;
  participatingExecutiveIds: string[];
  correlationId: string;
  recordedAt: string;
}

export interface CouncilMemorySearchResult {
  companyId: string;
  query: string;
  entries: CouncilMemoryEntry[];
  total: number;
  searchedAt: string;
}

export interface CouncilMemoryPort {
  append(entry: Omit<CouncilMemoryEntry, "entryId" | "immutable" | "recordedAt">): Promise<CouncilMemoryEntry>;
  recordMinutes(input: Omit<CouncilMinutes, "minutesId" | "recordedAt">): Promise<CouncilMinutes>;
  search(companyId: string, query: string, filters?: { sessionId?: string; entryType?: CouncilMemoryEntryType }): Promise<CouncilMemorySearchResult>;
  getBySession(sessionId: string): Promise<CouncilMemoryEntry[]>;
  replay(sessionId: string): Promise<CouncilMemoryEntry[]>;
}
