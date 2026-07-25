/** Connector framework — AIP-14 provider isolation */

export const CONNECTOR_PROVIDER_IDS = [
  "github",
  "gitlab",
  "cursor",
  "replit",
  "google",
  "microsoft",
  "apple",
  "figma",
  "canva",
  "slack",
  "discord",
  "stripe",
  "vultr",
  "cloudflare",
  "asktrabaajo",
  "taucore",
  "dotprotocol",
] as const;

export type ConnectorProviderId = (typeof CONNECTOR_PROVIDER_IDS)[number];

export const AUTH_METHODS = ["oauth2", "api_key", "pat", "webhook_secret", "none"] as const;
export type AuthMethod = (typeof AUTH_METHODS)[number];

export const RESOURCE_TYPES = [
  "commits",
  "pull_requests",
  "issues",
  "calendar_events",
  "messages",
  "invoices",
  "assets",
  "documents",
  "metrics",
  "activities",
] as const;

export type ResourceType = (typeof RESOURCE_TYPES)[number];

export const CONNECTOR_HEALTH_STATES = [
  "healthy",
  "warning",
  "offline",
  "authentication_failed",
  "rate_limited",
  "sync_delayed",
  "configuration_error",
  "maintenance",
] as const;

export type ConnectorHealthState = (typeof CONNECTOR_HEALTH_STATES)[number];

export interface ConnectorCredentials {
  accessToken?: string;
  refreshToken?: string;
  apiKey?: string;
  expiresAt?: string;
  metadata?: Record<string, unknown>;
}

export interface AuthResult {
  success: boolean;
  credentials?: ConnectorCredentials;
  error?: string;
}

export interface ConnectionContext {
  companyId: string;
  providerId: ConnectorProviderId;
  credentials: ConnectorCredentials;
  config: Record<string, unknown>;
}

export interface FetchQuery {
  resourceType: ResourceType;
  since?: string;
  limit?: number;
  cursor?: string;
}

export interface RawProviderPayload {
  providerId: ConnectorProviderId;
  resourceType: ResourceType;
  sourceId: string;
  sourceUrl?: string;
  fetchedAt: string;
  payload: unknown;
  payloadHash: string;
}

export interface ConnectorHealth {
  providerId: ConnectorProviderId;
  state: ConnectorHealthState;
  message?: string;
  lastCheckedAt: string;
  latencyMs?: number;
  details?: Record<string, unknown>;
}

export interface WebhookResult {
  payloads: RawProviderPayload[];
  verified: boolean;
}

export interface ConnectorError {
  code: "AUTH_EXPIRED" | "RATE_LIMITED" | "NOT_FOUND" | "PROVIDER_ERROR" | "INVALID_CREDENTIALS" | "CONFIG_ERROR";
  message: string;
  retryable: boolean;
  retryAfterMs?: number;
}

export interface ConnectorPort {
  readonly providerId: ConnectorProviderId;
  readonly displayName: string;
  readonly version: string;
  readonly supportedAuth: readonly AuthMethod[];
  readonly supportedResources: readonly ResourceType[];

  authenticate(credentials: ConnectorCredentials): Promise<AuthResult>;
  refreshAuth(refreshToken: string): Promise<AuthResult>;
  revokeAuth(ctx: ConnectionContext): Promise<void>;
  healthCheck(ctx: ConnectionContext): Promise<ConnectorHealth>;
  fetchResources(ctx: ConnectionContext, query: FetchQuery): Promise<RawProviderPayload[]>;
  handleWebhook(ctx: ConnectionContext, headers: Record<string, string>, body: unknown): Promise<WebhookResult>;
}

export interface ConnectorRegistryPort {
  register(connector: ConnectorPort): void;
  get(providerId: ConnectorProviderId): ConnectorPort | undefined;
  list(): { providerId: ConnectorProviderId; displayName: string; version: string }[];
}
