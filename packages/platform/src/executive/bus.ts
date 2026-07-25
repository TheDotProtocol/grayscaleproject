/** Executive communication bus — event-driven, no direct executive-to-executive calls */

export const EXECUTIVE_MESSAGE_TYPES = [
  "request",
  "response",
  "notification",
  "escalation",
  "delegation",
  "broadcast",
] as const;

export type ExecutiveMessageType = (typeof EXECUTIVE_MESSAGE_TYPES)[number];

export const EXECUTIVE_MESSAGE_STATUS = [
  "pending",
  "delivered",
  "failed",
  "timeout",
  "retrying",
] as const;

export type ExecutiveMessageStatus = (typeof EXECUTIVE_MESSAGE_STATUS)[number];

export interface ExecutiveBusMessage {
  id: string;
  companyId: string;
  messageType: ExecutiveMessageType;
  fromExecutiveId?: string;
  toExecutiveId?: string;
  instanceId?: string;
  subject: string;
  payload: Record<string, unknown>;
  status: ExecutiveMessageStatus;
  correlationId: string;
  traceId?: string;
  causationId?: string;
  retryCount: number;
  maxRetries: number;
  timeoutAt?: string;
  createdAt: string;
  deliveredAt?: string;
}

export interface SendExecutiveMessageInput {
  companyId: string;
  messageType: ExecutiveMessageType;
  fromExecutiveId?: string;
  toExecutiveId?: string;
  instanceId?: string;
  subject: string;
  payload?: Record<string, unknown>;
  correlationId?: string;
  traceId?: string;
  causationId?: string;
  timeoutMs?: number;
  maxRetries?: number;
}

export interface ExecutiveBusPort {
  send(input: SendExecutiveMessageInput): Promise<ExecutiveBusMessage>;
  respond(
    originalMessageId: string,
    payload: Record<string, unknown>,
    fromExecutiveId: string,
  ): Promise<ExecutiveBusMessage>;
  getPending(companyId: string, executiveId: string): Promise<ExecutiveBusMessage[]>;
  markDelivered(messageId: string): Promise<ExecutiveBusMessage>;
  retry(messageId: string): Promise<ExecutiveBusMessage>;
}

export interface ExecutiveAuditEntry {
  id: string;
  companyId: string;
  instanceId?: string;
  executiveId?: string;
  action: string;
  actorType: "system" | "executive" | "founder";
  actorId?: string;
  metadata: Record<string, unknown>;
  correlationId?: string;
  traceId?: string;
  createdAt: string;
}

export interface ExecutiveAuditPort {
  log(entry: Omit<ExecutiveAuditEntry, "id" | "createdAt">): Promise<ExecutiveAuditEntry>;
  query(companyId: string, filters?: { executiveId?: string; limit?: number }): Promise<ExecutiveAuditEntry[]>;
}
