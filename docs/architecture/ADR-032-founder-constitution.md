# ADR-032: Founder Constitution

**Status:** Accepted  
**Date:** 2026-07-25  
**Sprint:** 2 — Athena Reference Executive

## Context

Executives require immutable constitutional principles above their reasoning layer. Founder authority, automation boundaries, and traceability must be enforced platform-wide.

## Decision

1. Create `docs/platform/FOUNDER_CONSTITUTION.md` as immutable constitutional document
2. Add `FounderConstitutionContext` to `@grayscale/platform`
3. Inject via `CompanyContext.founderConstitution` (optional, non-breaking)
4. ECS validates constitution compliance before executive activation

## Consequences

- All executives inherit constitution automatically
- Mission Control displays constitution compliance widget
- Constitutional changes require ADR + version bump + migration note

## Non-negotiables

- No Bedrock modifications
- No breaking changes to existing CompanyContext consumers
