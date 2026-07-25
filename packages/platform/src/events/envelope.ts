import { getEventVersion, type PlatformEventType } from "./catalog.js";

export type EventStatus = "pending" | "processing" | "processed" | "failed";

/** Immutable platform event envelope — persisted in domain_events */
export interface PlatformEvent<T = unknown> {
  id: string;
  type: PlatformEventType | string;
  version: number;
  companyId: string;
  userId?: string;
  payload: T;
  metadata: PlatformEventMetadata;
}

export interface PlatformEventMetadata {
  correlationId: string;
  causationId?: string;
  traceId?: string;
  timestamp: string;
  source: string;
}

/** @deprecated Use PlatformEvent — kept for backward compatibility */
export type DomainEvent<T = unknown> = PlatformEvent<T>;

export interface PublishEventOptions {
  userId?: string;
  correlationId?: string;
  causationId?: string;
  traceId?: string;
  source: string;
}

export function createPlatformEvent<T>(
  type: PlatformEventType | string,
  companyId: string,
  payload: T,
  options: PublishEventOptions,
): PlatformEvent<T> {
  return {
    id: crypto.randomUUID(),
    type,
    version: getEventVersion(type),
    companyId,
    userId: options.userId,
    payload,
    metadata: {
      correlationId: options.correlationId ?? crypto.randomUUID(),
      causationId: options.causationId,
      traceId: options.traceId,
      timestamp: new Date().toISOString(),
      source: options.source,
    },
  };
}

/** @deprecated Use createPlatformEvent */
export function createDomainEvent<T>(
  type: PlatformEventType | string,
  companyId: string,
  payload: T,
  options: PublishEventOptions,
): PlatformEvent<T> {
  return createPlatformEvent(type, companyId, payload, options);
}

export interface StoredDomainEvent {
  id: string;
  sequence: bigint;
  companyId: string;
  type: string;
  version: number;
  userId: string | null;
  payload: unknown;
  correlationId: string;
  causationId: string | null;
  traceId: string | null;
  source: string;
  status: EventStatus;
  processedAt: string | null;
  createdAt: string;
}

export function storedToPlatformEvent(row: StoredDomainEvent): PlatformEvent {
  return {
    id: row.id,
    type: row.type,
    version: row.version,
    companyId: row.companyId,
    userId: row.userId ?? undefined,
    payload: row.payload,
    metadata: {
      correlationId: row.correlationId,
      causationId: row.causationId ?? undefined,
      traceId: row.traceId ?? undefined,
      timestamp: row.createdAt,
      source: row.source,
    },
  };
}
