# Activity Center

**RC1 Track B — Unified Auditable Feed**

---

## Endpoint

```
GET /companies/:companyId/mission-control/activity?limit=50
```

## Response Shape

Each entry includes:

- **actor** — who performed the action
- **actorType** — founder | executive | council | system
- **action** — domain event type
- **target** — what changed
- **reason** — why (when available)
- **evidence** — supporting evidence references
- **confidence** — confidence score when applicable
- **occurredAt** — timestamp
- **auditable** — always true

## Data Source

Activity Center reads from `domain_events` — the canonical event store. No duplicated storage.

## UI

`/dashboard/activity` — chronological feed with actor coloring and confidence display.

## Relationship to Timeline

- **Timeline** — product-facing chronological history (merged sources)
- **Activity Center** — audit-focused who/when/why feed

Both consume existing APIs and remain constitutionally compliant.
