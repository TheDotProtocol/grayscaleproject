/** Normalization layer — AIP-15 no external schema in core */

export const NORMALIZED_ENTITY_TYPES = [
  "task",
  "meeting",
  "development_activity",
  "bill",
  "message",
  "design_asset",
  "document",
  "notification",
  "metric",
] as const;

export type NormalizedEntityType = (typeof NORMALIZED_ENTITY_TYPES)[number];

export interface NormalizedEntity {
  id?: string;
  companyId: string;
  entityType: NormalizedEntityType;
  sourceProvider: string;
  sourceId: string;
  sourceUrl?: string;
  displayName: string;
  summary?: string;
  occurredAt: string;
  metadata: Record<string, unknown>;
  rawPayloadHash: string;
  idempotencyKey: string;
}

export interface NormalizationResult {
  entity: NormalizedEntity;
  platformEventType: string;
  platformEventPayload: Record<string, unknown>;
}

export interface NormalizerPort {
  readonly providerId: string;
  normalize(raw: import("./connector.js").RawProviderPayload, companyId: string): NormalizationResult;
}
