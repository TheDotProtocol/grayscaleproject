/** Executive inbox queue types */

export const EXECUTIVE_INBOX_QUEUES = [
  "inbox",
  "outbox",
  "pending",
  "completed",
  "blocked",
  "waiting",
  "escalated",
  "archived",
] as const;

export type ExecutiveInboxQueue = (typeof EXECUTIVE_INBOX_QUEUES)[number];

export interface ExecutiveInboxItem {
  id: string;
  companyId: string;
  instanceId: string;
  executiveId: string;
  queue: ExecutiveInboxQueue;
  itemType: string;
  title: string;
  payload: Record<string, unknown>;
  priority: number;
  correlationId?: string;
  traceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInboxItemInput {
  companyId: string;
  instanceId: string;
  executiveId: string;
  queue: ExecutiveInboxQueue;
  itemType: string;
  title: string;
  payload?: Record<string, unknown>;
  priority?: number;
  correlationId?: string;
  traceId?: string;
}

export interface InboxSummary {
  companyId: string;
  executiveId: string;
  instanceId: string;
  counts: Record<ExecutiveInboxQueue, number>;
  updatedAt: string;
}
