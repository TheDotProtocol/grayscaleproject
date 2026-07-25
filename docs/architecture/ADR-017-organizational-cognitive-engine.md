# ADR-017: Organizational Cognitive Engine

**Status:** Accepted  
**Date:** 2026-07-25  
**Phase:** Sprint 2 — Phase A.2 (Organizational Intelligence)  
**Deciders:** Founding Principal Engineer  
**Foundation:** Bedrock v1.0.0-bedrock (Certified, FROZEN)

---

## Context

ADR-014 introduced the Executive Cognitive Model (ECM) for **individual** behavioural understanding. Organizations also exhibit collective thinking patterns — decision habits, planning maturity, detected biases, and domain-specific thinking levels.

**Problem:** Without an organizational cognitive profile, executives treat every company as analytically identical, producing misaligned recommendations.

**Constraint:** Evidence-only evolution. Platform-only writes. Contracts only in Phase A.2.

---

## Decision

### 1. Organizational Cognitive Engine

Models **how the organization thinks** — not what it knows (Memory) or what it learned (Learning Engine).

Profile dimensions include:

- Decision patterns, problem-solving style, execution/innovation style
- Planning, strategic, technical, financial, operational, and risk thinking maturity
- Detected biases (with per-bias evidence and confidence)
- Communication patterns, meeting behaviour, learning style
- `cognitiveEvolution` timeline — dimension changes traced to evidence

### 2. Distinction from ECM

| Layer | Scope | Storage |
|-------|-------|---------|
| ECM (ADR-014) | Individual operator behaviour | `cognitive-model.ts` |
| Organizational Cognitive (this ADR) | Collective company thinking patterns | `cognitive-engine.ts` |

Executives consume both read-only. Neither is Memory.

### 3. Platform Contract

| Contract | File | Purpose |
|----------|------|---------|
| Cognitive Engine | `cognitive-engine.ts` | Profile, evidence port, evolution history |
| Shared types | `common.ts` | `ThinkingStyle`, `MaturityLevel`, evidence refs |

### 4. CompanyContext Extension

`OrganizationalIntelligenceContext.cognitive` — assembled profile consumed read-only.

### 5. Mission Control Widget (reserved)

| Widget ID | Purpose |
|-----------|---------|
| `organizational-cognitive-profile` | Cognitive profile summary |

### 6. Event Catalog (reserved)

- `organizational-cognitive.evidence.recorded`

---

## Consequences

### Positive

- Executives calibrate recommendation depth to organizational thinking maturity
- Bias detection prevents repeated decision failures
- Cognitive evolution is auditable and evidence-linked

### Negative

- Requires sustained observation before profile is meaningful
- Bias detection demands careful evidence governance

### Risks

| Risk | Mitigation |
|------|------------|
| Conflated with ECM or Memory | Separate contracts, separate context fields |
| Biases inferred without evidence | Per-bias evidence arrays; confidence scores |
| Executives mutate cognitive profile | Platform-only `applyEvidence` port |

---

## Compliance

| Document | Alignment |
|----------|-----------|
| EXECUTIVE_PHILOSOPHY.md | Behavioural understanding from evidence |
| EXECUTIVE_MANIFESTO.md v1.2 | ECM architecture extended to organization |
| EXECUTIVE_CERTIFICATION.md v1.2 | Cognitive engine gates |
| ADR-014 | Individual ECM complements organizational cognitive model |

---

## Out of Scope (Phase A.2)

- LLM-based bias detection
- Service implementations and persistence
- Mission Control widget implementation
- Automatic cognitive profiling without evidence

---

## References

- `packages/platform/src/organization/cognitive-engine.ts`
- `packages/platform/src/organization/common.ts`
- `packages/platform/src/organization/context.ts`
- `packages/platform/src/mission-control/organizational-widgets.ts`

---

*Memory stores facts. Cognitive models store how the organization thinks.*
