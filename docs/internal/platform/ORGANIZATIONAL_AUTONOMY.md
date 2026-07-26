# Organizational Autonomy

**Version:** 1.0.0 (Sprint 4)  
**Constitution:** `ORGANIZATIONAL_EVOLUTION_CONSTITUTION.md`

---

## Principle

Automation exists only where explicitly approved. Autonomy never overrides constitutional governance.

## Every Autonomous Action Requires

- Founder policy reference
- Risk assessment
- Confidence threshold
- Rollback capability
- Audit record
- Explainability
- Timestamp

## Platform

`packages/platform/src/organization/autonomy-framework.ts`

## Backend

`AutonomyFrameworkService` — proposePolicy, approvePolicy, recordAction, getReadiness

## API

```
GET /companies/:id/organizational-evolution/autonomy
GET /companies/:id/organizational-evolution/autonomy/readiness
```

## Events

`organizational-autonomy.policy.approved`, `organizational-autonomy.action.recorded`

---

*EXECUTIVES_ENABLED remains false. Autonomy policies require Founder approval.*
