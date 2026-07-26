# Sprint 4 Phase A Changelog

**Tag:** `Sprint-4-Phase-A-OrganizationalRuntime-v1.0`  
**Date:** 2026-07-26

## Added

### Platform (`packages/platform/src/runtime/`)
- `organizational-runtime.ts` — core types, snapshot, lifecycle, heartbeat, health, resources
- `runtime-ports.ts` — 16 interface-first ports (Coordinator, Scheduler, Heartbeat, Health, etc.)
- `runtime-explainability.ts` — `RuntimeExplainability` contract and port
- `runtime-certification.ts` — `RUNTIME_ECS_GATES` (11 gates), scoring utilities
- `runtime-widgets.ts` — 19 Mission Control widget definitions
- Events: `runtime.heartbeat.completed`, `runtime.orchestration.started/completed`, `runtime.certified`

### Backend (`backend/src/modules/runtime/`)
- `OrganizationalRuntimeModule` — NestJS module
- `RuntimeCoordinatorService` — orchestrates 13 sub-runtimes
- `RuntimeHeartbeatService` — 10-step deterministic heartbeat
- `RuntimeSchedulerService` — 7 schedule modes + task queue
- `RuntimeExplainabilityService` — heartbeat and action explanations
- `RuntimeResourceManagerService` — measurement only (no optimization)
- `RuntimeCertificationService` — deterministic 11-gate certification
- `RuntimeContextService` — CompanyContext assembly
- `RuntimeController` — REST API under `/runtime/:companyId/*`
- `runtime.spec.ts` — 3 unit tests

### CompanyContext
- Context version `2.0.0-s4a-org-runtime`
- Assembler ID `organizational-runtime`
- Fields: `organizationalRuntime`, `runtimeHealth`, `runtimeMetrics`

### Documentation
- `ORGANIZATIONAL_RUNTIME.md` (constitutional)
- `RUNTIME_ARCHITECTURE.md`, `RUNTIME_LIFECYCLE.md`, `RUNTIME_HEARTBEAT.md`
- `RUNTIME_SCHEDULER.md`, `RUNTIME_EXPLAINABILITY.md`, `RUNTIME_CERTIFICATION.md`
- ADR-070 through ADR-074
- `SPRINT4_PHASE_A_CERTIFICATE.md`

## Changed

- `FOUNDER_CONSTITUTION.md` — hierarchy includes ORGANIZATIONAL_RUNTIME.md
- `company-context-assembler.service.ts` — runtime snapshot assembly
- `widget-catalog.service.ts` — 19 runtime MC widgets registered
- `context-runtime.module.ts` — forwardRef to OrganizationalRuntimeModule
- `app.module.ts` — OrganizationalRuntimeModule import; fixed organizational-evolution path

## Unchanged

- Bedrock architecture (frozen)
- `EXECUTIVES_ENABLED=false`
- No Prisma in executive layer
- No new intelligence engines
- Organizational Evolution module (separate Sprint 4 track)

## Phase A Limitations (Documented)

- Heartbeat steps 2–10 are orchestration markers; only context refresh executes
- Resource management is measurement-only (no optimization)
- Wake/sleep cycles are contract-defined; automated scheduling deferred
- Widget UI implementation deferred; backend contracts complete
- Runtime store is in-memory (Phase A reference implementation)
