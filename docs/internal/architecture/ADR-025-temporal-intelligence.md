# ADR-025: Temporal Intelligence Engine

**Status:** Accepted  
**Date:** 2026-07-25  
**Phase:** Sprint 2 — Phase A.4 (Context Runtime)  
**Deciders:** Founding Principal Engineer  
**Foundation:** Bedrock v1.0.0-bedrock (Certified, FROZEN)

---

## Context

Bedrock Timeline records **what happened**. Organizational Intelligence engines (ADR-015–022) capture **what the organization is now**. Neither answers **how the organization evolved** — trends, regressions, growth phases, and historical comparisons.

**Problem:** Executives risk treating current state as permanent without historical context.

**Constraint:** Historical evolution only. **No forecasting.** No predictive models, no projected runway, no "what will happen" outputs.

---

## Decision

### 1. Temporal Intelligence Engine

Analyzes organizational change over time using captured snapshots and milestone history.

Outputs: `evolutionIndex`, `growthPhases`, `milestones`, `trends`, `patterns`, `regressions`, `accelerations`, `historicalComparisons`.

### 2. Historical Snapshots

Periodic snapshots at `weekly`, `monthly`, `quarterly`, `yearly` boundaries:

- `captureSnapshot(companyId, period)` → `HistoricalSnapshotRef`
- Snapshots are point-in-time captures — not predictions
- `analyzeTrends(fromSnapshotId, toSnapshotId)` compares two known points
- `detectPatterns` identifies recurring historical patterns with evidence

### 3. Explicit Prohibition: No Forecasting

The Temporal Engine MUST NOT:

- Project future metrics or dates
- Generate predictive scenarios or confidence intervals about the future
- Replace Strategy Engine risk/opportunity analysis

It MAY describe **historical** direction (`improving`, `declining`, `stable`) between captured snapshots only.

### 4. Platform Contract

| Contract | File | Purpose |
|----------|------|---------|
| Temporal Engine | `temporal/temporal-engine.ts` | Context, snapshots, trends, patterns |
| Shared types | `organization/common.ts` | `ExplainableScore`, `EngineEvidenceRef` |

### 5. CompanyContext Extension

`CompanyContext.temporal?: TemporalIntelligenceContext` — assembled read-only.

### 6. Mission Control Widgets (reserved)

| Widget ID | Purpose |
|-----------|---------|
| `organizational-timeline` | Milestone chronology |
| `organizational-evolution` | Evolution index and growth phases |
| `historical-comparisons` | Period-over-period comparisons |
| `snapshot-explorer` | Browse captured snapshots |

### 7. Event Catalog (reserved)

- `temporal.snapshot.captured`
- `temporal.trend.detected`
- `temporal.pattern.detected`

---

## Consequences

### Positive

- Executives reason about trajectory, not just snapshot
- Historical comparisons grounded in evidence, not speculation
- Snapshots enable reproducible trend analysis

### Negative

- Meaningful trends require multiple snapshot periods (latency by design)
- Evolution index depends on upstream engine maturity

### Risks

| Risk | Mitigation |
|------|------------|
| Forecasting smuggled as "trends" | Contract prohibits future projection; certification gate |
| Snapshots without evidence | Each trend/pattern requires `EngineEvidenceRef` |
| Conflated with Bedrock Timeline | Timeline = events; Temporal = analyzed evolution |

---

## Compliance

| Document | Alignment |
|----------|-----------|
| EXECUTIVE_PHILOSOPHY.md | Evidence over speculation |
| EXECUTIVE_MANIFESTO.md v1.2 | Historical understanding before recommendation |
| EXECUTIVE_CERTIFICATION.md v1.2 | No-forecasting gate |
| ADR-006 | Snapshots sourced from event store projections |
| ADR-015–022 | Temporal synthesizes organizational intelligence over time |

---

## Out of Scope (Phase A.4)

- Predictive analytics or ML forecasting
- Automated snapshot scheduling (cron deferred)
- Mission Control widget implementations
- External benchmark comparisons

---

## References

- `packages/platform/src/temporal/temporal-engine.ts`
- `packages/platform/src/organization/common.ts`
- `packages/platform/src/executive/context.ts`
- `packages/platform/src/mission-control/context-runtime-widgets.ts`
- `backend/src/modules/context-runtime/temporal-engine.service.ts`

---

*Understand where you've been. Never claim to know where you'll land.*
