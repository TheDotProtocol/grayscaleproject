# ADR-029: Executive Curiosity Engine

**Status:** Accepted | **Date:** 2026-07-25 | **Phase:** Sprint 2 Phase B

## Context
Executives must continuously generate questions that drive investigations and evidence collection. Curiosity never directly recommends.

## Decision
`ExecutiveCuriosityEnginePort` with question types (why, what_changed, what_is_missing, what_contradicts, what_to_investigate). Questions → investigations → evidence. Backend: `ExecutiveCuriosityModule`.

## Consequences
Positive: Structured inquiry before recommendations. Risk: Question volume — mitigated by resolution workflow.

## Compliance
ADR-014 discovery pipeline; curiosity feeds evidence stage.

## Out of Scope
Autonomous external research; LLM question generation in Phase B.

## References
`packages/platform/src/executive/curiosity-engine.ts`
