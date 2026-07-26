# Strategy Evolution Engine

**Version:** 1.0.0 (Sprint 4)

---

## Principle

Strategy evolves. **Founder intent does not.** Nothing updates strategy automatically — all evolution is proposed and explainable.

## Inputs

Learning, wisdom, forecasts, twin evolution, scenario outcomes, market observations, risk observations.

## Every Proposal Requires

Evidence, reason, confidence, alternatives, impact, rollback strategy, twin version binding.

## Platform

`packages/platform/src/organization/strategy-evolution.ts`

## Backend

`StrategyEvolutionService` — propose, list, get

## API

```
GET  /companies/:id/organizational-evolution/strategy-evolution
POST /companies/:id/organizational-evolution/strategy-evolution
```

## Event

`strategy-evolution.proposed`
