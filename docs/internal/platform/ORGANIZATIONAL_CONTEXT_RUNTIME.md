# Organizational Context Runtime

**Project Grayscale — Immutable CompanyContext Assembly**

**Version:** 1.0  
**Status:** Constitutional — Sprint 2 Phase A.4 (Final foundation layer before Athena)  
**Foundation:** Bedrock v1.0.0-bedrock (Certified, FROZEN)  
**Companion:** ADR-024, `ORGANIZATIONAL_INTELLIGENCE.md`, ADR-023–027

---

## Purpose

Every executive receives **ONE immutable CompanyContext**. Executives never assemble context themselves. They never access platform services directly.

The Context Runtime is the final foundation layer before Athena — it orchestrates all organizational intelligence, operational data, and platform state into a single read-only context object.

---

## Architecture

```
ContextRuntimeService
        ↓
ContextCacheService (60s TTL, invalidate on events)
        ↓
CompanyContextAssemblerService
        ↓
Parallel Assemblers
├── StrategicContext      (Strategy Engine)
├── MemoryContext         (Memory Engine)
├── GraphContext          (Knowledge Graph)
├── OperationalContext    (Events, projects, tasks)
├── FinancialContext      (Bills, cash position)
├── FounderContext        (Founder profile)
├── TimelineContext       (Timeline entries)
├── IntegrationContext    (Integrations)
├── PluginContext         (Plugins)
├── PulseContext          (Pulse health)
├── ReadinessContext      (Readiness scoring)
├── OrganizationalIntelligence (ADR-015–022)
├── IntentContext         (ADR-023)
├── TemporalContext       (ADR-025)
├── SignalsContext        (ADR-026)
├── InsightsContext       (ADR-027)
├── PlatformHealth        (Pulse + infrastructure)
├── PlatformReliability   (Reliability engine)
├── Security              (Security observatory)
└── Governance            (Governance entries)
        ↓
ImmutableCompanyContext
        ↓
Executive Runtime (read-only consumption)
```

---

## Module Location

`backend/src/modules/context-runtime/`

| Service | Role |
|---------|------|
| `ContextRuntimeService` | Cache + assembly orchestration |
| `ContextCacheService` | In-memory immutable context cache |
| `CompanyContextAssemblerService` | Parallel assembler execution |
| `OrganizationalIntelligenceAssemblerService` | Org intelligence layer |
| `IntentEngineService` | Intent hierarchy (stub Phase A.4) |
| `TemporalEngineService` | Historical evolution |
| `OrganizationalSignalBusService` | Signal emission/consumption |
| `OrganizationalInsightEngineService` | Observation generation |

---

## Context Contract

`CompanyContext` extended with (all optional, read-only):

- `organizationalIntelligence` — Phase A.2 engines
- `intent` — WHY chain (Phase A.4)
- `temporal` — historical evolution (Phase A.4)
- `signals` — what changed (Phase A.4)
- `insights` — explainable observations (Phase A.4)
- `contextRuntime` — assembly metadata, cache info, assembler trace

---

## Event Projectors

| Projector | Handles | Action |
|-----------|---------|--------|
| `IntentProjector` | `intent.*` | Invalidate context cache |
| `SnapshotProjector` | `temporal.snapshot.*`, `organizational-snapshot.*` | Invalidate cache |
| `SignalProjector` | `organizational-signal.*` | Invalidate cache |
| `InsightProjector` | `organizational-insight.*` | Invalidate cache |

Pipeline: Intent → Memory → Graph → Timeline → Snapshots → Signals → Insights → Context Runtime

---

## Constitutional Rules

1. Executives inherit complete context — never assemble
2. Context is immutable once assembled
3. Cache invalidates on every relevant domain event
4. No executive may bypass Context Runtime to access services
5. `EXECUTIVES_ENABLED` remains `false` until Athena certification

---

## References

- `packages/platform/src/context-runtime/`
- `packages/platform/src/executive/context.ts`
- `docs/architecture/ADR-024-context-runtime.md`

---

*Build the Organization. Not the Chatbot.*
