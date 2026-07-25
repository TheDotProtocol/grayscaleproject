# Connector Specification

Phase 1.5F — provider adapter contract for the Connector Framework.

## Overview

Connectors are **provider-specific adapters** that translate external API protocols into a common interface. They live in `packages/connectors/{provider}/` and are never imported by Core Platform modules directly.

## ConnectorPort

```typescript
interface ConnectorPort {
  readonly providerId: string;       // e.g. "github"
  readonly displayName: string;
  readonly version: string;
  readonly supportedAuth: AuthMethod[];
  readonly supportedResources: ResourceType[];

  authenticate(credentials: ConnectorCredentials): Promise<AuthResult>;
  refreshAuth(refreshToken: string): Promise<AuthResult>;
  revokeAuth(connection: ConnectionContext): Promise<void>;
  healthCheck(connection: ConnectionContext): Promise<ConnectorHealth>;
  fetchResources(ctx: ConnectionContext, query: FetchQuery): Promise<RawProviderPayload[]>;
  handleWebhook(ctx: ConnectionContext, headers: Record<string, string>, body: unknown): Promise<WebhookResult>;
}
```

## Auth Methods

| Method | Use Case |
|--------|----------|
| `oauth2` | GitHub, Google, Slack, Stripe |
| `api_key` | Cloudflare, Vultr |
| `pat` | GitHub personal access token (legacy) |
| `webhook_secret` | Inbound webhook verification |
| `none` | Read-only public APIs |

## Resource Types

`commits`, `pull_requests`, `issues`, `calendar_events`, `messages`, `invoices`, `assets`, `documents`, `metrics`

## Raw Provider Payload

```typescript
interface RawProviderPayload {
  providerId: string;
  resourceType: ResourceType;
  sourceId: string;
  sourceUrl?: string;
  fetchedAt: string;
  payload: unknown;           // provider-native shape
  payloadHash: string;        // SHA-256 for dedup
}
```

Connectors return raw payloads. **Normalization is not a connector responsibility.**

## Connector Registry

```typescript
interface ConnectorRegistryPort {
  register(connector: ConnectorPort): void;
  get(providerId: string): ConnectorPort | undefined;
  list(): ConnectorManifest[];
}
```

Dynamic registration — new connectors added without modifying Integration Layer orchestrator (mirrors AIP-10 engine registry pattern).

## Error Handling

All connector errors map to structured `ConnectorError`:

| Code | Meaning |
|------|---------|
| `AUTH_EXPIRED` | Token refresh required |
| `RATE_LIMITED` | Back off per provider headers |
| `NOT_FOUND` | Resource deleted at provider |
| `PROVIDER_ERROR` | Upstream 5xx |
| `INVALID_CREDENTIALS` | Auth failure |

## Provider Roadmap

| Provider | 1.5F | Package Path |
|----------|------|--------------|
| GitHub | Full | `packages/connectors/github` |
| GitLab | Stub | `packages/connectors/gitlab` |
| Slack | Stub | `packages/connectors/slack` |
| Google Workspace | Stub | `packages/connectors/google-workspace` |
| Stripe | Stub | `packages/connectors/stripe` |
| Cloudflare | Stub | `packages/connectors/cloudflare` |
| Cursor | Stub | `packages/connectors/cursor` |
| Others | Interface only | Reserved |

## Testing

- Unit: mock HTTP with provider fixtures
- Contract: verify `ConnectorPort` compliance
- Integration: sandbox credentials against provider test APIs

See [INTEGRATION_PLUGIN_PLATFORM_DESIGN_REVIEW.md](../architecture/INTEGRATION_PLUGIN_PLATFORM_DESIGN_REVIEW.md).
