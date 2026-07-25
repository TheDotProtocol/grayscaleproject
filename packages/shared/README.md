# @grayscale/shared

Cross-platform types, events, pulse heartbeats, plugin hooks, and Zod schemas.

## Exports

| Module | Purpose |
|--------|---------|
| `events` | Domain event types + `createDomainEvent()` |
| `pulse` | Pulse heartbeat types + `domainEventToPulse()` |
| `plugins` | Plugin hooks + manifest interfaces |
| `executives` | Eight executive definitions |
| `schemas` | Zod validation (consolidate with backend in Sprint 2) |

## Usage

```typescript
import { DOMAIN_EVENTS, PULSE_EVENTS, PLUGIN_HOOKS, domainEventToPulse } from "@grayscale/shared";
```

Built before `@grayscale/agents` and consumed by backend + web.
