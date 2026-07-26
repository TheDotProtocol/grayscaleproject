# ADR-027: Organizational Insight Framework

**Status:** Accepted  
**Date:** 2026-07-25  
**Phase:** Sprint 2 — Phase A.4 (Context Runtime)  
**Deciders:** Founding Principal Engineer  
**Foundation:** Bedrock v1.0.0-bedrock (Certified, FROZEN)

---

## Context

Signals (ADR-026) indicate **what changed**. Temporal (ADR-025) shows **how things evolved**. Executives in Discovery Mode (ADR-014) need **explainable observations** — synthesized understanding without crossing into recommendation.

**Problem:** Without a formal insight layer, signal interpretation drifts into prescriptive advice inside platform code.

**Constraint:** Observations only. **`isRecommendation: false`** is constitutional — enforced at type and runtime.

---

## Decision

### 1. Organizational Insight Engine

Generates **organizational insights** — categorized, evidence-backed observations derived from signals and engine context.

Categories: `throughput`, `momentum`, `culture`, `financial`, `strategic`, `operational`, `founder`, `learning`, `intent`, `adaptation`.

Each insight includes: `observation` (descriptive text), `confidence`, `evidence`, `derivedFromSignalIds`, optional `magnitude` and `period`.

### 2. Observations, NOT Recommendations

Insights MUST:

- Describe what is observed ("execution velocity declined 12% over 30 days")
- Cite evidence and source signals
- Set `isRecommendation: false` — always

Insights MUST NOT:

- Prescribe actions ("you should hire two engineers")
- Include imperative language or option ranking
- Bypass Discovery eligibility (ADR-014)

`assertInsightNotRecommendation()` enforces the invariant at runtime.

### 3. Signal → Insight Pipeline

`generateFromSignals(companyId, signalIds)` synthesizes insights from consumed signals. Insight Engine reads signals; it does not emit them.

Recommendations remain exclusively in Executive Recommendation Mode post-Discovery.

### 4. Platform Contract

| Contract | File | Purpose |
|----------|------|---------|
| Insight Engine | `insights/insight-engine.ts` | Generate, record, snapshot ports |
| Signal Bus | `signals/signal-bus.ts` | Upstream signal types |
| Shared types | `organization/common.ts` | `EngineEvidenceRef` |

### 5. CompanyContext Extension

`CompanyContext.insights?: OrganizationalInsightSnapshot` — assembled read-only.

### 6. Mission Control Widget (reserved)

| Widget ID | Purpose |
|-----------|---------|
| `organizational-insights` | Observation feed by category |

### 7. Event Catalog (reserved)

- `organizational-insight.generated`
- `organizational-insight.recorded`

---

## Consequences

### Positive

- Clear boundary between platform observation and executive recommendation
- Insights explainable via evidence and signal provenance
- Discovery pipeline gains structured observations before eligibility

### Negative

- Observations without recommendations may feel incomplete to operators (intentional)
- Insight quality depends on signal and engine maturity

### Risks

| Risk | Mitigation |
|------|------------|
| Recommendations disguised as insights | `isRecommendation: false` type constraint; certification gate |
| Insights without evidence | `EngineEvidenceRef` required; reject bare assertions |
| Insight Engine bypasses Discovery | Insights feed Discovery; never Recommendation Mode directly |

---

## Compliance

| Document | Alignment |
|----------|-----------|
| EXECUTIVE_PHILOSOPHY.md | Observation before recommendation |
| EXECUTIVE_MANIFESTO.md v1.2 | §49 reasoning pipeline; insights are pre-recommendation |
| EXECUTIVE_CERTIFICATION.md v1.2 | Insight-not-recommendation gate |
| ADR-014 | Insights support Discovery; never replace it |
| ADR-026 | Signals are insight inputs, not outputs |

---

## Out of Scope (Phase A.4)

- LLM-generated insight narratives
- Insight-to-recommendation auto-promotion
- Operator-facing insight action buttons
- Mission Control widget implementation

---

## References

- `packages/platform/src/insights/insight-engine.ts`
- `packages/platform/src/signals/signal-bus.ts`
- `packages/platform/src/organization/common.ts`
- `packages/platform/src/executive/context.ts`
- `packages/platform/src/mission-control/context-runtime-widgets.ts`
- `backend/src/modules/context-runtime/organizational-insight-engine.service.ts`
- `backend/src/modules/context-runtime/projectors/insight.projector.ts`

---

*See clearly. Recommend later.*
