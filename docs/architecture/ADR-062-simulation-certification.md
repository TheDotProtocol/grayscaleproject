# ADR-062: Simulation Certification

**Status:** Accepted | **Date:** 2026-07-26

## Decision

11 deterministic certification gates (`SIMULATION_ECS_GATES`). `SimulationCertificationService` validates replay determinism, explainability, scenario reproducibility, policy/constraint compliance, homeostasis validation, audit/version validation, twin sync, reality protection. Score ≥ 90 required.

## Consequences

Simulation not production-ready until certification passes. No LLM in certification path.
