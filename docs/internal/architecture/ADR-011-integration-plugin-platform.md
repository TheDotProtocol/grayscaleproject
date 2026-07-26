# ADR-011: Integration & Plugin Platform

**Status:** Accepted  
**Date:** 2026-07-25  
**Phase:** 1.5F  
**Deciders:** Founding Principal Engineer

---

## Context

Project Grayscale must connect to external systems (GitHub, Slack, Google Workspace, Stripe, etc.) without coupling the Core Platform or Executive Runtime to vendor-specific implementations.

Today:
- GitHub sync is embedded in `MemoryService`
- `PluginsService` is an in-process hook registry (~30% complete)
- Integration credentials stored in plaintext on `Integration.accessToken`
- No connector abstraction, normalization layer, or plugin sandbox

Phase 1.5E established that executives consume `CompanyContext` only — external data must normalize before reaching executives.

---

## Decision

1. **Seven-layer architecture** — External Services → Connector Framework → Integration Layer → Normalization Layer → Plugin Runtime → Core Platform → Executive Runtime.

2. **Connector Framework** (`packages/connectors/*`) — Provider adapters implement `ConnectorPort`. Core platform imports ports only (AIP-14).

3. **Integration Layer** — Auth, sync (BullMQ), webhooks, polling, rate limiting, retry, health, event translation. No business logic.

4. **Normalization Layer** — Provider objects map to platform entities (`task`, `meeting`, `bill`, etc.) before persistence (AIP-15).

5. **Plugin Runtime** — Full lifecycle (install → active → sync → uninstall), configuration, permissions, health, commands, events.

6. **Plugin SDK** (`@grayscale/plugin-sdk`) — Manifest v2 with auth, permissions, commands, settings schema, localization.

7. **Plugin Sandbox** — Deny-all default; explicit API/event/storage/network grants (AIP-19).

8. **Credential encryption** — AES-256-GCM at rest; tokens never returned in API responses (AIP-17).

9. **GitHub reference plugin** — Extract from MemoryService as acceptance gate (AIP-20).

10. **Marketplace foundation** — Schema and interfaces only; no UI in 1.5F.

11. **Integration Health Engine (AIP-23)** — Standardized health states per connector.

12. **Integration Cost Monitor (AIP-24)** — Track API usage, rate limits, estimated cost.

13. **Connector Simulator (AIP-25)** — Deterministic webhook replay for testing.

14. **ConnectorBase (AIP-14)** — Shared OAuth, retries, health, logging in `@grayscale/connector-core`.

---

## Consequences

### Positive
- Providers are replaceable without core changes
- Executives remain isolated from external APIs
- Normalized entities flow consistently through memory, graph, and events
- Third-party plugin ecosystem becomes possible post-Foundation

### Negative
- Migration effort for existing GitHub integration
- Additional tables and services before visible Mission Control UI (1.5G)
- Same-process sandbox limits untrusted third-party plugins (documented upgrade path)

---

## References

- [Integration & Plugin Platform Design Review](./INTEGRATION_PLUGIN_PLATFORM_DESIGN_REVIEW.md)
- [Connector Specification](../platform/CONNECTOR_SPECIFICATION.md)
- [Plugin SDK Specification](../platform/PLUGIN_SDK_SPECIFICATION.md)
