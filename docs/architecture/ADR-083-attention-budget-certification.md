# ADR-083: Attention Budget Certification

**Status:** Accepted  
**Date:** 2026-07-26  
**Sprint:** Sprint 4 Phase C

## Context

Attention budgeting requires deterministic certification before executives consume budgeted attention at scale.

## Decision

1. Define 15 gates in `ATTENTION_BUDGET_ECS_GATES`
2. Implement `AttentionBudgetCertificationService`
3. Score ≥ 90 required; all gates must pass
4. Extend Executive Compliance with 9 Phase C standard checks

## Consequences

- Certification independent of executive activation
- Attention budget must certify before Phase D+ autonomy discussions

## Bedrock Extension Test

Executive ECS exists — attention budget ECS is organizational layer extension.
