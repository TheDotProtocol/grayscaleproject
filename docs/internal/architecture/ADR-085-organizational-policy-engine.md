# ADR-085: Organizational Policy Engine

**Status:** Accepted  
**Date:** 2026-07-26  
**Sprint:** Sprint 4 Phase D

## Context

Sprint 4 Phases A–C established runtime, collaboration, and attention budgeting. No constitutional layer determined whether organizational actions are permitted before execution. Bedrock provides `PolicyService` and `ConstraintService` but no unified permission authority.

## Decision

1. Create `ORGANIZATIONAL_POLICY_ENGINE.md` as immutable constitutional document
2. Implement `packages/platform/src/policy/` — 15 interface-first ports
3. Implement `PolicyEngineModule` — evaluation, constraints, approvals, audit, history
4. Delegate to Bedrock policy/constraint services — no duplicate storage
5. Default deny with explicit allow; unknown policies fail safely

## Consequences

- Every future capability must consult OPE before execution
- Policy decisions are deterministic, explainable, auditable, versioned
- Context version `2.3.0-s4d-policy-engine`
- OPE does not reason, recommend, or execute

## Bedrock Extension Test

PolicyService exists in intelligence module — OPE is constitutional governance layer above Bedrock policies.
