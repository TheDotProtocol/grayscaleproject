# ADR-022: Organizational Adaptation Engine

**Status:** Accepted  
**Date:** 2026-07-25  
**Phase:** Sprint 2 — Phase A.2 (Organizational Intelligence)  
**Deciders:** Founding Principal Engineer  
**Foundation:** Bedrock v1.0.0-bedrock (Certified, FROZEN)

---

## Context

ADR-015 through ADR-021 model what the organization **is** — identity, emotion, cognition, learning, wisdom, culture, and reputation. The Adaptation Engine models how fast the organization **changes** — its readiness to adopt improvements, absorb lessons, and evolve.

**Problem:** Without adaptation metrics, executives recommend transformations the organization cannot absorb.

**Constraint:** Evidence-based metrics only. Contracts only in Phase A.2.

---

## Decision

### 1. Organizational Adaptation Engine

Tracks 9 adaptation metrics:

`speed_of_improvement`, `speed_of_learning`, `speed_of_execution`, `resistance_to_change`, `innovation_adoption`, `technical_debt`, `business_maturity`, `architecture_maturity`, `platform_maturity`.

Each metric uses `ExplainableScore`. Snapshots compute an aggregate `adaptationIndex` with full history via `getIndexHistory`.

### 2. Role in Organizational Intelligence

Adaptation is the **meta-engine** — it synthesizes signals from Learning (ADR-018), Culture (ADR-020), and Cognitive (ADR-017) engines to assess change readiness. Executives use it to calibrate recommendation ambition and pacing.

### 3. Platform Contract

| Contract | File | Purpose |
|----------|------|---------|
| Adaptation Engine | `adaptation-engine.ts` | Metric catalog, index, history port |
| Shared types | `common.ts` | `ExplainableScore`, `EngineEvidenceRef` |
| Context assembler | `context.ts` | Full `OrganizationalIntelligenceContext` |

### 4. CompanyContext Extension

`OrganizationalIntelligenceContext.adaptation` — assembled snapshot consumed read-only. Completes the nine-engine organizational intelligence stack.

### 5. Mission Control Widget (reserved)

| Widget ID | Purpose |
|-----------|---------|
| `adaptation-index` | Adaptation index and metric breakdown |

### 6. Event Catalog (reserved)

- `organizational-adaptation.metric.recorded`

---

## Consequences

### Positive

- Executives right-size change recommendations to organizational capacity
- Adaptation index provides a single change-readiness signal
- Historical tracking reveals improvement or stagnation trends

### Negative

- Composite index requires multiple evidence sources to be meaningful
- Maturity metrics need careful calibration to avoid false precision

### Risks

| Risk | Mitigation |
|------|------------|
| Over-ambitious recommendations | Adaptation index gates recommendation pacing |
| Index without underlying evidence | Per-metric evidence required; explainable scores |
| Adaptation conflated with culture | Separate contracts; adaptation measures change velocity, culture measures behaviour |

---

## Compliance

| Document | Alignment |
|----------|-----------|
| EXECUTIVE_PHILOSOPHY.md | Recommendations matched to organizational capacity |
| EXECUTIVE_MANIFESTO.md v1.2 | Adaptation informs recommendation eligibility |
| EXECUTIVE_CERTIFICATION.md v1.2 | Adaptation engine gates |
| ADR-015–021 | Adaptation synthesizes prior engine outputs |

---

## Out of Scope (Phase A.2)

- Automated adaptation scoring from event streams
- Service implementations and persistence
- Mission Control widget implementation
- Recommendation pacing automation (executives apply adaptation read-only)

---

## References

- `packages/platform/src/organization/adaptation-engine.ts`
- `packages/platform/src/organization/common.ts`
- `packages/platform/src/organization/context.ts`
- `packages/platform/src/organization/index.ts`
- `packages/platform/src/mission-control/organizational-widgets.ts`

---

*Know how fast the organization can move before you tell it where to go.*
