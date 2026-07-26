# ADR-031: Architecture Lock

**Status:** Accepted | **Date:** 2026-07-25 | **Phase:** Sprint 2 Phase B

## Context
Bedrock v1.0 is certified and frozen. Sprint 2 extensions must not rewrite foundation architecture.

## Decision
Create immutable `docs/platform/ARCHITECTURE_LOCK.md` defining: Bedrock frozen, no breaking changes, ADR required, versioning mandatory, executive certification mandatory, Bedrock extension test.

## Consequences
Positive: Architectural discipline preserved. Negative: Slower evolution — intentional.

## Compliance
FOUNDATION_CERTIFICATE.md; all Sprint 2 ADRs reference this lock.

## Out of Scope
Automated architecture lock enforcement tooling (future).

## References
`docs/platform/ARCHITECTURE_LOCK.md`
