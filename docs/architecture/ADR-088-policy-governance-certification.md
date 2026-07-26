# ADR-088: Policy and Governance Certification

**Status:** Accepted  
**Date:** 2026-07-26  
**Sprint:** Sprint 4 Phase D

## Context

Executive activation requires deterministic certification gates. Policy and governance layers need separate but complementary certification suites.

## Decision

1. **15 policy ECS gates** — versioned, explainable, auditable, deterministic, inherited hierarchy
2. **12 governance ECS gates** — checkpoint, routing, authority, audit, no reasoning
3. **10 Phase D ECS checks** in Executive Compliance Suite
4. Certification score ≥ 90 required; all gates must pass
5. REST endpoints for policy and governance certification reports

## Consequences

- Mission Control widget: `governance-certification`
- Events: `policy.certified`, `governance.certified`
- ECS extended without modifying Bedrock certification framework

## Bedrock Extension Test

Certification follows Phase A–C pattern — deterministic gates, no LLM evaluation.
