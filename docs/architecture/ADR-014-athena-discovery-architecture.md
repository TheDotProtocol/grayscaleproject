# ADR-014: Athena Discovery Architecture

**Status:** Accepted  
**Date:** 2026-07-25  
**Phase:** Sprint 2 — Phase A.1 (Athena Discovery Architecture)  
**Deciders:** Founding Principal Engineer  
**Foundation:** Bedrock v1.0.0-bedrock (Certified, FROZEN)

---

## Context

Foundation (Bedrock) delivered the Executive Runtime **framework** — lifecycle, permissions, inbox, bus, CompanyContext, explainability — with `EXECUTIVES_ENABLED=false`.

Sprint 2 Phase A established constitutional documents:

- `EXECUTIVE_PHILOSOPHY.md` — why executives exist
- `EXECUTIVE_MANIFESTO.md` v1.1 — behavioral constitution
- `EXECUTIVE_CERTIFICATION.md` v1.1 — production gates

Before any executive **thinks** (generates recommendations), the platform must define **how** executives think. Athena is the reference implementation; Atlas, Ledger, Mercury, Sentinel, Forge, Navigator, and all future executives inherit this architecture.

**Problem:** Without a formal discovery architecture, executives risk becoming "ChatGPT with memory" — bypassing evidence, identity adaptation, trust calibration, and constitutional pipelines.

**Constraint:** No executive business logic. No LLM reasoning. No recommendation generation in Phase A.1. Contracts and architecture only.

---

## Decision

### 1. Executive Discovery Architecture (Universal)

Every executive MUST pass through **Discovery Mode** before **Recommendation Mode**. Discovery is observation — never recommendation.

**Discovery pipeline (constitutional — no stage may be skipped):**

```
Observe
    ↓
Identity Engine          ← operator preferences & presentation (NOT facts)
    ↓
Executive Cognitive Model (ECM)  ← behavioural understanding (NOT memory)
    ↓
Memory Engine            ← company facts
    ↓
Knowledge Graph
    ↓
Strategy Engine
    ↓
Policies
    ↓
Constraints
    ↓
Dependencies
    ↓
Risk Analysis
    ↓
Opportunity Analysis
    ↓
Confidence Evaluation
    ↓
Recommendation Eligibility
    ↓
[Recommendation Mode — only after eligibility passes]
```

Recommendation Mode uses the Athena reasoning pipeline (Manifesto §49) and produces explainable outputs.

### 2. Identity Engine (replaces Founder Preference Engine)

Grayscale is an **Organization OS**, not merely a Founder OS.

The **Identity Engine** stores operator identity and presentation preferences:

- Personal preferences, communication style, leadership/decision/working style
- Focus patterns, reminder behaviour, report/conversation style
- Language, timezone, display preferences
- Executive display names, avatars, voices
- Accessibility preferences

Every executive automatically consumes Identity Engine output. Identity Engine is **read-only** to executives.

### 3. Executive Cognitive Model (ECM)

ECM is **NOT Memory**. Memory stores **facts**. ECM stores **behavioural understanding** derived from evidence.

Examples: planning style, macro vs micro thinking, decision confidence patterns, risk tolerance, focus duration, work schedule, ADHD assistance preferences, visual vs textual preference, meeting preference, reminder effectiveness, executive interaction preferences.

ECM MUST evolve through **evidence only** — never assumptions or LLM invention.

### 4. Platform Contracts (`@grayscale/platform`)

New executive subsystem contracts (ports + types only):

| Contract | File | Purpose |
|----------|------|---------|
| Executive Identity | `executive-identity.ts` | Immutable identity record |
| Identity Engine | `identity-engine.ts` | Operator identity & preferences |
| Executive Cognitive Model | `cognitive-model.ts` | Behavioural understanding |
| Executive Trust Engine | `trust-engine.ts` | Trust metrics & score |
| Discovery Engine | `discovery-engine.ts` | Discovery pipeline & eligibility |
| Recommendation Lifecycle | `recommendation-lifecycle.ts` | Living recommendation states |
| Executive Council | `executive-council.ts` | Inter-executive collaboration |
| Persona Engine | `persona-engine.ts` | Presentation layer (reasoning unchanged) |
| Executive Experience Memory | `experience-memory.ts` | Lessons learned (≠ company memory) |

