# Simulation Runtime

**Version:** 1.1.0 | **Module:** `packages/platform/src/simulation/` | **Backend:** `backend/src/modules/twin-runtime/`

## Ports

| Port | Implementation |
|------|----------------|
| `SimulationEnginePort` / `SimulationRuntimePort` | `SimulationSessionService` |
| `SimulationRunnerPort` | `SimulationRunnerService` |
| `SimulationScenarioPort` | `SIMULATION_SCENARIO_LIBRARY` |
| `SimulationContextPort` | `SimulationContextService` |
| `SimulationCertificationPort` | `SimulationCertificationService` |
| `SimulationReplayPort` | `SimulationSessionService.replay()` |
| `SimulationAuditPort` | Session `auditTrail` |
| `SimulationHistoryPort` | `getHistory()` |
| `SimulationComparisonPort` | `compareOutcomes()` |
| `SimulationExplainabilityPort` | `simulation-explainability.ts` |
| `SimulationMetricsPort` | `getMetrics()` / `getAggregateMetrics()` |
| `SimulationVersionPort` | `engineVersion` + `pipelineVersion` on session |

## Pipeline

Deterministic hash-seeded pipeline in `SimulationRunnerService`:

1. Resolve twin from store by `twinVersionId`
2. Capture homeostasis baseline
3. Execute `SIMULATION_PIPELINE_STAGES`
4. Apply scenario stress multiplier deterministically
5. Generate baseline + alternative outcomes
6. Record risk/opportunity assessments
7. Append audit trail per stage

## API

`TwinRuntimeController`: `GET/POST .../twin/simulations`, `POST .../simulations/:id/run`, `GET .../twin/scenarios`

## CompanyContext

Assembler `simulation` → `SimulationContextService.assemble()`  
Context version: `1.8.0-s3c-simulation`
