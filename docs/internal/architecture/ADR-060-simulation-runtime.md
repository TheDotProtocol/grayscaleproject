# ADR-060: Simulation Runtime

**Status:** Accepted | **Date:** 2026-07-26

## Decision

Implement simulation runtime in `twin-runtime` module: `SimulationSessionService`, `SimulationRunnerService`, `SimulationContextService`. Ports split across `simulation-runtime-ports.ts`. Deterministic hash-seeded pipeline consumes twin + homeostasis.

## Consequences

- Full lifecycle stages recorded with audit trail
- Replay from audit events
- Context assembler `simulation` at v1.8.0-s3c-simulation
