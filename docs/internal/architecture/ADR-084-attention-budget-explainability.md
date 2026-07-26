# ADR-084: Attention Budget Explainability

**Status:** Accepted  
**Date:** 2026-07-26  
**Sprint:** Sprint 4 Phase C

## Context

Attention allocation without explainability violates Founder Constitution traceability and organizational audit requirements.

## Decision

1. Define `AttentionBudgetExplainability` with 12 mandatory fields
2. Every allocation records explainability metadata
3. Context switch cost included in every explanation
4. Mission Control `attention-explainability` widget contract

## Consequences

- No silent attention allocation
- Audit trail links to explainability records

## Bedrock Extension Test

Runtime explainability covers orchestration — attention explainability covers allocation. Both required.
