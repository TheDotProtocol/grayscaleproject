# Runtime Architecture

**Organizational Runtime — Technical Architecture**

**Version:** 1.0.0  
**Status:** Technical companion to `ORGANIZATIONAL_RUNTIME.md`  
**Platform Version:** `ORGANIZATIONAL_RUNTIME_VERSION = 1.0.0`

---

## Overview

The Organizational Runtime is implemented as an **interface-first** layer:

```
@grayscale/platform/src/runtime/     ← contracts (ports, types, widgets)
backend/src/modules/runtime/         ← reference orchestration implementation
```

No business logic lives in either layer. Orchestration delegates to existing Bedrock modules.

---

## Platform Contracts

| Port | Responsibility |
|------|----------------|
| `OrganizationalRuntimePort` | Snapshot, lifecycle, orchestration entry |
| `RuntimeCoordinatorPort` | Alias of OrganizationalRuntimePort |
| `RuntimeSchedulerPort` | Task queue, schedule modes, execution |
| `RuntimeHeartbeatPort` | Heartbeat configuration and tick |
| `RuntimeLifecyclePort` | Lifecycle stage transitions |
| `RuntimeHealthPort` | Composite health scoring |
| `RuntimeResourceManagerPort` | Resource measurement |
| `RuntimeExplainabilityPort` | Action and heartbeat explanations |
| `RuntimeMetricsPort` | Period metrics aggregation |
| `RuntimeAuditPort` | Append-only audit trail |
| `RuntimeGovernancePort` | Policy enforcement markers |
| `RuntimeEventCoordinatorPort` | Event-driven orchestration triggers |
| `RuntimeTaskQueuePort` | Queue depth and task lifecycle |
| `RuntimeCapacityPort` | Capacity trend measurement |
| `RuntimeStatePort` | Per-sub-runtime state |
| `RuntimeVersionPort` | Version integrity |

All ports are defined in `packages/platform/src/runtime/`. **No implementations** exist in platform contracts.

---

## Backend Module Structure

```
backend/src/modules/runtime/
├── runtime.module.ts                  OrganizationalRuntimeModule
├── runtime-store.service.ts           In-memory state (Phase A)
├── runtime-coordinator.service.ts     Orchestration coordinator
├── runtime-heartbeat.service.ts       Deterministic heartbeat
├── runtime-scheduler.service.ts       7 schedule modes + task queue
├── runtime-explainability.service.ts  Explanation records
├── runtime-resource-manager.service.ts Measurement only
├── runtime-certification.service.ts   11 ECS gates
├── runtime-context.service.ts         CompanyContext assembly
└── runtime.controller.ts              REST API /runtime/:companyId/*
```

---

## Coordinated Sub-Runtimes

The coordinator orchestrates (does not reason for):

| Runtime ID | Module |
|------------|--------|
| `context` | ContextRuntimeModule |
| `executive` | ExecutiveModule |
| `council` | CouncilRuntimeModule |
| `twin` | TwinRuntimeModule |
| `simulation` | Simulation modules |
| `forecast` | Forecast modules |
| `memory` | MemoryModule |
| `graph` | GraphModule |
| `strategy` | Strategy (Bedrock) |
| `signals` | Intelligence / ONS |
| `insights` | Intelligence |
| `mission-control` | MissionControlModule |
| `platform-operations` | PlatformOperationsModule |

---

## REST API

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/runtime/:companyId/snapshot` | Full runtime snapshot |
| POST | `/runtime/:companyId/heartbeat` | Trigger heartbeat cycle |
| GET | `/runtime/:companyId/health` | Runtime health |
| GET | `/runtime/:companyId/metrics` | Period metrics |
| GET | `/runtime/:companyId/scheduler` | Task list |
| POST | `/runtime/:companyId/heartbeat/configure` | Configure interval |
| GET | `/runtime/:companyId/certification` | ECS certification report |
| GET | `/runtime/:companyId/explain/:actionId` | Explainability record |

---

## CompanyContext Integration

Context version: **`2.0.0-s4a-org-runtime`**

Assembler ID: `organizational-runtime`

Fields exposed on CompanyContext:

- `organizationalRuntime` — snapshot
- `runtimeHealth` — health score and issues
- `runtimeMetrics` — period aggregation

---

## Mission Control Widgets

19 widget contracts registered via `RUNTIME_WIDGET_DEFINITIONS` in `@grayscale/platform`. UI implementation deferred; backend contracts complete.

---

## Events

| Event | When |
|-------|------|
| `runtime.heartbeat.completed` | After each heartbeat cycle |
| `runtime.orchestration.started` | Orchestration begins |
| `runtime.orchestration.completed` | Orchestration ends |
| `runtime.certified` | Certification passes |

---

## Non-Negotiables

- No Bedrock rewrites
- No duplicate storage
- No Prisma from executives
- No business logic in runtime
- Everything event-driven, versioned, explainable, auditable
