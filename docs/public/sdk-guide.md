# SDK Guide

Use the Grayscale Plugin SDK to build connectors and extensions.

---

## Packages

| Package | Purpose |
|---------|---------|
| `@grayscale/plugin-sdk` | Plugin manifest, hooks, commands, events |
| `@grayscale/connector-core` | Connector port implementations |
| `@grayscale/shared` | Shared types and event schemas (read-only consumption) |

---

## Installation

```bash
pnpm add @grayscale/plugin-sdk
```

Requires `@grayscale/platform` ports at build time (provided by Grayscale runtime in production).

---

## Minimal Plugin

```typescript
import { definePlugin } from "@grayscale/plugin-sdk";

export default definePlugin({
  manifest: {
    id: "com.example.hello",
    name: "Hello Connector",
    version: "1.0.0",
    minPlatformVersion: "1.0.0-bedrock",
    category: "integration",
    auth: { type: "api_key", fields: ["API_KEY"] },
    capabilities: ["memory.sync"],
    permissions: [{ resource: "memory", action: "write" }],
    hooks: [],
    events: [],
    subscriptions: ["integration.sync.requested"],
    commands: [],
  },
  async onEvent(ctx, event) {
    // Handle platform events within sandbox constraints
  },
});
```

---

## Development Principles

- Depend on **platform ports** — not Bedrock internals
- Declare all **permissions** explicitly
- Publish **events** — do not write stores directly
- Test in **sandbox** before certification

---

## Version Compatibility

Plugins declare `minPlatformVersion`. Grayscale OS v1.0 (Bedrock) is the current baseline: `1.0.0-bedrock`.

---

## Related

- [Plugin Development](/docs/plugins)
- [Authentication](/docs/authentication)
- [API Reference](/docs/api)
