# ADR-044: Executive Network Constitution

**Status:** Accepted | **Date:** 2026-07-26

## Context

Council Constitution governs decision-making. A complementary constitution is needed for lifetime executive relationships.

## Decision

Adopt `EXECUTIVE_NETWORK_CONSTITUTION.md` defining:

- Dependency relationships and shared ownership boundaries
- Trust propagation via collaboration evidence
- Delegation and escalation paths
- Executive lifecycle (creation → certification → suspension → retirement)
- Council expansion rules for new executives

Implement `ExecutiveNetwork` model and `ExecutiveNetworkPort` in platform; `ExecutiveNetworkService` in backend.

## Consequences

- Every executive has constitutional place before activation
- Network widgets expose relationships to Mission Control
- Inter-executive communication restricted to Bus, Council, Events
