# ADR-028: Executive Notebook

**Status:** Accepted | **Date:** 2026-07-25 | **Phase:** Sprint 2 Phase B

## Context
Executives need private reasoning storage separate from Organizational Memory. Notebook entries are observations, hypotheses, and reflections — NOT recommendations.

## Decision
`ExecutiveNotebookPort` in `@grayscale/platform`. Immutable append-only entries with versioning, graph/memory links, event sourcing via `executive.notebook.*` events. Backend: `ExecutiveNotebookModule`.

## Consequences
Positive: Executive reasoning auditable without polluting company memory. Negative: Additional storage per executive.

## Compliance
ARCHITECTURE_LOCK.md — additive only. Bedrock Memory Engine unchanged.

## Out of Scope
Cross-executive notebook sharing; LLM-generated entries.

## References
`packages/platform/src/executive/notebook.ts`, `backend/src/modules/executive-notebook/`
