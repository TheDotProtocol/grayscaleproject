# Executive Deliberation

**Deterministic 12-Stage Deliberation Pipeline**

**Version:** 1.0.0  
**Sprint:** Sprint 4 Phase B

---

## Principle

**Executives never skip stages.** Every proposal progresses through the full pipeline deterministically.

---

## Stages (Fixed Order)

| # | Stage | Purpose |
|---|-------|---------|
| 1 | `observation` | Frame the issue without premature judgment |
| 2 | `evidence_collection` | Gather supporting and contradicting evidence |
| 3 | `discussion` | Structured executive contributions |
| 4 | `challenge` | Formal challenge requests via collaboration network |
| 5 | `counter_evidence` | Record contradicting evidence |
| 6 | `alternative_generation` | Generate alternatives — not single-path thinking |
| 7 | `consensus_measurement` | Deterministic consensus score |
| 8 | `founder_policy_validation` | Validate against Founder policies |
| 9 | `constraint_validation` | Validate against organizational constraints |
| 10 | `recommendation_draft` | Draft recommendation (not autonomous execution) |
| 11 | `explainability_review` | Ensure full explanation before decision |
| 12 | `certification` | Deliberation certification gate |

Contract: `DELIBERATION_STAGES` in `executive-deliberation-engine.ts`

---

## API

```
POST /companies/:id/council/deliberations
POST /companies/:id/council/deliberations/:proposalId/advance
GET  /companies/:id/council/deliberations
```

---

## Stage Records

Each stage produces a `DeliberationStageRecord` with timing, success, evidence, and correlation ID. Records append to council memory.

---

## Blocking Rules

- `canSkipStage()` always returns `false`
- Stage order never reordered at runtime
- Individual stage failure recorded; pipeline may block with `status: blocked`

---

## Relationship to Council Deliberation (Sprint 3)

Sprint 3 `CouncilDeliberationRecord` captures individual executive positions. Sprint 4 deliberation engine orchestrates **proposal lifecycle** through all 12 stages — complementary, not duplicate.
