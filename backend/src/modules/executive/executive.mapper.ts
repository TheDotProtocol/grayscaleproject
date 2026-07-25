import type {
  ExecutiveInstance,
  ExecutiveInboxItem,
  ExecutiveInboxQueue,
  ExecutiveBusMessage,
  ExecutiveAuditEntry,
  ExecutiveOutput,
  ExecutivePermission,
  ExecutiveCapability,
  ExecutiveLifecycleState,
  InboxSummary,
} from "@grayscale/platform";
import { EXECUTIVE_INBOX_QUEUES } from "@grayscale/platform";

export function rowToInstance(row: {
  id: string;
  companyId: string;
  executiveId: string;
  lifecycleState: string;
  capabilities: unknown;
  permissions: unknown;
  metadata: unknown;
  lastContextAt: Date | null;
  lastActivityAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): ExecutiveInstance {
  return {
    id: row.id,
    companyId: row.companyId,
    executiveId: row.executiveId,
    lifecycleState: row.lifecycleState as ExecutiveLifecycleState,
    capabilities: (row.capabilities as ExecutiveCapability[]) ?? [],
    permissions: (row.permissions as ExecutivePermission[]) ?? [],
    metadata: (row.metadata ?? {}) as Record<string, unknown>,
    lastContextAt: row.lastContextAt?.toISOString(),
    lastActivityAt: row.lastActivityAt?.toISOString(),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function rowToInboxItem(row: {
  id: string;
  companyId: string;
  instanceId: string;
  executiveId: string;
  queue: string;
  itemType: string;
  title: string;
  payload: unknown;
  priority: number;
  correlationId: string | null;
  traceId: string | null;
  createdAt: Date;
  updatedAt: Date;
}): ExecutiveInboxItem {
  return {
    id: row.id,
    companyId: row.companyId,
    instanceId: row.instanceId,
    executiveId: row.executiveId,
    queue: row.queue as ExecutiveInboxQueue,
    itemType: row.itemType,
    title: row.title,
    payload: (row.payload ?? {}) as Record<string, unknown>,
    priority: row.priority,
    correlationId: row.correlationId ?? undefined,
    traceId: row.traceId ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function rowToBusMessage(row: {
  id: string;
  companyId: string;
  instanceId: string | null;
  messageType: string;
  fromExecutiveId: string | null;
  toExecutiveId: string | null;
  subject: string;
  payload: unknown;
  status: string;
  correlationId: string;
  traceId: string | null;
  causationId: string | null;
  retryCount: number;
  maxRetries: number;
  timeoutAt: Date | null;
  createdAt: Date;
  deliveredAt: Date | null;
}): ExecutiveBusMessage {
  return {
    id: row.id,
    companyId: row.companyId,
    instanceId: row.instanceId ?? undefined,
    messageType: row.messageType as ExecutiveBusMessage["messageType"],
    fromExecutiveId: row.fromExecutiveId ?? undefined,
    toExecutiveId: row.toExecutiveId ?? undefined,
    subject: row.subject,
    payload: (row.payload ?? {}) as Record<string, unknown>,
    status: row.status as ExecutiveBusMessage["status"],
    correlationId: row.correlationId,
    traceId: row.traceId ?? undefined,
    causationId: row.causationId ?? undefined,
    retryCount: row.retryCount,
    maxRetries: row.maxRetries,
    timeoutAt: row.timeoutAt?.toISOString(),
    createdAt: row.createdAt.toISOString(),
    deliveredAt: row.deliveredAt?.toISOString(),
  };
}

export function rowToAudit(row: {
  id: string;
  companyId: string;
  instanceId: string | null;
  executiveId: string | null;
  action: string;
  actorType: string;
  actorId: string | null;
  metadata: unknown;
  correlationId: string | null;
  traceId: string | null;
  createdAt: Date;
}): ExecutiveAuditEntry {
  return {
    id: row.id,
    companyId: row.companyId,
    instanceId: row.instanceId ?? undefined,
    executiveId: row.executiveId ?? undefined,
    action: row.action,
    actorType: row.actorType as ExecutiveAuditEntry["actorType"],
    actorId: row.actorId ?? undefined,
    metadata: (row.metadata ?? {}) as Record<string, unknown>,
    correlationId: row.correlationId ?? undefined,
    traceId: row.traceId ?? undefined,
    createdAt: row.createdAt.toISOString(),
  };
}

export function rowToOutput(row: {
  id: string;
  companyId: string;
  instanceId: string;
  executiveId: string;
  outputType: string;
  title: string;
  summary: string;
  explainability: unknown;
  payload: unknown;
  correlationId: string;
  traceId: string | null;
  createdAt: Date;
}): ExecutiveOutput {
  return {
    id: row.id,
    companyId: row.companyId,
    executiveId: row.executiveId,
    instanceId: row.instanceId,
    outputType: row.outputType,
    title: row.title,
    summary: row.summary,
    explainability: row.explainability as ExecutiveOutput["explainability"],
    payload: (row.payload ?? {}) as Record<string, unknown>,
    correlationId: row.correlationId,
    traceId: row.traceId ?? undefined,
    createdAt: row.createdAt.toISOString(),
  };
}

export function emptyInboxCounts(): Record<ExecutiveInboxQueue, number> {
  return EXECUTIVE_INBOX_QUEUES.reduce(
    (acc, q) => ({ ...acc, [q]: 0 }),
    {} as Record<ExecutiveInboxQueue, number>,
  );
}

export function toInboxSummary(
  instance: ExecutiveInstance,
  counts: Record<ExecutiveInboxQueue, number>,
): InboxSummary {
  return {
    companyId: instance.companyId,
    executiveId: instance.executiveId,
    instanceId: instance.id,
    counts,
    updatedAt: new Date().toISOString(),
  };
}
