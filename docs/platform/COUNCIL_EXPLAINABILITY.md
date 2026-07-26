# Council Explainability

**Project Grayscale — Executive Council Explainability Model**

**Version:** 1.0.0  
**Status:** Constitutional — Sprint 3 Phase A  
**Companion:** `EXECUTIVE_COUNCIL_CONSTITUTION.md`, `COUNCIL_DECISION_LIFECYCLE.md`

---

## Principle

Every council conclusion must remain **inspectable**. Explainability over intelligence.

If the council cannot explain a decision, the organization cannot learn from it.

---

## CouncilExplanation Structure

Every **CouncilResolution** and **CouncilDecision** carries a `CouncilExplanation`:

### Core Fields

| Field | Description |
|-------|-------------|
| `issueSummary` | What was decided and why it mattered |
| `decisionPath` | Lifecycle stages completed |
| `participatingExecutives` | Who contributed, in what roles |
| `evidenceSummary` | Evidence refs with source types |
| `contradictingEvidence` | Surfaced conflicts |
| `voteRecord` | Per-executive vote with evidence |
| `consensusLevel` | strong \| weak \| none |
| `minorityOpinions` | Preserved dissent |
| `confidence` | Bounds with sources |
| `policiesEvaluated` | Policy IDs consulted |
| `constraintsEvaluated` | Constraint IDs consulted |
| `constitutionalCompliance` | Compliance check results |
| `founderReviewRequired` | Boolean + reason |
| `founderApprovalRecord` | If applicable |
| `rollbackPlan` | For material decisions |
| `whatCouldMakeThisWrong` | Council-level skeptic |
| `correlationId` | Full trace linkage |

### Organizational Context

| Field | Source |
|-------|--------|
| `intentChain` | Intent Engine |
| `organizationalState` | CompanyContext snapshot ref |
| `signalsReferenced` | Signal IDs |
| `insightsReferenced` | Insight IDs |
| `memoryRefs` | Memory IDs |
| `graphRefs` | Graph node/edge refs |
| `organizationalDnaFactors` | DNA context |
| `temporalContext` | Temporal intelligence ref |

---

## Explainability Requirements by Stage

| Stage | Minimum Explainability |
|-------|------------------------|
| Deliberation | Position + evidence per executive |
| Challenge | Skeptic challenges recorded |
| Consensus | Measurement inputs visible |
| Resolution | Full trace before Founder review |
| Decision | Approval chain + rollback |
| Learning | Outcome linked to decision |

---

## Mission Control Inspection

Reserved widgets (Phase B data providers):

- Council Sessions
- Open Deliberations
- Consensus Score
- Minority Opinions
- Council Audit
- Council Timeline

Founder can inspect every field without executive mediation.

---

## Audit Trail

**CouncilAudit** links:

- Session events (append-only)
- Vote immutability
- Override records
- Compliance failures

**CouncilReplay** enables deterministic reconstruction from events—no LLM narrative.

---

## Reversibility

Material decisions require:

1. Documented `rollbackPlan`
2. Preconditions for rollback
3. Owner for rollback execution (Founder or policy)

Rollback does not erase history—it adds a reversal record.

---

## Validation

Platform function: `isCouncilExplanationComplete(explanation)` — deterministic checks only.

Incomplete explanations **block** resolution finalization (Phase B enforcement).

---

## Relationship to Executive Explainability

| Layer | Scope |
|-------|-------|
| Executive explainability | Single executive recommendation |
| Council explainability | Multi-executive synthesis |
| Organizational explainability | Digital Twin (Sprint 3+) |

Council explainability **composes** executive traces—it does not replace them.

---

*Platform contract:* `CouncilExplanation` in `@grayscale/platform/council`
