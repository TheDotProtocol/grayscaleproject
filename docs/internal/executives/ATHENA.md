# Athena — Reference Executive

**Project Grayscale — Chief Executive Strategist**

**Canonical ID:** `athena`  
**Department:** Strategy  
**Status:** Phase B — Certification in Progress  
**Foundation:** Bedrock v1.0.0-bedrock + Sprint 2 Extensions  
**EXECUTIVES_ENABLED:** `false` (until certification)

---

## Mission

Athena is the **reference executive** — every future executive (Atlas, Ledger, Mercury, Sentinel, Forge, Navigator) inherits her architecture.

Athena **reasons, plans, advises, coordinates, recommends, and explains** within bounded authority. She does NOT execute business logic directly, query Prisma, or call external APIs.

---

## Inputs

**CompanyContext ONLY** — assembled by Context Runtime:

| Layer | Source |
|-------|--------|
| Operational | Memory, Graph, Strategy, Pulse, Timeline |
| Organizational Intelligence | DNA, Founder DNA, Emotion, Cognition, Learning, Wisdom, Culture, Reputation, Adaptation |
| Intent & Temporal | Intent hierarchy, historical evolution |
| Signals & Insights | Organizational signals, explainable observations |
| Executive | Identity Engine, ECM, Trust, Discovery, Notebook, Curiosity |
| Platform | Reliability, Security, Governance |

---

## Constitutional Pipeline

### 1. Discovery Mode (mandatory)

13-stage pipeline before any recommendation:

```
Observe → Identity Engine → ECM → Memory → Graph → Strategy
→ Policies → Constraints → Dependencies → Risks → Opportunities
→ Confidence → Recommendation Eligibility
```

### 2. Curiosity Mode (continuous)

Generates questions → investigations → evidence. Never directly recommends.

### 3. Recommendation Mode (earned)

Rule-based analysis of CompanyContext (Phase B — no LLM improvisation):

- Critical risks → recommend founder review
- Blocked objectives → recommend unblocking
- Goals without recommendations → recommend next actions

### 4. Skeptic Pass (mandatory)

Every recommendation challenged for assumptions, evidence, bias, contradictions, policy conflicts. Must include **"What could make this wrong?"**

### 5. Explainability (complete)

Every recommendation includes full `AthenaRecommendationExplainability` — no black boxes.

---

## API Endpoints (Certification Testing)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/companies/:id/athena/status` | Athena certification status |
| POST | `/companies/:id/athena/instances/:instanceId/discovery` | Run discovery pipeline |
| POST | `/companies/:id/athena/instances/:instanceId/recommendations/draft` | Draft recommendations with full explainability |

Available regardless of `EXECUTIVES_ENABLED` for certification testing. Live execution remains gated.

---

## Module Location

```
backend/src/modules/athena/
├── athena.module.ts
├── athena.service.ts
├── athena.controller.ts
└── discovery-engine.service.ts
```

Platform contracts: `packages/platform/src/executive/`

---

## Certification Requirements

Athena MUST pass all gates in `EXECUTIVE_CERTIFICATION.md` including:

- §3.48–3.53 (Context Runtime)
- §3.22–3.37 (Discovery & Organizational Intelligence)
- Phase B gates (Notebook, Curiosity, Skeptic, Explainability)

**No second executive certifies until Athena passes.**

---

## References

- `docs/platform/EXECUTIVE_PHILOSOPHY.md`
- `docs/platform/EXECUTIVE_MANIFESTO.md`
- `docs/platform/ARCHITECTURE_LOCK.md`
- `docs/architecture/ADR-014` through `ADR-030`

---

*Athena earns every recommendation. Athena never improvises.*
