# ADR-016: Organizational Emotional Engine

**Status:** Accepted  
**Date:** 2026-07-25  
**Phase:** Sprint 2 — Phase A.2 (Organizational Intelligence)  
**Deciders:** Founding Principal Engineer  
**Foundation:** Bedrock v1.0.0-bedrock (Certified, FROZEN)

---

## Context

Organizations operate under emotional load — founder stress, execution momentum, market pressure, morale. ADR-014's Discovery Architecture observes before recommending; the Emotional Engine extends that principle to **organizational wellbeing**.

**Problem:** Without a formal emotional observation layer, executives may ignore burnout signals or, worse, manipulate operator behaviour.

**Constraint:** Observation only. No manipulative actions. Contracts only in Phase A.2.

---

## Decision

### 1. Organizational Emotional Engine

Observes 16 explainable metrics across founder, execution, and organizational dimensions:

`founder_stress`, `founder_energy`, `founder_confidence`, `founder_focus`, `burnout_risk`, `execution_momentum`, `operational_stability`, `decision_velocity`, `innovation_excitement`, `customer_confidence`, `investor_confidence`, `financial_anxiety`, `product_confidence`, `market_pressure`, `launch_confidence`, `organization_morale`.

Every metric uses `ExplainableScore` — value, confidence, reason, trend, and evidence. Snapshots are stamped `observationOnly: true`.

### 2. Constitutional Rule

The engine **MUST NOT** trigger manipulative actions (nudges, hidden UI changes, automated interventions). Executives consume snapshots read-only to calibrate recommendation timing and tone.

### 3. Platform Contract

| Contract | File | Purpose |
|----------|------|---------|
| Emotional Engine | `emotional-engine.ts` | Metric catalog, snapshots, observation port |
| Shared types | `common.ts` | `ExplainableScore`, `EngineEvidenceRef` |

### 4. CompanyContext Extension

`OrganizationalIntelligenceContext.emotional` — assembled snapshot consumed read-only.

### 5. Mission Control Widgets (reserved)

| Widget ID | Purpose |
|-----------|---------|
| `organization-emotion` | Full organizational emotional snapshot |
| `founder-emotion` | Founder-specific metric subset |

### 6. Event Catalog (reserved)

- `organizational-emotion.observed`

---

## Consequences

### Positive

- Executives adapt recommendation urgency to organizational emotional state
- Burnout and morale risks visible before they become crises
- Every score is explainable — no hidden psychological inference

### Negative

- Metric quality depends on evidence availability
- Observation-only design delays automated wellbeing interventions

### Risks

| Risk | Mitigation |
|------|------------|
| Engine used for manipulation | `observationOnly: true` contract; certification gate |
| Pseudo-psychological scoring | Evidence-required observations; explainable scores |
| Metric overload | 16-metric catalog is fixed; executives filter by relevance |

---

## Compliance

| Document | Alignment |
|----------|-----------|
| EXECUTIVE_PHILOSOPHY.md | Clarity over output; trust earned |
| EXECUTIVE_MANIFESTO.md v1.2 | Observation before recommendation |
| EXECUTIVE_CERTIFICATION.md v1.2 | Emotional engine gates |
| ADR-014 | Emotional state informs Discovery eligibility |

---

## Out of Scope (Phase A.2)

- Automated wellbeing interventions or nudges
- External sentiment integrations
- Service implementations and persistence
- Mission Control widget implementations

---

## References

- `packages/platform/src/organization/emotional-engine.ts`
- `packages/platform/src/organization/common.ts`
- `packages/platform/src/organization/context.ts`
- `packages/platform/src/mission-control/organizational-widgets.ts`

---

*Observe wellbeing. Never manipulate it.*
