# Executive Collaboration Architecture

**Technical companion to `EXECUTIVE_COLLABORATION.md`**

**Version:** 1.0.0  
**Council Runtime:** `COUNCIL_RUNTIME_VERSION = 2.0.0`

---

## Stack

```
Organizational Runtime (council scheduling)
  → Executive Council Runtime v2
    → Council Scheduler (7 modes, runtime-owned)
    → Deliberation Engine (12 stages, no skipping)
    → Collaboration Network (all executive communication)
    → Council Memory (immutable, searchable)
  → CompanyContext (read-only snapshots)
  → Mission Control (15 widget contracts)
```

---

## Platform Contracts

| Module | Path |
|--------|------|
| Council Scheduling | `council/council-scheduling.ts` |
| Deliberation Engine | `council/executive-deliberation-engine.ts` |
| Collaboration Network | `council/collaboration-network.ts` |
| Council Memory | `council/council-memory.ts` |
| Collaboration Certification | `council/collaboration-certification.ts` |
| MC Widgets | `mission-control/collaboration-widgets.ts` |

---

## Backend Services

| Service | Responsibility |
|---------|----------------|
| `CouncilSchedulerService` | 7 council modes; delegates to Runtime Scheduler |
| `CouncilDeliberationEngineService` | 12-stage deterministic pipeline |
| `ExecutiveCollaborationNetworkService` | All inter-executive requests |
| `CouncilMemoryService` | Immutable minutes, evidence, replay |
| `ExecutiveCollaborationCertificationService` | 12 ECS gates |

---

## API (`/companies/:companyId/council/`)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `scheduler` | Council scheduler status |
| POST | `scheduler/sessions` | Runtime-scheduled council session |
| GET | `deliberations` | Active deliberations |
| POST | `deliberations` | Start deliberation proposal |
| POST | `deliberations/:id/advance` | Advance stage (no skipping) |
| GET | `memory/search?q=` | Search council memory |
| GET | `memory/:sessionId` | Session memory entries |
| POST | `collaboration/requests` | Send network request |
| GET | `collaboration/requests` | List requests |
| GET | `collaboration/certify` | Collaboration certification |

---

## Events

- `council.scheduled`
- `council.deliberation.started` / `stage.advanced` / `completed`
- `collaboration.request.sent` / `responded`
- `council.memory.appended`
- `collaboration.certified`

---

## Boundaries

| Layer | Owns |
|-------|------|
| Runtime | Council scheduling |
| Council Runtime | Deliberation orchestration, memory, network routing |
| Executives | Structured contributions only |
| Mission Control | Visualization |

No business logic in runtime. No duplicate storage. No Prisma from executives.
