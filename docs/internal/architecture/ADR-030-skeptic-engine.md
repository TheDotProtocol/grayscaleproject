# ADR-030: Executive Skeptic Engine

**Status:** Accepted | **Date:** 2026-07-25 | **Phase:** Sprint 2 Phase B

## Context
Before recommendation finalization, a constitutional skeptic pass must challenge assumptions, evidence, bias, and policy conflicts. Every recommendation requires "What could make this wrong?"

## Decision
`ExecutiveSkepticEnginePort` with `runPass()` returning challenges, adjusted confidence, and mandatory `whatCouldMakeThisWrong`. Blocking severity prevents recommendation when evidence missing.

## Consequences
Positive: False certainty reduced. Negative: Additional latency before recommendation output.

## Compliance
EXECUTIVE_MANIFESTO §48 Executive Humility; certification gate required.

## Out of Scope
LLM-based adversarial reasoning in Phase B.

## References
`packages/platform/src/executive/skeptic-engine.ts`
