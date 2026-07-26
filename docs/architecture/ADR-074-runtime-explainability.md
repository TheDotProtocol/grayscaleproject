# ADR-074: Runtime Explainability

**Status:** Accepted  
**Date:** 2026-07-26  
**Sprint:** Sprint 4 — Phase A

## Context

Orchestration at organizational scale must be fully transparent. Silent scheduling, hidden dependencies, or untraced execution violate Founder Constitution Article IV (Traceability) and executive trust requirements.

## Decision

1. Every runtime action records a `RuntimeExplainability` record with 12 mandatory fields
2. Heartbeat cycles generate explainability via `recordHeartbeat()`
3. Audit entries are append-only with correlation/trace IDs
4. API: `GET /runtime/:companyId/explain/:actionId`
5. Mission Control widgets: runtime-audit, runtime-activity, runtime-timeline

## Consequences

- All orchestration is traceable from trigger to completion
- Certification gate `orchestration_auditable` validates audit trail
- Runtime explainability is independent of executive explainability

## Non-negotiables

- No silent orchestration
- Every action carries correlation ID, trace ID, version, and audit reference

## Bedrock Extension Test

Executive explainability covers reasoning — runtime explainability covers orchestration. Both required; neither replaces the other.
