# ADR-042: Twin-Centric Executive Reasoning

**Status:** Accepted | **Date:** 2026-07-26

## Context

Phase C introduced the Living Organizational Twin. Phase D expands to seven executives. Without a single reasoning surface, executives would fragment organizational truth.

## Decision

Beginning Phase D, all executives (including Council, Simulation, Forecast, Scenario Planning, and every future executive) reason **exclusively** through `CompanyContext.twin`.

Source systems (Memory, Graph, Strategy, Signals, Insights, Pulse, Goals, Intent, Organizational Intelligence) remain source-only. Reality updates the Twin first.

## Enforcement

- Platform: `extractTwinReasoning()`, `FORBIDDEN_DIRECT_SOURCES`
- Backend: `DomainExecutiveService.ensureContext()` requires twin
- ECS: twin presence, confidence, evidence gates

## Consequences

- One organizational truth, one audit trail, one explainability surface
- Athena reference may still access context fields during migration; Phase D executives are twin-only
- Future executives must implement twin consumption before certification
