# ADR-033: Executive Compliance Suite

**Status:** Accepted  
**Date:** 2026-07-25  
**Sprint:** 2 — Athena Reference Executive

## Context

Executives must pass deterministic certification before activation. LLM-based pass/fail is prohibited.

## Decision

1. Define `ExecutiveComplianceSuitePort` and `EcsCertificationReport` in platform
2. Implement `ExecutiveComplianceService` with 21 certification categories
3. Expose `GET /companies/:id/executive-compliance/athena/certify`
4. Score via weighted critical/standard checks (≥90 required)

## Consequences

- Athena certified but dormant until Founder enables executives
- Future executives reuse same ECS with executive-specific checks
- Every failure produces deterministic evidence string

## Non-negotiables

- No LLM output for certification decisions
- EXECUTIVES_ENABLED=false verified on every certification run
