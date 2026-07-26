# Sprint 3 Phase C Changelog

**Tag:** `Sprint-3-Phase-C-SimulationEngine-v1.0`  
**Date:** 2026-07-26

## Added

### Platform
- `HomeostasisMetricDetail` — reason, confidence, evidence, trend, history on every score
- Homeostasis v1.1.0 metrics: adaptive capacity, recovery velocity, resilience, balance, cascade resistance, decision/attention saturation, executive/founder load, operational recovery, health momentum
- Simulation v1.1.0: full pipeline stages, risk/opportunity assessment, audit trail on sessions
- `simulation-scenarios.ts`, `simulation-explainability.ts`, `simulation-certification.ts`, `simulation-runtime-ports.ts`
- `SIMULATION_ECS_GATES` (11 certification gates)
- Mission Control `simulation-widgets.ts` (12 additional widget contracts)

### Backend
- `SimulationRunnerService` — deterministic twin + homeostasis pipeline
- `SimulationContextService` — CompanyContext simulation assembly
- `SimulationCertificationService` — deterministic gate validation
- CompanyContext fields: `simulation`, `activeSimulations`, `simulationHealth`, `simulationHistory`, `organizationalHomeostasis`, `simulationCapabilities`, `simulationMetrics`

### Documentation
- `ORGANIZATIONAL_SIMULATION_ENGINE.md` (constitutional)
- `SIMULATION_RUNTIME.md`, `SIMULATION_EXPLAINABILITY.md`, `SIMULATION_CERTIFICATION.md`, `SIMULATION_SCENARIOS.md`, `HOMEOSTASIS_ENGINE.md`
- ADR-059 through ADR-063
- `SPRINT3_PHASE_C_CERTIFICATE.md`, `SIMULATION_CERTIFICATION_REPORT.md`

## Changed

- `HomeostasisEngineService` — expanded deterministic metrics
- `SimulationSessionService` — delegates to runner; full lifecycle + audit
- `company-context-assembler` — context version `1.8.0-s3c-simulation`
- `widget-catalog.service` — simulation MC widgets registered
- `twin-runtime.spec.ts` — 4 tests including replay + homeostasis

## Unchanged

- Bedrock architecture (frozen)
- `EXECUTIVES_ENABLED=false`
- No Prisma in executive layer
- Digital Twin canonical model (ADR-039)
