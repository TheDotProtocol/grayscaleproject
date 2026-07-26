# ADR-073: Runtime Governance

**Status:** Accepted  
**Date:** 2026-07-26  
**Sprint:** Sprint 4 — Phase A

## Context

Orchestration without governance risks runtime becoming an implicit decision-maker — bypassing executives, duplicating storage, or violating constitutional hierarchy.

## Decision

1. Runtime governance enforces 7 policies via `RuntimeGovernancePort`
2. Policies inherit from Founder Constitution, Architecture Lock, and ORGANIZATIONAL_RUNTIME.md
3. Certification gate `constitutional_hierarchy_respected` validates hierarchy
4. Certification gate `no_business_logic_in_runtime` validates orchestration-only scope
5. Resource management is measurement-only in Phase A (no optimization logic)

## Consequences

- Runtime cannot silently become an intelligence engine
- Governance violations block certification
- Capacity and health are measured, not optimized, until future phases

## Non-negotiables

- No circular orchestration
- No duplicate execution
- No runtime bypasses constitutional hierarchy
- No direct Prisma access from executives

## Bedrock Extension Test

Architecture Lock governs platform evolution — not runtime operational governance. Runtime governance is OrgOS-specific.
