# Intelligence API

Phase 1.5D — Strategic Intelligence Framework Mission Control endpoints.

Base path: `/companies/:companyId/intelligence`

All endpoints require JWT authentication.

## Summary & Orchestration

| Method | Path | Description |
|--------|------|-------------|
| GET | `/summary` | Full `StrategicIntelligenceContext` assembled by Strategy Engine |
| GET | `/engines` | Dynamically registered intelligence engines (AIP-10) |
| GET | `/analysis` | Risk, opportunity, and dependency analysis |
| GET | `/priorities` | Ranked priority scores for open recommendations |
| POST | `/evaluate-rules` | Run deterministic rule evaluator (billing, integration, goals) |

## Operating Mode

| Method | Path | Description |
|--------|------|-------------|
| GET | `/operating-mode` | Active company operating mode |
| POST | `/operating-mode` | Set mode (`startup`, `growth`, `cash_conservation`, etc.) |

## Goals & Objectives

| Method | Path | Description |
|--------|------|-------------|
| GET | `/goals` | List active goals |
| POST | `/goals` | Create goal (emits `goal.created`) |
| GET | `/objectives` | List objectives |
| POST | `/objectives` | Create objective |

## Recommendations

| Method | Path | Description |
|--------|------|-------------|
| GET | `/recommendations` | List open recommendations |
| GET | `/recommendations/:id` | Get recommendation by ID |
| POST | `/recommendations` | Create recommendation (emits `recommendation.generated`) |
| POST | `/recommendations/:id/status` | Update status with audit trail |

## Decisions, Policies, Constraints, Scenarios

| Method | Path | Description |
|--------|------|-------------|
| POST | `/decisions` | Record a decision |
| GET/POST | `/policies` | List/create decision policies |
| GET/POST | `/constraints` | List/upsert strategic constraints |
| GET/POST | `/scenarios` | List/create scenario plans |
| POST | `/priority-config` | Upsert hierarchical priority weights (AIP-13) |

## Architecture Notes

- **AIP-10:** Engines register dynamically via `IntelligenceEngineRegistryService`
- **AIP-11:** Strategic entities projected to Knowledge Graph via `StrategicGraphProjector`
- **AIP-12:** All reasoning is rule-based — no LLM in this layer
- **AIP-13:** Priority config resolves Company → Department → Executive → Founder

See [ADR-009](../architecture/ADR-009-strategic-intelligence-framework.md) for full architecture.
