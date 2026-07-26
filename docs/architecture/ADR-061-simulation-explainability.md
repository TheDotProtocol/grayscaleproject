# ADR-061: Simulation Explainability

**Status:** Accepted | **Date:** 2026-07-26

## Decision

Adopt `SimulationExplainability` contract requiring starting assumptions, evidence, policies, constraints, twin state, homeostasis/stress/capacity changes, confidence, unknowns, alternatives, and rollback assumptions. No hidden reasoning.

## Consequences

Mission Control simulation widgets can surface explainability when UI ships. Certification gate `explainability_complete` enforced.
