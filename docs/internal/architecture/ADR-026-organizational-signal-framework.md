# ADR-026: Organizational Signal Framework

**Status:** Accepted  
**Date:** 2026-07-25  
**Phase:** Sprint 2 — Phase A.4 (Context Runtime)  
**Deciders:** Founding Principal Engineer  
**Foundation:** Bedrock v1.0.0-bedrock (Certified, FROZEN)

---

## Context

The event store (ADR-006) records **what happened** — facts, immutable and exhaustive. Organizational engines (ADR-015–025) produce rich context. Strategy and executives need **what changed meaningfully** — condensed, directional, consumable signals.

**Problem:** Raw events overwhelm; full context re-assembly on every change is expensive.

**Constraint:** Signals are derived observations of change, not new facts. Executives consume assembled context; Strategy consumes signals directly.

---

## Decision

### 1. Organizational Signal Bus

Central bus for **organizational signals** — typed, evidence-backed indicators that something meaningful shifted.

Signal types include: `founder_stress_increased/decreased`, `culture_improving/declining`, `execution_slowing/accelerating`, `decision_velocity_rising/falling`, `customer_confidence_falling/rising`, `cash_risk_increasing/decreasing`, `learning_velocity_improving/declining`, `intent_coverage_gap`, `adaptation_readiness_changed`, `reputation_shift`, `momentum_shift`.

Each signal carries: `magnitude`, `direction`, `evidence`, `sourceEngineId`, optional `sourceEventId`, `detectedAt`, optional `expiresAt`.

### 2. Signals ≠ Events

| | Events | Signals |
|---|--------|---------|
| **Records** | What happened (fact) | What changed meaningfully |
| **Volume** | High — every action | Low — filtered significance |
| **Mutability** | Immutable append-only | Emitted; marked consumed |
| **Consumer** | Projectors, audit | Strategy Engine, Insight Engine |
| **Example** | `bill.created` | `cash_risk_increasing` |

Events feed engines; engines emit signals. Signals MUST reference originating evidence via `EngineEvidenceRef`.

### 3. Strategy Consumes Signals

`subscribeStrategyConsumer(companyId)` delivers unconsumed signals to the Strategy Engine. Strategy reacts to organizational change — executives receive the assembled `CompanyContext.signals` snapshot only.

Executives MUST NOT call `emit` or `markConsumed`.

### 4. Platform Contract

| Contract | File | Purpose |
|----------|------|---------|
| Signal Bus | `signals/signal-bus.ts` | Emit, snapshot, consume, strategy subscription |
| Shared types | `organization/common.ts` | `EngineEvidenceRef` |

### 5. CompanyContext Extension

`CompanyContext.signals?: OrganizationalSignalSnapshot` — `activeSignals` and `recentSignals`, read-only.

### 6. Mission Control Widget (reserved)

| Widget ID | Purpose |
|-----------|---------|
| `signal-feed` | Active and recent signals |

### 7. Event Catalog (reserved)

- `organizational-signal.emitted`
- `organizational-signal.consumed`

---

## Consequences

### Positive

- Strategy reacts to meaningful change without event noise
- Signal bus decouples engine outputs from strategy evaluation
- Consumption tracking prevents duplicate strategy reactions

### Negative

- Signal taxonomy requires ongoing curation
- False positives possible if magnitude thresholds miscalibrated

### Risks

| Risk | Mitigation |
|------|------------|
| Signals replace events | Distinct contracts; events remain source of truth |
| Executives emit signals | Port design excludes executive write |
| Unconsumed signal backlog | `expiresAt` + consumption tracking; ops alerting |

---

## Compliance

| Document | Alignment |
|----------|-----------|
| EXECUTIVE_PHILOSOPHY.md | Meaningful change, not noise |
| EXECUTIVE_MANIFESTO.md v1.2 | Strategy informed; executives observe via context |
| EXECUTIVE_CERTIFICATION.md v1.2 | Signal bus gates |
| ADR-006 | Events remain immutable fact layer |
| ADR-009 | Strategy Engine primary signal consumer |
| ADR-015–025 | Engines emit signals from their domains |

---

## Out of Scope (Phase A.4)

- Real-time push/WebSocket signal delivery
- Custom user-defined signal types
- Automatic signal-to-recommendation mapping
- Mission Control widget implementation

---

## References

- `packages/platform/src/signals/signal-bus.ts`
- `packages/platform/src/organization/common.ts`
- `packages/platform/src/executive/context.ts`
- `packages/platform/src/mission-control/context-runtime-widgets.ts`
- `backend/src/modules/context-runtime/organizational-signal-bus.service.ts`
- `backend/src/modules/context-runtime/projectors/signal.projector.ts`

---

*Events tell the story. Signals tell you which chapter matters.*
