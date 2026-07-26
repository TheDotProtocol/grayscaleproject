# Organizational Reflection Engine

**Version:** 1.0.0 (Sprint 4)

---

## Principle

The organization evaluates itself periodically. Reflection generates **observations only** — never recommendations.

## Categories

- Failed assumptions
- Forecast inaccuracy
- Executive performance patterns
- Confidence calibration
- Attention drift
- Recurring bottlenecks
- Organizational debt
- Ignored opportunities

## Platform

`packages/platform/src/organization/reflection-engine.ts`

## Backend

`ReflectionEngineService` — reflect, list, getMetrics, runPeriodicReflection

## API

```
GET  /companies/:id/organizational-evolution/reflection
POST /companies/:id/organizational-evolution/reflection/run
GET  /companies/:id/organizational-evolution/reflection/metrics
```

## Event

`organizational-reflection.completed`
