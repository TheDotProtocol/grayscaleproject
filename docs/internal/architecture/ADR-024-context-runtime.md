# ADR-024: Context Runtime

**Status:** Accepted  
**Date:** 2026-07-25  
**Phase:** Sprint 2 — Phase A.4 (Context Runtime)  
**Deciders:** Founding Principal Engineer  
**Foundation:** Bedrock v1.0.0-bedrock (Certified, FROZEN)

---

## Context

ADR-014–022 and ADR-023–027 define many context sources — Memory, Graph, Strategy, Organizational Intelligence, Intent, Temporal, Signals, Insights. Executives MUST receive **one immutable snapshot**, not ad-hoc service calls.

**Problem:** Without a Context Runtime, assembly is scattered, uncached, and mutable mid-reasoning.

**Constraint:** Platform assembles; executives consume read-only. `EXECUTIVES_ENABLED` remains `false` until certification passes.

---

## Decision

### 1. Context Runtime Module

Central NestJS module at `backend/src/modules/context-runtime/` orchestrates all context assembly.

Key services:

| Service | Role |
|---------|------|
| `ContextRuntimeService` | Public port — assemble, invalidate cache |
| `CompanyContextAssemblerService` | Parallel assembler orchestration |
| `OrganizationalIntelligenceAssemblerService` | ADR-015–022 bundle |
| `IntentEngineService` | ADR-023 |
| `TemporalEngineService` | ADR-025 |
| `OrganizationalSignalBusService` | ADR-026 |
| `OrganizationalInsightEngineService` | ADR-027 |

Projectors (`intent`, `snapshot`, `signal`, `insight`) synchronize event-store projections into engine state.

### 2. Immutable CompanyContext

`ImmutableCompanyContext extends CompanyContext` with `contextRuntime: ContextRuntimeMetadata` where `immutable: true`.

Once assembled, the context object MUST NOT be mutated. Re-assembly produces a new snapshot with new `correlationId`.

### 3. Parallel Assembly + Resilience

`CompanyContextAssemblerService` invokes assemblers in parallel via `wrap()` — each reports `ContextAssemblerResult` (duration, success, error). Partial failure yields `undefined` for that slice; assembly continues.

Registered assembler IDs: `organizational-intelligence`, `founder`, `operational`, `financial`, `strategic`, `memory`, `graph`, `timeline`, `integration`, `plugin`, `pulse`, `readiness`, `intent`, `temporal`, `signals`, `insights`, `platform-health`, `platform-reliability`, `security`, `governance`.

### 4. Context Cache

`ContextCachePort` provides TTL-based caching:

- `buildCacheKey(companyId, founderUserId?)` — deterministic key
- `get` / `set` with `ttlSeconds`
- `invalidate(companyId)` on domain events
- `bypassCache` option for certification and debugging

Cache metadata exposed in `ContextRuntimeMetadata` (`cacheKey`, `cached`, `cacheExpiresAt`, `assemblyDurationMs`).

### 5. Platform Contracts

| Contract | File | Purpose |
|----------|------|---------|
| Context Runtime | `context-runtime/runtime.ts` | Cache, metadata, assembler ports |
| Company Context | `executive/context.ts` | Unified `CompanyContext` shape |
| Context Assembler | `context-runtime/runtime.ts` | `ContextAssemblerPort` interface |

### 6. Mission Control Widget (reserved)

| Widget ID | Purpose |
|-----------|---------|
| `context-health` | Assembler success/failure and timing |

### 7. Event Catalog (reserved)

- `context-runtime.assembled` / `context-runtime.cache.invalidated`

---

## Consequences

### Positive

- Single immutable input for all future executives
- Parallel assembly reduces latency; per-assembler telemetry aids ops
- Cache reduces load on downstream engines

### Negative

- Cache staleness until invalidation (intentional trade-off)
- Partial assembly requires executives to handle missing slices gracefully

### Risks

| Risk | Mitigation |
|------|------------|
| Context mutated mid-reasoning | `immutable: true`; new assembly for updates |
| Stale cache after domain change | Event-driven invalidation; TTL ceiling |
| Silent assembler failure | `assemblerResults` surfaced in metadata and Mission Control |

---

## Compliance

| Document | Alignment |
|----------|-----------|
| EXECUTIVE_PHILOSOPHY.md | One truth per reasoning cycle |
| EXECUTIVE_MANIFESTO.md v1.2 | CompanyContext is the sole executive input |
| EXECUTIVE_CERTIFICATION.md v1.2 | Context assembly gates |
| ADR-010 | Extends Executive Runtime framework |
| ADR-014–027 | All context slices assembled here |

---

## Out of Scope (Phase A.4)

- Distributed cache (Redis) — in-process TTL sufficient for Sprint 2
- Real-time streaming context updates
- Executive-side context mutation APIs
- Mission Control widget implementation

---

## References

- `backend/src/modules/context-runtime/` — NestJS module
- `packages/platform/src/context-runtime/runtime.ts`
- `packages/platform/src/executive/context.ts`
- `packages/platform/src/mission-control/context-runtime-widgets.ts`

---

*Assemble once. Reason once. Never mutate mid-thought.*
