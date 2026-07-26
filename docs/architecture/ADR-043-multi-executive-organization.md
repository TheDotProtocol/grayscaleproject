# ADR-043: Multi-Executive Organization

**Status:** Accepted | **Date:** 2026-07-26

## Context

Sprint 3 requires a constitutional executive organization beyond Athena alone.

## Decision

Introduce six domain executives (Atlas, Ledger, Mercury, Sentinel, Navigator, Forge) with:

- Immutable registry (`EXECUTIVE_REGISTRY`)
- Exclusive specialization domains
- Shared inheritance stack (Runtime, Constitution, Twin, Council, ECS)
- Reference runtime via `DomainExecutiveModule`
- All remain `certified_dormant` until Founder enables `EXECUTIVES_ENABLED`

## Consequences

- Seven-executive council default membership
- Per-executive ECS certification endpoint
- No duplicated storage; executives consume CompanyContext only
