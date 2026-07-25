# Temporal Intelligence

**Project Grayscale — How the Organization Evolved**

**Version:** 1.0  
**Status:** Constitutional — Sprint 2 Phase A.4  
**ADR:** ADR-025

---

## Purpose

Understand organizational evolution — **not merely current state**.

Questions answered:

- How did we arrive here?
- When did momentum improve?
- What caused decline?
- How has culture evolved?
- How has founder confidence changed?
- Which strategic decisions worked? Which failed?

**No forecasting.** Only explain historical evolution.

---

## Capabilities

| Capability | Description |
|------------|-------------|
| Organization Timeline | Chronological evolution |
| Historical Snapshots | Weekly, monthly, quarterly, yearly |
| Trend Analyzer | Direction and magnitude with evidence |
| Pattern Detector | Recurring behavioural patterns |
| Trajectory Engine | Historical path analysis |
| Regression Detection | Decline identification |
| Acceleration Detection | Improvement identification |
| Milestone History | Significant organizational moments |
| Evolution Index | Composite evolution score |
| Organization Age | Days since founding |
| Growth Phases | Named organizational periods |
| Historical Comparisons | Current vs prior period |

---

## Snapshots (Immutable)

Organizational snapshots capture point-in-time state:

DNA, Founder DNA, Emotion, Cognition, Learning, Wisdom, Culture, Reputation, Adaptation, Intent, Strategy, Goals, Recommendations, Readiness, Platform Health, Reliability, Pulse, Security, Governance, Integrations, Events, Graph, Memory, Timeline.

**Never recompute history.** Snapshots are immutable references.

Contract: `packages/platform/src/temporal/snapshots.ts`

---

## Contract

`packages/platform/src/temporal/temporal-engine.ts` — `TemporalEnginePort`

---

## Events

- `temporal.snapshot.captured`
- `temporal.trend.detected`
- `temporal.pattern.detected`
- `organizational-snapshot.captured`

---

*History is evidence. The future is Athena's job — after certification.*
