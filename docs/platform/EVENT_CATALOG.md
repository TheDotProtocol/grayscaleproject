# Event Catalog

**Package:** `@grayscale/platform`  
**Source:** `packages/platform/src/events/catalog.ts`  
**Phase:** 1.5A

Every domain event in Project Grayscale is registered in `EVENT_CATALOG` with a schema version, category, and description. Unknown types default to version `1`.

---

## Philosophy

> What is it? What happened to it? How is it connected?

The Event Store captures **what happened**. Events are immutable once appended. Projectors derive read models (Pulse, Timeline, Memory Index, Knowledge Graph).

---

## Categories

| Category | Events |
|----------|--------|
| `project` | `project.created`, `project.updated` |
| `task` | `task.created`, `task.completed` |
| `memory` | `memory.created`, `memory.updated`, `memory.deleted`, `idea.captured`, `journal.entry.created` |
| `billing` | `bill.due`, `bill.paid`, `billing.bill.due_soon`, `billing.bill.overdue` |
| `meeting` | `meeting.scheduled` |
| `git` | `git.commit.received` |
| `recommendation` | `recommendation.generated`, `agent.recommendation.created` |
| `architecture` | `architecture.decision.recorded` |
| `notification` | `notification.sent`, `notification.created`, `briefing.ready` |
| `integration` | `integration.connected`, `integration.sync.completed`, `integration.sync.failed` |
| `plugin` | `plugin.installed`, `plugin.uninstalled` |
| `timeline` | `timeline.updated`, `timeline.event.created` |
| `pulse` | `pulse.updated` |
| `documentation` | `documentation.generated` |
| `sprint` | `sprint.completed` |
| `knowledge` | `knowledge.node.created`, `knowledge.edge.created`, `knowledge.relationship.created` |
| `agent` | `agent.run.started`, `agent.run.completed`, `agent.approval.required`, `agent.approval.resolved` |

---

## Envelope Schema

```typescript
interface PlatformEvent<T = unknown> {
  id: string;                    // UUID — same as domain_events.id
  type: string;                  // catalog key, e.g. "memory.created"
  version: number;               // schema version from catalog
  companyId: string;
  userId?: string;
  payload: T;
  metadata: {
    correlationId: string;       // ties related events across services
    causationId?: string;        // id of event that caused this one
    traceId?: string;            // distributed trace
    timestamp: string;           // ISO-8601
    source: string;              // e.g. "api", "billing-service"
  };
}
```

---

## Publishing

```typescript
import { createPlatformEvent } from "@grayscale/platform";

const event = createPlatformEvent(
  "memory.created",
  companyId,
  { title: "Q3 strategy" },
  { source: "memory-service", correlationId: "req-abc" },
);

// Backend: EventsService.publish() persists then enqueues
await eventsService.publish("memory.created", companyId, payload, { source: "memory-service" });
```

---

## Replay

Projectors can be replayed from `domain_events` ordered by `sequence`:

```typescript
await eventsService.replay({
  companyId,
  fromSequence: BigInt(1),
  types: ["memory.created"],
});
```

---

## Versioning Policy

1. **Additive changes** (new optional payload fields) — same version.
2. **Breaking changes** — increment catalog version; projectors handle both during migration window.
3. **New event types** — add to catalog before first publish.

---

## Legacy Aliases

`DOMAIN_EVENTS` in `@grayscale/shared` maps constant names to catalog keys for backward compatibility:

| Constant | Catalog Key |
|----------|-------------|
| `MEMORY_CREATED` | `memory.created` |
| `BILL_DUE_SOON` | `billing.bill.due_soon` |
| … | See `packages/platform/src/events/catalog.ts` |
