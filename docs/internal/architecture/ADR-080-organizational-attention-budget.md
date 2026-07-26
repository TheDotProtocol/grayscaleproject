# ADR-080: Organizational Attention Budget

**Status:** Accepted  
**Date:** 2026-07-26  
**Sprint:** Sprint 4 Phase C

## Context

The organization has finite cognitive resources. Sprint 3 Attention Engine perceives attention state but does not constitutionally govern allocation. Executives compete for attention without a budgeting system.

## Decision

1. Create `ORGANIZATIONAL_ATTENTION_BUDGET.md` as immutable constitutional document
2. Implement `packages/platform/src/attention-budget/` contracts
3. Implement `AttentionBudgetModule` — measurement and allocation orchestration only
4. Derive budget metrics from existing Attention Engine — no duplicate storage

## Consequences

- Attention allocation is organizational, auditable, explainable
- Executives consume; never create attention
- Context version `2.2.0-s4c-attention-budget`

## Bedrock Extension Test

Attention Engine exists in ONS — OAB is constitutional governance layer above perception.
