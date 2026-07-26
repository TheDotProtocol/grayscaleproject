# Forecast Intelligence

**Version:** 1.1.0 (Sprint 3 Phase D)  
**ADR:** ADR-041, ADR-069

> **Constitutional:** Forecasts are hypotheses — not facts. Reality always wins.

## Purpose

Forecast Intelligence projects organizational futures while consuming the full reasoning stack.

## Inputs

Simulation, Twin, Foresight, Alignment, Decision Economy, Antifragility, Temporal Intelligence.

## Outputs

Every forecast includes: evidence, confidence, assumptions, dependencies, unknowns, alternative futures.

`isHypothesis: true`, `overwritesReality: false` — always.

## Contracts

- `TwinForecast` — individual forecast
- `ForecastContextSnapshot` — assembled context slice
- `ForecastIntelligencePort` — generate, validate, supersede, list, explain
- `ForecastContextPort` — assemble for CompanyContext

## Integration

- **CompanyContext.forecast** / **forecastContext**
- Mission Control: `forecast-dashboard`, `forecast-confidence`, `future-timeline`

Forecasts never become recommendations. Recommendations remain exclusively with certified executives.

## AttentionForecast

`AttentionForecast` contract populated when horizon includes attention projections (via forecast service integration).
