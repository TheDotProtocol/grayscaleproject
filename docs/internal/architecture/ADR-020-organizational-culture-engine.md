# ADR-020: Organizational Culture Engine

**Status:** Accepted  
**Date:** 2026-07-25  
**Phase:** Sprint 2 — Phase A.2 (Organizational Intelligence)  
**Deciders:** Founding Principal Engineer  
**Foundation:** Bedrock v1.0.0-bedrock (Certified, FROZEN)

---

## Context

Organizational DNA (ADR-015) defines **stated** culture principles. The Culture Engine models **observed** company behaviour — how teams actually communicate, decide, execute, and collaborate.

**Problem:** Without behavioural culture metrics, executives recommend changes that contradict how the organization actually operates.

**Constraint:** Evidence-based observations only. Contracts only in Phase A.2.

---

## Decision

### 1. Organizational Culture Engine

Scores 11 culture dimensions with explainable metrics:

`communication_quality`, `decision_transparency`, `execution_consistency`, `meeting_quality`, `documentation_health`, `innovation_culture`, `accountability`, `ownership`, `cross_team_collaboration`, `feedback_culture`, `governance_respect`.

Each dimension uses `ExplainableScore`. Snapshots include an `overallHealth` aggregate.

### 2. DNA vs Culture

| Layer | Content | Mutability |
|-------|---------|------------|
| Organizational DNA (ADR-015) | Stated principles and values | Approval-gated updates |
| Culture Engine (this ADR) | Observed behavioural health | Evidence-based observations |

DNA is aspiration. Culture is measurement.

### 3. Platform Contract

| Contract | File | Purpose |
|----------|------|---------|
| Culture Engine | `culture-engine.ts` | Dimension catalog, snapshots, observation port |
| Shared types | `common.ts` | `ExplainableScore`, `EngineEvidenceRef` |

### 4. CompanyContext Extension

`OrganizationalIntelligenceContext.culture` — assembled snapshot consumed read-only.

### 5. Mission Control Widget (reserved)

| Widget ID | Purpose |
|-----------|---------|
| `culture-health` | Culture dimension dashboard |

Mission Control is the primary consumer of culture snapshots.

### 6. Event Catalog (reserved)

- `organizational-culture.observed`

---

## Consequences

### Positive

- Gap between stated DNA and observed culture becomes visible
- Executives tailor recommendations to actual behavioural capacity
- Culture health tracked over time with explainable scores

### Negative

- Observation quality depends on evidence sources
- Subjective dimensions require careful calibration

### Risks

| Risk | Mitigation |
|------|------------|
| Culture conflated with DNA | Separate contracts and context fields |
| Scores without evidence | Required evidence on every observation |
| Culture used punitively | Observation-only; executives consume read-only |

---

## Compliance

| Document | Alignment |
|----------|-----------|
| EXECUTIVE_PHILOSOPHY.md | Organization-first; evidence over assumption |
| EXECUTIVE_MANIFESTO.md v1.2 | Culture informs recommendation feasibility |
| EXECUTIVE_CERTIFICATION.md v1.2 | Culture engine gates |
| ADR-015 | DNA principles contrast with culture observations |

---

## Out of Scope (Phase A.2)

- Employee survey integrations
- Automated culture inference
- Service implementations and persistence
- Mission Control widget implementation

---

## References

- `packages/platform/src/organization/culture-engine.ts`
- `packages/platform/src/organization/common.ts`
- `packages/platform/src/organization/context.ts`
- `packages/platform/src/mission-control/organizational-widgets.ts`

---

*Values are declared in DNA. Culture is what actually happens.*
