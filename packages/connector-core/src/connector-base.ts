import type {
  ConnectorPort,
  ConnectorRegistryPort,
  ConnectorCredentials,
  AuthResult,
  ConnectionContext,
  FetchQuery,
  RawProviderPayload,
  ConnectorHealth,
  WebhookResult,
  AuthMethod,
  ResourceType,
  ConnectorProviderId,
  ConnectorHealthState,
} from "@grayscale/platform";

export interface ConnectorLogger {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
}

export interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
}

const DEFAULT_RETRY: RetryConfig = { maxRetries: 3, baseDelayMs: 1000, maxDelayMs: 30000 };

/** AIP-14 — shared OAuth, retries, health, logging, lifecycle */
export abstract class ConnectorBase implements ConnectorPort {
  abstract readonly displayName: string;
  abstract readonly version: string;
  abstract readonly supportedAuth: readonly AuthMethod[];
  abstract readonly supportedResources: readonly ResourceType[];

  readonly providerId: ConnectorProviderId;
  protected readonly retryConfig: RetryConfig;
  protected readonly logger: ConnectorLogger;

  constructor(providerId: ConnectorProviderId, opts?: { retry?: Partial<RetryConfig>; logger?: ConnectorLogger }) {
    this.providerId = providerId;
    this.retryConfig = { ...DEFAULT_RETRY, ...opts?.retry };
    this.logger = opts?.logger ?? defaultLogger(providerId);
  }

  abstract authenticate(credentials: ConnectorCredentials): Promise<AuthResult>;
  abstract refreshAuth(refreshToken: string): Promise<AuthResult>;
  abstract fetchResources(ctx: ConnectionContext, query: FetchQuery): Promise<RawProviderPayload[]>;

  async revokeAuth(_ctx: ConnectionContext): Promise<void> {
    this.logger.info("Auth revoked");
  }

  async healthCheck(ctx: ConnectionContext): Promise<ConnectorHealth> {
    const start = Date.now();
    try {
      const result = await this.ping(ctx);
      return {
        providerId: this.providerId,
        state: result.state,
        message: result.message,
        lastCheckedAt: new Date().toISOString(),
        latencyMs: Date.now() - start,
        details: result.details,
      };
    } catch (err) {
      return {
        providerId: this.providerId,
        state: "offline",
        message: err instanceof Error ? err.message : String(err),
        lastCheckedAt: new Date().toISOString(),
        latencyMs: Date.now() - start,
      };
    }
  }

  protected abstract ping(ctx: ConnectionContext): Promise<{
    state: ConnectorHealthState;
    message?: string;
    details?: Record<string, unknown>;
  }>;

  async handleWebhook(_ctx: ConnectionContext, _headers: Record<string, string>, body: unknown): Promise<WebhookResult> {
    return { payloads: [], verified: false };
  }

  protected async withRetry<T>(fn: () => Promise<T>, label: string): Promise<T> {
    let lastError: unknown;
    for (let attempt = 0; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (err) {
        lastError = err;
        if (attempt < this.retryConfig.maxRetries) {
          const delay = Math.min(
            this.retryConfig.baseDelayMs * 2 ** attempt,
            this.retryConfig.maxDelayMs,
          );
          this.logger.warn(`Retry ${label} attempt ${attempt + 1}`, { delay });
          await sleep(delay);
        }
      }
    }
    throw lastError;
  }

  protected hashPayload(payload: unknown): string {
    const str = JSON.stringify(payload);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return `${this.providerId}:${Math.abs(hash).toString(16)}`;
  }

  protected buildPayload(
    resourceType: ResourceType,
    sourceId: string,
    payload: unknown,
    sourceUrl?: string,
  ): RawProviderPayload {
    return {
      providerId: this.providerId,
      resourceType,
      sourceId,
      sourceUrl,
      fetchedAt: new Date().toISOString(),
      payload,
      payloadHash: this.hashPayload(payload),
    };
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function defaultLogger(providerId: string): ConnectorLogger {
  const prefix = `[connector:${providerId}]`;
  return {
    debug: (m, meta) => console.debug(prefix, m, meta ?? ""),
    info: (m, meta) => console.info(prefix, m, meta ?? ""),
    warn: (m, meta) => console.warn(prefix, m, meta ?? ""),
    error: (m, meta) => console.error(prefix, m, meta ?? ""),
  };
}

export class ConnectorRegistry implements ConnectorRegistryPort {
  private readonly connectors = new Map<ConnectorProviderId, ConnectorPort>();

  register(connector: ConnectorPort): void {
    this.connectors.set(connector.providerId, connector);
  }

  get(providerId: ConnectorProviderId): ConnectorPort | undefined {
    return this.connectors.get(providerId);
  }

  list() {
    return [...this.connectors.values()].map((c) => ({
      providerId: c.providerId,
      displayName: c.displayName,
      version: c.version,
    }));
  }
}
