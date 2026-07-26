# ADR-047: Memory Evolution Engine

**Status:** Accepted | **Date:** 2026-07-26

## Decision

Implement memory evolution as additional layers over immutable memory — six stages from observation to institutional principle. Never mutate source memory records.

## Consequences

`MemoryEvolutionPort` + backend service. Event: `memory-evolution.layer.created`.
