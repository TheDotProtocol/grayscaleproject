# ADR-070: Organizational Runtime

**Status:** Accepted  
**Date:** 2026-07-26  
**Sprint:** Sprint 4 — Phase A

## Context

Sprint 3 completed the Organizational Intelligence stack. The organization can perceive, simulate, forecast, and reason — but it cannot **continuously operate**. Executives, Twin, Simulation, and Forecast modules exist as capabilities without a constitutional orchestration layer.

Sprint 4 Phase A introduces the Organizational Operating System (OrgOS) — not new intelligence, but the runtime that brings existing capabilities to life.

## Decision

1. Create `docs/platform/ORGANIZATIONAL_RUNTIME.md` as immutable constitutional document
2. Position it in hierarchy after OOM, before ONS and executive constitutions
3. Implement platform contracts in `packages/platform/src/runtime/` (interface-first, no implementations)
4. Implement reference orchestration in `backend/src/modules/runtime/`
5. Wire CompanyContext fields: `organizationalRuntime`, `runtimeHealth`, `runtimeMetrics`
6. Register 19 Mission Control widget contracts (UI deferred)

## Consequences

- Organization can operate continuously via deterministic heartbeat and scheduling
- Executives become consumers of runtime — they never schedule themselves
- Runtime never performs organizational reasoning
- Context version bumps to `2.0.0-s4a-org-runtime`

## Non-negotiables

- Bedrock frozen
- No duplicate storage
- No business logic in runtime
- Runtime never becomes an executive

## Bedrock Extension Test

Bedrock provides executive runtime framework, event store, and context assembly — but not organizational-level orchestration across all sub-runtimes. OrgOS is a new constitutional layer above Bedrock modules, not a Bedrock rewrite.
