# ADR-081: Attention Budget Runtime

**Status:** Accepted  
**Date:** 2026-07-26  
**Sprint:** Sprint 4 Phase C

## Context

Attention allocation requires deterministic backend services integrated with Context Runtime and OrgOS scheduling — without becoming an intelligence engine.

## Decision

1. Implement AttentionAllocator, Capacity, Debt, Recovery, Certification services
2. Wire through `AttentionBudgetContextService` into CompanyContext
3. Register assembler ID `attention-budget` in Context Runtime
4. Event-driven: allocation publishes `attention-budget.allocated`

## Consequences

- REST API for budget operations and certification
- Mission Control widget contracts for visualization

## Bedrock Extension Test

Context Runtime assembles context — attention budget is new assembler, not Bedrock rewrite.
