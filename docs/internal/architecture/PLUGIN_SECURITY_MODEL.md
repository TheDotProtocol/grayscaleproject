# Plugin Security Model

Phase 1.5F — security architecture for the Integration & Plugin Platform.

## Threat Model

| Threat | Mitigation |
|--------|------------|
| Plugin accesses unauthorized data | Sandbox deny-all + explicit grants |
| Credential leakage | AES-256-GCM encryption; never in API responses |
| Plugin calls external network freely | Network policy: `none` \| `provider_only` \| `allowlist` |
| Malicious webhook payload | Signature verification + rate limiting |
| Token theft from DB | Encrypted at rest; separate encryption key per environment |
| Plugin impersonates executive | Executives never call plugins directly; bus only |
| Supply chain attack | Manifest signing (marketplace); first-party only in 1.5F |

## Credential Security (AIP-17)

```
IntegrationCredential
  encryptedSecret: AES-256-GCM(credential, ENCRYPTION_KEY, iv)
  refreshToken:    AES-256-GCM(refresh, ENCRYPTION_KEY, iv)
```

- `ENCRYPTION_KEY` from environment — never in code
- Migration script encrypts existing plaintext `Integration.accessToken`
- API responses return `{ connected: true, expiresAt }` — never raw tokens
- Audit log on connect, disconnect, refresh, sync

## Permission Model

```typescript
interface PluginPermission {
  action: "read" | "write" | "publish" | "sync" | "admin";
  resource: string;    // "memory", "graph", "events", "integrations"
  scope?: string;      // company-scoped always; optional sub-scope
}
```

Permissions declared in manifest → granted at install → enforced by sandbox.

## Audit Requirements

All security-relevant actions logged to `executive_audit_logs` pattern:

- `plugin.installed`, `plugin.uninstalled`
- `integration.connected`, `integration.disconnected`
- `credential.refreshed`
- `sandbox.violation`
- `sync.started`, `sync.completed`, `sync.failed`

## Network Policy

| Policy | Behavior |
|--------|----------|
| `none` | Plugin cannot make HTTP calls (normalization-only plugins) |
| `provider_only` | HTTP allowed only to connector's provider domain |
| `allowlist` | Explicit domain list in sandbox policy |

Connectors (Integration Layer) make external calls — plugins invoke connectors via Integration APIs, not direct HTTP.

## Upgrade Path

1. **1.5F:** Same-process sandbox with API gate
2. **Post-Foundation:** Worker thread isolation
3. **Future:** WASM / container sandbox for untrusted marketplace plugins

## Compliance Notes

- GDPR: credential deletion on uninstall + company delete cascade
- SOC2-ready: audit trail, encryption at rest, access logging

See [PLUGIN_SANDBOX_MODEL.md](./PLUGIN_SANDBOX_MODEL.md).
