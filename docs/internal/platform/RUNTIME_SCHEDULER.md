# Runtime Scheduler

**Organizational Runtime — Scheduling Contracts**

**Version:** 1.0.0  
**Status:** Technical companion to `ORGANIZATIONAL_RUNTIME.md`

---

## Principle

**The runtime owns scheduling. Executives never schedule themselves.**

All orchestration tasks — heartbeat, sub-runtime refresh, background jobs, executive session coordination, council session coordination — flow through the Runtime Scheduler.

---

## Schedule Modes

| Mode | Description | Example |
|------|-------------|---------|
| `continuous` | Ongoing background processing | Queue drain loop |
| `scheduled` | Fixed interval execution | Heartbeat every 300s |
| `event_driven` | Triggered by catalog events | `runtime.heartbeat.completed` |
| `manual` | Operator-initiated | Mission Control action |
| `maintenance` | Non-critical deferred work | Index compaction markers |
| `deferred` | Delayed with explicit due time | Off-peak sync |
| `priority` | Precedence over standard queue | Critical health recovery |

All 7 modes are supported in Phase A via `RuntimeSchedulerService.supportedModes()`.

---

## Task Queue

Tasks carry:

- `taskId` — unique identifier (duplicate execution prevented)
- `companyId` — tenant scope
- `runtimeId` — target sub-runtime
- `mode` — schedule mode
- `priority` — numeric precedence
- `status` — pending / running / completed / failed
- `scheduledAt` / `executedAt` — timestamps
- `correlationId` — trace linkage

Queue depth and backlog are measured by `RuntimeResourceManagerService`.

---

## Executive & Council Scheduling

| Scheduler | Owner | Rule |
|-----------|-------|------|
| Executive Scheduler | Runtime | Schedules executive **sessions**, not executive reasoning |
| Council Scheduler | Runtime | Schedules council **sessions**, not council decisions |

Mission Control widgets: `executive-scheduler`, `council-scheduler`.

Executives request attention through inbox and context — they do not invoke scheduler APIs.

---

## Duplicate Execution Prevention

Executed task IDs are tracked in `RuntimeStoreService`. Certification gate: `no_duplicate_execution`.

---

## API

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/runtime/:companyId/scheduler` | List tasks for company |

Task enqueue APIs are internal to coordinator in Phase A.

---

## Certification

Gate: `schedulers_deterministic` — requires all 7 modes registered.
