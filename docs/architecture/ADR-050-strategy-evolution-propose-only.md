# ADR-050: Strategy Evolution Propose-Only

**Status:** Accepted | **Date:** 2026-07-26

## Decision

Strategy evolution is propose-only with full explainability. Founder intent immutable. No automatic strategy updates.

## Consequences

`StrategyEvolutionService` with rollback strategy on every proposal. Event: `strategy-evolution.proposed`.
