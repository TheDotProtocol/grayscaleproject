# Plugin Architecture

Every new Grayscale capability **registers hooks** instead of coupling to core modules.

---

## Why Plugins

| Without plugins | With plugins |
|-----------------|--------------|
| Mission Control imports every module | Subscribes to Pulse Engine only |
| New integration rewrites sync logic | Registers `ON_INTEGRATION_SYNC` handler |
| Executive agent tightly coupled to memory | Registers `ON_AGENT_RECOMMENDATION` |
| Testing requires full app boot | Mock plugin registry in isolation |

---

## Hook Points (Sprint 1)

Defined in `@grayscale/shared` → `PLUGIN_HOOKS`:

```typescript
plugin.pulse.received          // After Pulse Engine persists heartbeat
plugin.domain_event.received   // Raw domain event from bus
plugin.memory.created          // Memory lifecycle
plugin.memory.updated
plugin.agent.recommendation      // Sprint 3: executive agents
plugin.integration.sync
plugin.mission_control.update
```

---

## Registering a Plugin (Backend)

```typescript
pluginsService.register({
  manifest: {
    id: "github.sync",
    name: "GitHub Sync",
    version: "1.0.0",
    hooks: [PLUGIN_HOOKS.ON_INTEGRATION_SYNC],
    source: "integrations",
  },
  handler: async (payload) => {
    // react to integration sync
  },
});
```

---

## Rules

1. **Plugins never import other plugins directly** — communicate via events
2. **Plugins must not block the event bus** — handlers should be fast; heavy work goes to BullMQ jobs
3. **Every plugin has a manifest** — id, version, hooks, source (for audit)
4. **Executive agents are plugins in Sprint 3** — not hardcoded in core

---

## Future: `packages/plugins/`

External plugins as npm packages:

```
packages/plugins/
  github/
  stripe/
  slack/
```

Each exports a `register(PluginsService)` function loaded at bootstrap.

---

**Related:** [Pulse Engine](../architecture/PULSE_ENGINE.md) · [ADR-005](../architecture/ADR-005-pulse-engine-and-plugins.md)
