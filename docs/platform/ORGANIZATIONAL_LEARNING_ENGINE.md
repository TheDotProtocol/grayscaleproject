# Organizational Learning Engine

**Version:** 1.0.0 (Sprint 4)  
**ADR:** ADR-018 (contract), ADR-048 (runtime)

---

## Principle

Learning belongs to the **organization** — not Athena, not individual executives. Executives contribute learning; the organization owns it.

## Learning Record Requirements

Every record includes: evidence, confidence, validation, impact, source, timestamp, version.

## Sources

Executive recommendations, council outcomes, founder overrides, project outcomes, reality vs forecast, simulation results, operational/financial/risk/customer outcomes.

## Platform

`packages/platform/src/organization/organizational-learning.ts` — `OrganizationalLearningEnginePort`

## Backend

`OrganizationalLearningEngineService` — record, validate, timeline, health metrics.

## API

```
GET  /companies/:id/organizational-evolution/learning
POST /companies/:id/organizational-evolution/learning
POST /companies/:id/organizational-evolution/learning/:id/validate
```

## Events

`organizational-learning.recorded`, `organizational-learning.validated`, `organizational-learning.linked`
