# ADR-045: Council Collaboration Model

**Status:** Accepted | **Date:** 2026-07-26

## Context

Phase B established council runtime. Phase D requires true multi-executive collaboration with explainability.

## Decision

Implement `CouncilCollaborationPort` with:

- Structured contributions (not chat)
- Vote values: approve/reject/abstain/defer
- Minority opinion preservation
- Tie-break and responsibility conflict detection
- Participation metrics and replay binding to twin version

Backend: `CouncilCollaborationService` + controller endpoints under `/council/collaboration/*`.

## Consequences

- Council health, trust, and metrics computable
- Responsibility overlaps flagged automatically
- All deliberations auditable and replayable
