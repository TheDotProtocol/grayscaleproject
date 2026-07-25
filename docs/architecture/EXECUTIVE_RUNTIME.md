# Executive Runtime Architecture

Phase 1.5E — infrastructure for hosting future executives as OS processes.

## Design Principles

| Principle | Implementation |
|-----------|----------------|
| No direct service access | Executives receive `CompanyContext` only |
| No executive-to-executive calls | `ExecutiveBus` with correlation/trace IDs |
| No LLM in runtime | `EXECUTIVES_ENABLED=false` default |
| No personalities | `ExecutiveIdentity` is metadata only |
| Full explainability | `ExecutiveExplainability` schema on every output |

---

## Component Overview

```mermaid
flowchart TB
  subgraph Context["Company Context Engine"]
    CC[CompanyContextAssembler]
    SIF[Strategy Engine]
    MEM[Memory Engine]
    GRP[Knowledge Graph]
    PLS[Pulse Engine]
    EVT[Event Store]
  end

  subgraph Runtime["Executive Runtime"]
    RT[ExecutiveRuntimeService]
    CAP[Capability Registry]
    PERM[Permission Service]
    BUS[Executive Bus]
    INB[Executive Inbox]
    LC[Lifecycle Manager]
    AUD[Audit Log]
  end

  subgraph Future["Sprint 2+ (not in 1.5E)"]
    EB[ExecutiveBase subclasses]
    LLM[LLM Providers]
  end

  CC --> SIF & MEM & GRP & PLS & EVT
  RT --> CC
  RT --> CAP & PERM & BUS & INB & LC & AUD
  EB -.-> RT
  EB -.-> LLM
```

---

## Company Context Engine

`CompanyContext` aggregates:

- Company profile, founder profile, operating mode
- Goals, objectives, projects, tasks
- Timeline, memory, knowledge graph, strategy context
- Recommendations, decisions, risks, opportunities
- Bills, cash position
- Pulse, mission status, plugin status
- Infrastructure, security, integrations
- Recent domain events

**Rule:** Executives must never query individual services.

---

## Executive Lifecycle

```mermaid
stateDiagram-v2
  [*] --> created
  created --> initializing
  initializing --> idle
  initializing --> failed
  idle --> waiting
  idle --> thinking
  idle --> executing
  thinking --> needs_approval
  thinking --> executing
  thinking --> blocked
  needs_approval --> executing
  needs_approval --> idle
  executing --> monitoring
  executing --> completed
  executing --> failed
  monitoring --> completed
  monitoring --> idle
  completed --> idle
  failed --> idle
  idle --> paused
  paused --> idle
  idle --> archived
  archived --> [*]
```

---

## Executive Communication Bus

```mermaid
sequenceDiagram
  participant A as Executive A
  participant Bus as Executive Bus
  participant B as Executive B
  participant Audit as Audit Log
  participant Events as Event Store

  A->>Bus: send(request)
  Bus->>Audit: log bus.send.request
  Bus->>Events: executive.message.sent
  Bus->>B: deliver (via inbox)
  B->>Bus: respond(payload)
  Bus->>A: deliver response
  Bus->>Audit: log delivery
```

Message types: `request`, `response`, `notification`, `escalation`, `delegation`, `broadcast`.

Features: correlation IDs, trace IDs, timeout, retry, audit trails.

---

## Context Injection Sequence

```mermaid
sequenceDiagram
  participant MC as Mission Control
  participant RT as Executive Runtime
  participant CC as Company Context Engine
  participant SIF as Strategy Engine

  MC->>RT: POST /instances/:id/context
  RT->>CC: assemble(companyId)
  CC->>SIF: buildContext()
  CC-->>RT: CompanyContext
  RT->>RT: update lastContextAt
  RT-->>MC: CompanyContext
```

---

## Capability & Permission Model

**Capabilities** declare what an executive can do:
- `ReadMemory`, `ReadGraph`, `ReadStrategy`, `CreateRecommendation`, etc.

**Permissions** declare authorization independently:
- `read`, `write`, `approve`, `reject`, `execute`, `escalate`, `notify`, `delegate`

Execution requests check permissions before queuing to inbox.

---

## Explainability Schema

Every `ExecutiveOutput` includes:

| Field | Purpose |
|-------|---------|
| `reason` | Why this output exists |
| `evidence` | Memory, event, graph references |
| `confidence` + `confidenceSources` | Explainable confidence |
| `risk` | Risk level and summary |
| `dependencies` | Blocking dependencies |
| `alternatives` | Options considered |
| `policyUsed` / `constraintsUsed` | Governance applied |
| `decisionPath` | Step-by-step reasoning chain |

---

## Execution Policy

```
EXECUTIVES_ENABLED=false  (default)
```

- Runtime infrastructure is fully active
- Context assembly, inbox, bus, lifecycle all work
- `AgentsService.runAgent()` returns 503
- Sprint 2 enables execution after runtime validation

---

## Database Tables

| Table | Purpose |
|-------|---------|
| `executive_instances` | Runtime state per company/executive slot |
| `executive_messages` | Bus messages |
| `executive_inbox_items` | Queue items |
| `executive_audit_logs` | Audit trail |
| `executive_outputs` | Structured outputs with explainability |

---

## Platform Package

Contracts live in `packages/platform/src/executive/`:

- `context.ts` — `CompanyContext`, `CompanyContextAssemblerPort`
- `runtime.ts` — `ExecutiveRuntimePort`, `ExecutiveInstance`
- `capabilities.ts` — capability registry
- `permissions.ts` — permission framework
- `bus.ts` — communication bus
- `inbox.ts` — inbox queues
- `lifecycle.ts` — state machine
- `explainability.ts` — output schema
- `ports.ts` — `ExecutiveBase` abstract class

---

## Future: Sprint 2

Concrete executives extend `ExecutiveBase`:

```typescript
class AthenaExecutive extends ExecutiveBase {
  readonly identity = EXECUTIVES.athena;
  readonly capabilities = ["ReadStrategy", "CreateRecommendation"];

  async onContext(ctx: CompanyContext): Promise<void> { /* Sprint 2 */ }
  async onEvent(event: PlatformEvent): Promise<void> { /* Sprint 2 */ }
  async health(): Promise<ExecutiveHealth> { /* Sprint 2 */ }
  async onLifecycleChange(from, to): Promise<void> { /* Sprint 2 */ }
}
```

No architectural changes required — only implementations.
