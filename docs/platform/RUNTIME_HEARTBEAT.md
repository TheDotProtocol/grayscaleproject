# Runtime Heartbeat

**Organizational Runtime — Deterministic Heartbeat**

**Version:** 1.0.0  
**Status:** Technical companion to `ORGANIZATIONAL_RUNTIME.md`

---

## Purpose

The Organizational Heartbeat is the **deterministic pulse** that keeps the organization continuously operating. It orchestrates sub-runtime refresh in a fixed order — never performing organizational reasoning.

---

## Default Configuration

| Setting | Default |
|---------|---------|
| Interval | 300 seconds (5 minutes) |
| Enabled | true |
| Async | true (all steps non-blocking) |
| Auditable | true (every cycle recorded) |

Configure via `POST /runtime/:companyId/heartbeat/configure` with `{ intervalSeconds: number }`.

---

## Heartbeat Steps (Deterministic Order)

| # | Step | Runtime ID | Phase A Behavior |
|---|------|------------|------------------|
| 1 | Context refresh | `context` | **Executes** — cache invalidation + context assembly |
| 2 | Signal processing | `signals` | Orchestration marker |
| 3 | Memory synchronization | `memory` | Orchestration marker |
| 4 | Graph synchronization | `graph` | Orchestration marker |
| 5 | Twin synchronization | `twin` | Orchestration marker |
| 6 | Simulation refresh | `simulation` | Orchestration marker |
| 7 | Forecast refresh | `forecast` | Orchestration marker |
| 8 | Health monitoring | `platform-operations` | Orchestration marker |
| 9 | Attention refresh | `context` | Orchestration marker |
| 10 | Organizational snapshot | `context` | Orchestration marker |

Steps 2–10 are **orchestration markers** in Phase A. They record timing, success, and audit entries without re-implementing Bedrock engines. Future phases wire direct sub-runtime delegation.

---

## Cycle Output

Each heartbeat produces a `RuntimeHeartbeatCycle`:

```typescript
{
  cycleId: string;
  companyId: string;
  startedAt: string;
  completedAt: string;
  steps: RuntimeHeartbeatStep[];
  correlationId: string;
  traceId: string;
}
```

---

## Events & Audit

- Publishes `runtime.heartbeat.completed` with `{ cycleId, steps }`
- Appends audit entry: `heartbeat.completed`
- Records explainability via `RuntimeExplainabilityService.recordHeartbeat()`

---

## Stability Criteria

Heartbeat is **stable** when:

- Interval is configurable and persisted per company
- Step order is deterministic (never reordered at runtime)
- Each cycle completes with correlation/trace IDs
- Failures on individual steps do not abort the cycle (recorded as `success: false`)

Certification gate: `heartbeat_stable`.

---

## Trigger Sources

| Source | Mode |
|--------|------|
| API `POST /runtime/:companyId/heartbeat` | `manual` |
| Scheduled interval (future) | `scheduled` |
| Event trigger (future) | `event_driven` |

Executives **never** trigger heartbeat directly.
