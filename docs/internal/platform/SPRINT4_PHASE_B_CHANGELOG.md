# Sprint 4 Phase B Changelog

**Tag:** `Sprint-4-Phase-B-ExecutiveCollaboration-v1.0`  
**Date:** 2026-07-26

## Added

### Platform
- `council-scheduling.ts` — 7 council schedule modes, runtime-owned
- `executive-deliberation-engine.ts` — 12-stage pipeline, no skipping
- `collaboration-network.ts` — 11 collaboration request kinds
- `council-memory.ts` — immutable searchable council memory
- `collaboration-certification.ts` — 12 ECS gates
- `collaboration-widgets.ts` — 15 Mission Control widget contracts
- Events: council scheduling, deliberation, collaboration, memory

### Backend
- `CouncilSchedulerService` — delegates to Organizational Runtime Scheduler
- `CouncilDeliberationEngineService` — deterministic stage advancement
- `CouncilMemoryService` — minutes, evidence, search, replay
- `ExecutiveCollaborationNetworkService` — all inter-executive requests
- `ExecutiveCollaborationCertificationService` — 12-gate certification
- `collaboration.spec.ts` — 3 unit tests
- Council API: scheduler, deliberations, memory, collaboration endpoints

### CompanyContext
- Version `2.1.0-s4b-exec-collaboration`
- Fields: `activeDeliberations`, `collaborationNetwork`

### Documentation
- `EXECUTIVE_COLLABORATION.md` (constitutional)
- Architecture, deliberation, certification, council runtime v2 docs
- ADR-075 through ADR-079
- `SPRINT4_PHASE_B_CERTIFICATE.md`

## Changed

- `EXECUTIVE_NETWORK.md` — v2.0.0 with collaboration network
- `FOUNDER_CONSTITUTION.md` — hierarchy includes EXECUTIVE_COLLABORATION.md
- `CouncilContextAssemblerService` — async assembly with deliberation/network
- `CouncilSession` — optional `scheduleMode`
- `widget-catalog.service.ts` — 15 collaboration widgets

## Unchanged

- Bedrock architecture (frozen)
- `EXECUTIVES_ENABLED=false`
- No Prisma in executive layer
- No new intelligence engines
