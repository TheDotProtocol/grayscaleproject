# Runtime Certification

**Organizational Runtime — ECS Certification Specification**

**Version:** 1.0.0  
**Status:** Certification companion to `ORGANIZATIONAL_RUNTIME.md`

---

## Certification Rule

Runtime is **certified** only when:

1. All 11 ECS gates pass
2. Composite score ≥ 90
3. `SPRINT4_PHASE_A_CERTIFICATE.md` issued

Certification is **deterministic** — same inputs produce same gate results.

---

## ECS Gates

| # | Gate | Validation |
|---|------|------------|
| 1 | `heartbeat_stable` | Heartbeat configurable, deterministic step order |
| 2 | `schedulers_deterministic` | All 7 schedule modes registered |
| 3 | `no_circular_orchestration` | Coordinator delegates to sub-runtimes only |
| 4 | `no_duplicate_execution` | Executed task IDs tracked |
| 5 | `runtime_health_explainable` | Health score computed with issues array |
| 6 | `orchestration_auditable` | Append-only audit trail exists |
| 7 | `constitutional_hierarchy_respected` | ORGANIZATIONAL_RUNTIME.md in hierarchy |
| 8 | `no_business_logic_in_runtime` | Orchestration only — no reasoning |
| 9 | `executives_not_schedulers` | Runtime owns all scheduling |
| 10 | `event_driven_coordination` | `runtime.heartbeat.completed` published |
| 11 | `version_integrity` | `ORGANIZATIONAL_RUNTIME_VERSION` consistent |

---

## API

```
GET /runtime/:companyId/certification
```

Returns `RuntimeCertificationReport`:

```typescript
{
  companyId: string;
  generatedAt: string;
  passed: boolean;
  score: number;        // 0-100
  checks: RuntimeCertificationCheck[];
  version: string;
}
```

---

## Event

On certification pass, publish `runtime.certified` with report summary.

---

## Relationship to Executive Certification

| Certification | Scope |
|---------------|-------|
| Executive ECS | Individual executive activation |
| Runtime ECS | Organizational orchestration layer |

Runtime certification is **independent** of `EXECUTIVES_ENABLED`. OrgOS must be certified before executives operate continuously.

---

## Re-Certification

Required when:

- Runtime version bump
- New schedule mode added
- Heartbeat step order changed
- Constitutional hierarchy modified

Each re-certification requires ADR and version bump.
