/** Executive Notebook — per-executive private reasoning store (ADR-028)
 *  Notebook ≠ Organizational Memory. Entries are NOT recommendations.
 */

export const NOTEBOOK_ENTRY_TYPES = [
  "observation",
  "hypothesis",
  "assumption",
  "investigation",
  "open_question",
  "rejected_idea",
  "lesson_learned",
  "watch_item",
  "reflection",
] as const;

export type NotebookEntryType = (typeof NOTEBOOK_ENTRY_TYPES)[number];

export interface NotebookLinkRefs {
  memoryIds?: string[];
  graphNodeIds?: string[];
  eventIds?: string[];
  investigationIds?: string[];
}

export interface ExecutiveNotebookEntry {
  id: string;
  companyId: string;
  executiveId: string;
  entryType: NotebookEntryType;
  title: string;
  content: string;
  version: number;
  previousEntryId?: string;
  links: NotebookLinkRefs;
  correlationId: string;
  sourceEventId?: string;
  immutable: true;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface CreateNotebookEntryInput {
  companyId: string;
  executiveId: string;
  entryType: NotebookEntryType;
  title: string;
  content: string;
  links?: NotebookLinkRefs;
  correlationId: string;
  sourceEventId?: string;
  metadata?: Record<string, unknown>;
}

export interface ExecutiveNotebookPort {
  record(input: CreateNotebookEntryInput): Promise<ExecutiveNotebookEntry>;
  get(id: string): Promise<ExecutiveNotebookEntry | null>;
  search(
    companyId: string,
    executiveId: string,
    query?: { type?: NotebookEntryType; q?: string; limit?: number },
  ): Promise<ExecutiveNotebookEntry[]>;
  /** Append-only — updates create new version rows */
  appendVersion(
    entryId: string,
    content: string,
    correlationId: string,
  ): Promise<ExecutiveNotebookEntry>;
}
