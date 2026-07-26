# Attention Budget Explainability

**Every allocation must explain (Sprint 4 Phase C)**

---

## Record Schema

`AttentionBudgetExplainability` includes:

- `why` — human-readable reason
- `triggerSource` — what initiated allocation
- `category` — attention domain
- `affectedExecutives` — consumers, not owners
- `contextSwitchCost` — measurable switching penalty
- `durationMs`, `evidence`, `version`
- `correlationId`, `traceId`, `auditReference`

---

## Rules

1. No silent allocation
2. Executives listed as consumers only
3. Context switch cost computed from ONS data
4. Audit reference links to append-only trail

---

## API

Explainability records generated on every `POST /attention-budget/:companyId/allocate`.

Mission Control widget: `attention-explainability`
