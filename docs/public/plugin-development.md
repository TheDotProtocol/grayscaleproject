# Plugin Development

Build plugins that extend Grayscale through the Plugin SDK.

---

## Overview

Plugins integrate external systems into Grayscale via approved **connector ports**. Plugins run in a **sandbox** until certified. All automated actions pass through **Policy Engine** evaluation.

**Package:** `@grayscale/plugin-sdk`

---

## Plugin Anatomy

```typescript
interface PluginManifestV2 {
  id: string;                    // reverse-domain: "com.example.crm"
  name: string;
  version: string;               // semver
  minPlatformVersion: string;
  category: PluginCategory;
  auth: PluginAuthConfig;
  capabilities: string[];
  permissions: PluginPermission[];
  hooks: PluginHook[];
  events: PluginEventDeclaration[];
  subscriptions: PlatformEventType[];
  commands: PluginCommand[];
}
```

---

## Development Flow

1. **Scaffold** — Create plugin package using `@grayscale/plugin-sdk`
2. **Register** — Declare manifest and connector binding
3. **Sandbox** — Test against company-scoped sandbox gates
4. **Sync** — Publish events through persist-then-publish pipeline
5. **Certify** — Pass integration health and security review
6. **Deploy** — Enable for production company scope

---

## Rules

- Plugins **never** bypass Company Guard
- Plugins **never** write directly to Bedrock stores — use approved ports
- Credentials live in **Credential Vault** — not in source code
- Default deny for automated executive actions

---

## Example Use Cases

- GitHub commit sync → organizational memory
- CRM pipeline → strategic goals alignment
- Billing system → financial signals
- Industry data feed → twin correlation

---

## Related

- [SDK Guide](/docs/sdk)
- [Extension Development](/docs/extensions)
- [Authentication](/docs/authentication)
- [Security](/docs/security)
