# ADR-087: Policy Evaluation and Default Deny

**Status:** Accepted  
**Date:** 2026-07-26  
**Sprint:** Sprint 4 Phase D

## Context

Implicit permissions create security and governance risk. Unknown actions must fail safely. Bedrock policies may be empty for new companies.

## Decision

1. **Default deny** — empty policy set → `unknown_denied`
2. **Explicit allow** — permits require matching Bedrock policy OR `context.explicitAllow`
3. **No implicit permissions** — nothing permitted without explicit rule
4. **Deterministic evaluation** — same inputs → same verdict
5. Hard constraint violations → `prohibited` (via Bedrock ConstraintService)

## Consequences

- Safe failure mode for unknown actions
- ECS gates: `default_deny`, `explicit_allow`, `unknown_fails_safe`, `no_implicit_permissions`
- Explainability records flag `defaultDenyApplied` when applicable

## Alternatives Considered

- Default allow with deny list — rejected (violates constitutional default deny principle)
- Implicit permissions from role — rejected (no implicit permissions)
