# ADR-071: Runtime Scheduling

**Status:** Accepted  
**Date:** 2026-07-26  
**Sprint:** Sprint 4 — Phase A

## Context

Multiple sub-runtimes (Context, Executive, Council, Twin, Simulation, Forecast, Memory, Graph) require coordinated scheduling. Without a single scheduling authority, executives or ad-hoc timers would schedule themselves — violating constitutional separation.

## Decision

1. Runtime Scheduler owns all orchestration scheduling
2. Support 7 modes: continuous, scheduled, event_driven, manual, maintenance, deferred, priority
3. Executive Scheduler and Council Scheduler are runtime responsibilities (session coordination, not reasoning)
4. Duplicate execution prevented via executed task ID tracking
5. `RuntimeSchedulerPort` defined in platform contracts; `RuntimeSchedulerService` in backend

## Consequences

- Single scheduling authority eliminates race conditions and circular triggers
- Mission Control exposes scheduler state via widget contracts
- Executives request attention through inbox/context — not scheduler APIs

## Non-negotiables

- Executives never schedule themselves
- All modes must be registered for certification

## Bedrock Extension Test

Bedrock executive runtime manages individual executive lifecycle — not cross-runtime orchestration scheduling. OrgOS scheduler is additive.