### 5. Lifecycle Extension

Add `discovering` to `ExecutiveLifecycleState`. Executives enter `discovering` on activation until Discovery Engine reports eligibility.

### 6. CompanyContext Extension (contract only)

`CompanyContext` gains optional fields (assembled by platform, not executives):

- `identity?: OperatorIdentityProfile`
- `cognitiveModel?: ExecutiveCognitiveProfile`
- `discovery?: DiscoverySnapshot`

Executives consume these; they never mutate them.

### 7. Mission Control Widgets (reserved)

Widget IDs registered for Sprint 2 implementation:

| Widget ID | Purpose |
|-----------|---------|
| `identity-profile` | Identity Engine summary |
| `executive-cognitive-profile` | ECM summary |
| `executive-trust` | Trust score & metrics |
| `discovery-progress` | Pipeline stage completion |
| `recommendation-readiness` | Eligibility gate status |
| `executive-experience` | Experience memory |
| `executive-council` | Council collaboration |
| `recommendation-trace` | Full recommendation reasoning |
| `confidence-timeline` | Confidence calibration history |
| `learning-progress` | ECM evidence growth |

### 8. Event Catalog Extensions (reserved)

New event families (registered before executive activation):

- `identity.updated`
- `cognitive-model.evidence.recorded`
- `discovery.started` / `discovery.stage.completed` / `discovery.eligible`
- `trust.score.updated`
- `recommendation.lifecycle.transitioned`
- `executive.council.message`

---

## Consequences

### Positive

- Every executive shares one constitutional thinking architecture
- Operators adapt via Identity Engine + ECM without changing reasoning integrity
- Discovery prevents premature recommendations
- Trust is measurable and earned
- Athena becomes a replicable reference — not a one-off agent

### Negative

- Additional platform services to implement before Athena recommends
- Discovery latency before first recommendation (intentional)
- ECM requires careful evidence governance to avoid pseudo-psychological inference

### Risks

| Risk | Mitigation |
|------|------------|
| ECM inferred without evidence | Certification gate: evidence-required updates only |
| Identity conflated with ECM | Separate contracts, separate storage, separate provenance |
| Discovery bypassed | Discovery Engine eligibility gate; certification failure |
| Persona alters reasoning | Persona Engine applies presentation post-reasoning only |

---

## Compliance

| Document | Alignment |
|----------|-----------|
| EXECUTIVE_PHILOSOPHY.md | Discovery before recommend; trust earned; clarity over output |
| EXECUTIVE_MANIFESTO.md v1.2 | §40–§52 extended by this ADR |
| EXECUTIVE_CERTIFICATION.md v1.2 | Gates §3.22–§3.37 enforce this architecture |
| EXECUTIVE_CERTIFICATION_SPECIFICATION.md | Technical ports extended in `@grayscale/platform` |
| FOUNDATION_CERTIFICATE.md | Bedrock frozen; this ADR extends, does not modify |

---

## Out of Scope (Phase A.1)

- Athena executive implementation
- LLM integration
- Recommendation generation
- Backend NestJS service implementations
- Mission Control widget implementations
- Database migrations for ECM/Identity storage

Phase A.2 implements platform services against these contracts.

---

## References

- `docs/platform/EXECUTIVE_PHILOSOPHY.md`
- `docs/platform/EXECUTIVE_MANIFESTO.md`
- `docs/sprint-2/ATHENA_DISCOVERY.md`
- `packages/platform/src/executive/` — contract implementations

---

**Athena inherits this architecture. Every future executive inherits Athena's architecture.**

*Build the Organization. Not the Chatbot.*
