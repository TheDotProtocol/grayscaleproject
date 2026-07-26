# Organizational Twin Architecture

**Sprint 3 Phase C** | ADR-039

## Overview

One canonical `OrganizationalTwin` per company. Time-aware via temporal scopes (`past`, `present`, `future`) on the same model — no duplicate state stores.

## Layers

| Layer | Location | Role |
|-------|----------|------|
| Constitutional | `LIVING_ORGANIZATIONAL_TWIN.md` | Principles |
| Contracts | `packages/platform/src/twin/` | Types + port |
| Simulation | `packages/platform/src/simulation/` | Isolated what-if |
| Forecast | `packages/platform/src/forecast/` | Hypotheses only |
| Runtime | `backend/src/modules/twin-runtime/` | Assembly + services |

## Data Flow

```
Events → Twin Store → OrganizationalTwinService.assemble()
                              ↓
                    CompanyContext.twin (read-only)
                              ↓
              Athena Discovery / Future Executives
```

## Reality Protection

- Simulations: `realityModified: false` (immutable type)
- Forecasts: `isHypothesis: true`, `overwritesReality: false`
- `TwinRealityComparison.realityWins: true` (always)
