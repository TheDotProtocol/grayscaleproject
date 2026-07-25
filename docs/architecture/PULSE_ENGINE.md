# The Pulse Engine

**Invisible service.** Founders never see "Pulse Engine" in the UI — they see Mission Control's operational picture.

---

## Purpose

Everything in Grayscale emits **heartbeat events**. The Pulse Engine:

1. Receives domain events from the BullMQ event bus
2. Maps them to founder-facing pulse types
3. Persists heartbeats to `pulse_events`
4. Dispatches to registered **plugins**
5. Exposes health + stream APIs for **Mission Control**

**Why:** Instead of polling dozens of modules, the system becomes alive through events. Every new capability plugs into the same stream without rewriting the core.

---

## Pulse Types

| Pulse | Domain Event(s) | Category |
|-------|-----------------|----------|
| `project.updated` | memory.created, memory.updated, journal.entry.created | project |
| `bill.due` | billing.bill.due_soon, billing.bill.overdue | billing |
| `sprint.completed` | sprint.completed | sprint |
| `repository.changed` | integration.sync.completed | repository |
| `meeting.added` | timeline.event.created (eventType=meeting) | meeting |
| `integration.failed` | integration.sync.failed | integration |
| `ai.recommendation.created` | agent.recommendation.created | ai |

---

## Architecture

```
Module action
    → EventsService.publish(domain event)
    → BullMQ queue
    → EventsProcessor
        → PluginsService.dispatch(ON_DOMAIN_EVENT)
        → PulseEngine.ingestFromDomainEvent()
            → domainEventToPulse() [@grayscale/shared]
            → persist pulse_events
            → PluginsService.dispatch(ON_PULSE)
            → SSE stream (in-process Subject)
    → Mission Control polls /pulse/health + /pulse/recent
```

---

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/companies/:id/pulse/recent` | Last 50 heartbeats |
| GET | `/api/companies/:id/pulse/health` | 24h aggregation + health score |
| SSE | `/api/companies/:id/pulse/stream` | Live pulse stream |
| POST | `/api/companies/:id/pulse/sprint-completed` | Emit sprint.completed |

---

## Health Score

```
score = 100 - (critical × 15) - (warning × 5)
status = critical if any critical pulses in 24h
         attention if >2 warnings
         healthy otherwise
```

---

## Adding a New Pulse

1. Add domain event to `@grayscale/shared` events
2. Map in `packages/shared/src/pulse/index.ts` → `domainEventToPulse()`
3. Publish from module via `EventsService.publish()`
4. No Mission Control changes required — it reads all pulses generically

---

**Related:** [ADR-005](./ADR-005-pulse-engine-and-plugins.md) · [Plugin Architecture](../plugins/README.md)
