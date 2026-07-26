# ADR-021: Organizational Reputation Engine

**Status:** Accepted  
**Date:** 2026-07-25  
**Phase:** Sprint 2 — Phase A.2 (Organizational Intelligence)  
**Deciders:** Founding Principal Engineer  
**Foundation:** Bedrock v1.0.0-bedrock (Certified, FROZEN)

---

## Context

Organizations exist in an ecosystem of external perception — customers, investors, partners, press, employees, and community. Executives need explainable reputation signals to calibrate external-facing recommendations.

**Problem:** Without a formal reputation layer, executives operate on anecdote or ignore external perception entirely.

**Constraint:** Manual/evidence-only signals in Phase A.2. No external API integrations.

---

## Decision

### 1. Organizational Reputation Engine

Tracks reputation across 6 sources:

`customers`, `investors`, `partners`, `press`, `employees`, `community`.

Each signal includes an `ExplainableScore`, evidence refs, and integration status (`manual` | `pending` | `connected`). Snapshots aggregate into `overallReputation`.

### 2. Phase A.2 Integration Policy

All signals are **manual/evidence-only**. External integrations (review platforms, social monitoring, investor relations tools) are reserved for future phases. Contract supports `integrationStatus` for forward compatibility.

### 3. Platform Contract

| Contract | File | Purpose |
|----------|------|---------|
| Reputation Engine | `reputation-engine.ts` | Source catalog, snapshots, manual signal port |
| Shared types | `common.ts` | `ExplainableScore`, `EngineEvidenceRef` |

### 4. CompanyContext Extension

`OrganizationalIntelligenceContext.reputation` — assembled snapshot consumed read-only.

### 5. Mission Control Widget (reserved)

| Widget ID | Purpose |
|-----------|---------|
| `reputation` | Reputation signals by source |

### 6. Event Catalog (reserved)

- `organizational-reputation.signal.recorded`

---

## Consequences

### Positive

- External perception becomes a first-class, explainable input
- Executives calibrate external recommendations to reputation state
- Integration-ready contract without premature external dependencies

### Negative

- Manual signal entry burden until integrations arrive
- Reputation lag without real-time external feeds

### Risks

| Risk | Mitigation |
|------|------------|
| Premature external integrations | `integrationStatus: "manual"` default; no API ports in A.2 |
| Anecdotal reputation scoring | Required evidence on every signal |
| Reputation manipulation | Platform-only recording; executives consume read-only |

---

## Compliance

| Document | Alignment |
|----------|-----------|
| EXECUTIVE_PHILOSOPHY.md | Evidence-based understanding |
| EXECUTIVE_MANIFESTO.md v1.2 | External context informs recommendations |
| EXECUTIVE_CERTIFICATION.md v1.2 | Reputation engine gates |
| ADR-011 | Integration platform reserved for future reputation feeds |

---

## Out of Scope (Phase A.2)

- External API integrations (review sites, social, PR monitoring)
- Automated sentiment analysis
- Service implementations and persistence
- Mission Control widget implementation

---

## References

- `packages/platform/src/organization/reputation-engine.ts`
- `packages/platform/src/organization/common.ts`
- `packages/platform/src/organization/context.ts`
- `packages/platform/src/mission-control/organizational-widgets.ts`

---

*Reputation is perception with evidence. Measure it before you manage it.*
