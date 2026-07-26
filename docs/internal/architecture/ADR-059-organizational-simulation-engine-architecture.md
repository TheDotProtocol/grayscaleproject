# ADR-059: Organizational Simulation Engine Architecture

**Status:** Accepted | **Date:** 2026-07-26 | **Sprint:** 3 Phase C

## Decision

Adopt `ORGANIZATIONAL_SIMULATION_ENGINE.md` as immutable constitutional document. The organization — not executives or LLMs — is the simulation subject.

Extend simulation contracts (v1.1.0), deterministic pipeline, homeostasis integration, CompanyContext simulation fields, and Mission Control widget reservations.

## Consequences

- Phase D (Scenario Planning) and E (Forecast) consume simulation infrastructure
- Executives observe simulations via context; never own history
- Reality always preserved (`realityModified: false`)

## References

ADR-040, ADR-058, ADR-039, `ORGANIZATIONAL_SIMULATION_ENGINE.md`
