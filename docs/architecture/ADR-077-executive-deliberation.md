# ADR-077: Executive Deliberation Engine

**Status:** Accepted  
**Date:** 2026-07-26  
**Sprint:** Sprint 4 Phase B

## Context

Individual deliberation records (Sprint 3) do not enforce a complete proposal lifecycle. Executives could theoretically skip evidence, challenge, or explainability stages.

## Decision

1. Implement 12-stage deterministic deliberation pipeline
2. `canSkipStage()` always returns false
3. Each stage records timing, evidence, correlation ID in council memory
4. API: start proposal, advance stage (one at a time)

## Consequences

- Every proposal traverses observation through certification
- Deliberation explainability is stage-granular
- Weak consensus and policy validation are mandatory gates

## Bedrock Extension Test

Council deliberation records exist — pipeline orchestration is new OrgOS/council layer, not duplicate storage.
