# ADR-018: Organizational Learning Engine

**Status:** Accepted  
**Date:** 2026-07-25  
**Phase:** Sprint 2 — Phase A.2 (Organizational Intelligence)  
**Deciders:** Founding Principal Engineer  
**Foundation:** Bedrock v1.0.0-bedrock (Certified, FROZEN)

---

## Context

Organizations accumulate lessons — failed launches, successful experiments, incident reviews, customer discoveries. Without a structured learning layer, these insights scatter across memory entries and are lost to future decisions.

**Problem:** Raw memory is not structured learning. Executives need curated lesson records with takeaways, evidence, and cross-system links.

**Constraint:** Contracts only. No automatic lesson extraction in Phase A.2.

---

## Decision

### 1. Organizational Learning Engine

Captures structured lesson records across 11 types:

`failure`, `success`, `experiment`, `launch_review`, `retrospective`, `incident_review`, `customer_discovery`, `market_discovery`, `engineering_lesson`, `financial_lesson`, `operational_lesson`.

Each record includes: title, summary, what happened, why it mattered, takeaway, evidence, and actor attribution.

### 2. Cross-System Linking

Records auto-link to platform subsystems via `EngineLinkRef`:

- Memory, Knowledge Graph, Strategy, Timeline, Projects

`linkRecord` port enables post-creation linking without duplicating content.

### 3. Distinction from Memory and Wisdom

| Layer | Content | Lifecycle |
|-------|---------|-----------|
| Memory | Raw company facts | Continuous ingestion |
| Learning (this ADR) | Structured lessons with takeaways | Recorded events |
| Wisdom (ADR-019) | Approved principles from repeated learning | Approval-gated |

### 4. Platform Contract

| Contract | File | Purpose |
|----------|------|---------|
| Learning Engine | `organizational-learning.ts` | Record types, CRUD, linking, timeline |
| Shared types | `common.ts` | `EngineLinkRef`, `EngineEvidenceRef` |

### 5. CompanyContext Extension

`OrganizationalIntelligenceContext.recentLearnings` — recent records for executive context.

### 6. Mission Control Widget (reserved)

| Widget ID | Purpose |
|-----------|---------|
| `learning-timeline` | Chronological lesson timeline |

### 7. Event Catalog (reserved)

- `organizational-learning.recorded`
- `organizational-learning.linked`

---

## Consequences

### Positive

- Lessons become first-class, searchable organizational assets
- Cross-system linking prevents knowledge silos
- Executives reference prior lessons in recommendations

### Negative

- Manual recording burden until automated extraction exists
- Link maintenance requires discipline

### Risks

| Risk | Mitigation |
|------|------------|
| Learning conflated with Memory | Distinct record schema with structured fields |
| Lessons without evidence | Required `EngineEvidenceRef[]` on every record |
| Stale learnings never archived | Versioned records; timeline API for recency |

---

## Compliance

| Document | Alignment |
|----------|-----------|
| EXECUTIVE_PHILOSOPHY.md | Evidence-based understanding |
| EXECUTIVE_MANIFESTO.md v1.2 | Experience memory complements company memory |
| EXECUTIVE_CERTIFICATION.md v1.2 | Learning engine gates |
| ADR-007 | Memory Engine provides evidence, not lesson structure |

---

## Out of Scope (Phase A.2)

- Automatic lesson extraction from events or LLM
- Service implementations and persistence
- Mission Control widget implementation
- Wisdom promotion workflow (see ADR-019)

---

## References

- `packages/platform/src/organization/organizational-learning.ts`
- `packages/platform/src/organization/common.ts`
- `packages/platform/src/organization/context.ts`
- `packages/platform/src/mission-control/organizational-widgets.ts`

---

*Every failure is tuition. Capture the receipt.*
