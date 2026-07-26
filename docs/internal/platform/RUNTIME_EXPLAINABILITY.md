# Runtime Explainability

**Organizational Runtime — Explainability Contract**

**Version:** 1.0.0  
**Status:** Technical companion to `ORGANIZATIONAL_RUNTIME.md`

---

## Requirement

**Every runtime action must be completely explainable.** Runtime orchestration is never a black box.

---

## RuntimeExplainability Record

```typescript
interface RuntimeExplainability {
  actionId: string;
  action: string;
  why: string;
  triggerSource: RuntimeScheduleMode | "heartbeat" | "system";
  dependencies: RuntimeId[];
  affectedRuntimes: RuntimeId[];
  durationMs: number;
  priority: number;
  evidence: string[];
  version: string;
  correlationId: string;
  traceId: string;
  auditReference: string;
  recordedAt: string;
}
```

---

## Mandatory Fields

| Field | Purpose |
|-------|---------|
| **why** | Human-readable reason for execution |
| **triggerSource** | What initiated the action |
| **dependencies** | Sub-runtimes required before execution |
| **affectedRuntimes** | Sub-runtimes touched by execution |
| **durationMs** | Wall-clock execution time |
| **priority** | Scheduler priority at execution time |
| **evidence** | Structured proof points |
| **version** | `ORGANIZATIONAL_RUNTIME_VERSION` |
| **correlationId** | Cross-service trace linkage |
| **traceId** | Runtime-internal trace |
| **auditReference** | Link to append-only audit entry |

---

## Heartbeat Explainability

Each heartbeat cycle generates an explanation via `RuntimeExplainabilityService.recordHeartbeat()` containing:

- All 10 step durations and success flags
- Cycle correlation and trace IDs
- Trigger source (`heartbeat` or `manual`)

Retrieve via `GET /runtime/:companyId/explain/:actionId`.

---

## Mission Control

Widgets exposing explainability:

- `runtime-audit` — append-only audit trail
- `runtime-activity` — recent orchestration actions
- `runtime-timeline` — chronological orchestration history

---

## Certification

Gate: `orchestration_auditable` — audit trail is append-only and queryable.

---

## Non-Negotiable

No runtime action may execute without recording explainability metadata. Silent orchestration is forbidden.
