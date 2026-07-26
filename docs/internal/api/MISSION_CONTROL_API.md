# Mission Control API

Phase 1.5G — live operational command center endpoints.

**Design specification.** Implementation follows approval of [Mission Control Design Review](../architecture/MISSION_CONTROL_DESIGN_REVIEW.md).

---

## Company-Scoped Endpoints

Base path: `/companies/:companyId/mission-control`

All endpoints require JWT authentication and company membership.

### Dashboard

| Method | Path | Description |
|--------|------|-------------|
| GET | `/dashboard` | Full widget data bundle (parallel fetch of all enabled widgets) |
| GET | `/health` | Unified platform health score + per-service breakdown |
| GET | `/readiness` | Company readiness snapshot (10 dimensions) |
| GET | `/brief` | Founder daily brief (deterministic assembly) |
| GET | `/brief?date=YYYY-MM-DD` | Brief for specific date |

#### `GET /dashboard` response

```json
{
  "companyId": "co-1",
  "platformHealth": {
    "score": 78,
    "status": "healthy",
    "services": []
  },
  "readiness": {
    "overallScore": 62,
    "dataCompleteness": 0.7,
    "dimensions": []
  },
  "widgets": [
    {
      "id": "pulse-feed",
      "data": {},
      "status": "ok",
      "fetchedAt": "2026-07-25T15:00:00Z"
    }
  ],
  "layout": {
    "widgets": []
  },
  "assembledAt": "2026-07-25T15:00:00Z"
}
```

Widget entries include `status`: `ok` | `loading` | `error` | `empty`.

---

### Widgets

| Method | Path | Description |
|--------|------|-------------|
| GET | `/widgets` | Widget catalog with default + user layout |
| PUT | `/widgets/layout` | Save user widget configuration |
| GET | `/widgets/:widgetId/data` | Fetch single widget data (lazy load) |

#### `PUT /widgets/layout` body

```json
{
  "widgets": [
    {
      "id": "pulse-feed",
      "visible": true,
      "order": 0,
      "collapsed": false,
      "config": {}
    }
  ]
}
```

---

### Actions

| Method | Path | Description |
|--------|------|-------------|
| GET | `/actions` | List available actions for current user |
| POST | `/actions` | Dispatch a platform action |

#### `POST /actions` body

```json
{
  "actionId": "recommendation.approve",
  "payload": {
    "recommendationId": "rec-123",
    "actorId": "user-1"
  }
}
```

#### Response

```json
{
  "success": true,
  "actionId": "recommendation.approve",
  "result": {},
  "async": false
}
```

Async actions return `{ "jobId": "..." }` in result.

---

### Action Catalog (1.5G)

| Action ID | Permission | Async |
|-----------|------------|-------|
| `recommendation.approve` | `intelligence.recommendations.write` | no |
| `recommendation.reject` | `intelligence.recommendations.write` | no |
| `goal.create` | `intelligence.goals.write` | no |
| `task.create` | `timeline.write` | no |
| `meeting.schedule` | `timeline.write` | no |
| `notification.send` | `notifications.write` | no |
| `plugin.install` | `platform.plugins.write` | no |
| `integration.retry-sync` | `platform.integrations.sync` | yes |

---

## Platform-Level Endpoints

Base path: `/platform`

Not company-scoped. Requires authentication.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/registry` | All registered platform services |
| GET | `/capabilities` | Full capability catalog |
| GET | `/capabilities?category=intelligence` | Filter by category |
| GET | `/health` | Global platform health (service probes, no company context) |

#### `GET /registry` response

```json
{
  "services": [
    {
      "id": "memory-engine",
      "name": "Memory Engine",
      "version": "1.0.0",
      "status": "active",
      "capabilities": ["memory.search", "memory.recent"],
      "dependencies": ["event-store"],
      "routes": [
        { "method": "GET", "path": "/companies/:companyId/memory/search" }
      ],
      "documentation": "docs/platform/MEMORY_ENGINE.md"
    }
  ],
  "registeredAt": "2026-07-25T15:00:00Z"
}
```

---

## Upstream APIs Consumed (Not Duplicated)

Mission Control aggregates from existing modules:

| Domain | Endpoints |
|--------|-----------|
| Pulse | `/pulse/health`, `/pulse/recent`, `/pulse/stream` |
| Memory | `/memory/search`, `/memory/recent` |
| Graph | `/graph/summary`, `/graph/health` |
| Intelligence | `/intelligence/summary`, `/intelligence/recommendations`, `/intelligence/goals`, `/intelligence/priorities` |
| Integration | `/platform/integrations/health`, `/platform/integrations/cost`, `/platform/plugins/health` |
| Executive | `/executive-runtime/status`, `/executive-runtime/context` |
| Billing | `/billing/bills` |
| Timeline | `/timeline/events` |
| Notifications | `/notifications` |
| Events | Event store recent query |

---

## Founder Daily Brief Schema (v1)

Returned by `GET /mission-control/brief`:

```json
{
  "companyId": "co-1",
  "briefingDate": "2026-07-25",
  "sections": {
    "todaysPriorities": [],
    "blockedWork": [],
    "upcomingBills": [],
    "upcomingMeetings": [],
    "engineeringStatus": {},
    "platformHealth": {},
    "cashPosition": {},
    "topRecommendations": [],
    "recentEvents": [],
    "riskChanges": []
  },
  "assembledAt": "2026-07-25T06:00:00Z",
  "version": 1
}
```

No LLM narrative in 1.5G. Sections contain structured data only.

---

## Error Handling

| Code | Meaning |
|------|---------|
| 200 | Success (widget may have `status: "empty"`) |
| 401 | Unauthenticated |
| 403 | Missing permission for action/widget |
| 404 | Unknown widget or action |
| 503 | Owning service unavailable (health probe failed) |

Widgets fail independently — dashboard returns partial data with per-widget error states.

---

## See Also

- [ADR-012](../architecture/ADR-012-mission-control-live.md)
- [Platform Integration API](./PLATFORM_INTEGRATION_API.md)
- [Intelligence API](./INTELLIGENCE_API.md)
- [Graph API](../platform/GRAPH_API.md)
