# ADR-009: Strategic Intelligence Framework

**Status:** Accepted  
**Date:** 2026-07-25  
**Phase:** 1.5D  
**Deciders:** Founding Principal Engineer

---

## Context

Project Grayscale requires a common decision-making engine that every future executive inherits. The current `AgentRecommendation` model is coupled to `AgentRun`, lacks evidence/alternatives/audit, and violates the principle that **structured reasoning—not LLM output—is the intellectual foundation**.

Phase 1.5C established the Strategy Engine as a fourth pillar (contracts only). Phase 1.5D must deliver the **Strategic Intelligence Framework (SIF)**.

---

## Decision

1. **Modular engines with dynamic registration (AIP-10)** — Goals, Objectives, Priority, Recommendations, Decisions, Risks, Opportunities, Dependency Analyzer; future engines pluggable without orchestrator changes.
2. **Strategy Engine orchestrates** — does not own engine implementations or tables.
3. **First-class `recommendations` table** — decoupled from `agent_runs` (evolves AIP-4).
4. **Rule-based intelligence only** — no LLM inside SIF; executives translate output in Sprint 2+.
5. **Explainability by schema** — required fields for evidence, alternatives, confidence, rollback.
6. **Graph integration** — strategic entities projected to `graph_nodes` for dependency traversal.
7. **Mission Control summary APIs** — `/intelligence/*` endpoints (no dashboards in 1.5D).

---

## Four-Pillar Alignment

| Pillar | SIF Usage |
|--------|-----------|
| Event Store | Triggers rule evaluation; audit trail |
| Memory Engine | Evidence references |
| Knowledge Graph | Dependencies, relationships |
| Strategy Engine | Orchestrates all SIF modules |

---

## Alternatives Considered

| Alternative | Rejected Because |
|-------------|------------------|
| Recommendation-only scope | Insufficient for executive inheritance |
| LLM inside Strategy Engine | Violates explainability and executive rule |
| Keep AgentRecommendation | Schema inadequate; AgentRun coupling |
| External workflow engine | Ops complexity |

---

## Consequences

**Positive:**
- Every executive inherits identical reasoning
- Founders get strategic value before AI executives exist
- Full audit and explainability (NON_NEGOTIABLES #3)
- Priority scoring reproducible and configurable

**Negative:**
- Large schema surface area
- Migration from legacy recommendations
- Rule set maintenance until executives augment in Sprint 2

---

## References

- [STRATEGIC_INTELLIGENCE_DESIGN_REVIEW.md](./STRATEGIC_INTELLIGENCE_DESIGN_REVIEW.md)
- AIP-4 (Recommendation entity) — superseded scope by SIF
- ADR-008 (Knowledge Graph)
