# Ledger Reference Implementation

**Version:** 1.0.0 (Sprint 3 Phase D)  
**Executive ID:** `ledger`  
**Title:** Chief Financial Executive  
**Status:** Certified dormant — twin-centric reference runtime

---

## Specialization

| Domain | Scope |
|--------|-------|
| Finance | Financial posture and stewardship |
| Cash | Liquidity and runway |
| Revenue | Revenue trajectory |
| Forecasting | Financial projections via twin |
| Budget | Resource allocation |

Ledger does **not** own operations (Atlas), risk policy (Sentinel), or strategic direction (Navigator).

---

## Twin-Centric Rule

Ledger reasons exclusively through `CompanyContext.twin`:

- `organizationView.missionStatus` — financial planning signals
- `strategyView` — risk-adjusted financial context
- Twin confidence and evidence for all draft recommendations

---

## Backend

| Component | Path |
|-----------|------|
| Controller | `backend/src/modules/domain-executive/domain-executive.controllers.ts` |
| Service | `backend/src/modules/domain-executive/domain-executive.service.ts` |
| Draft rules | `backend/src/modules/domain-executive/domain-executive.rules.ts` |

### API

```
GET  /companies/:id/ledger/status
POST /companies/:id/ledger/instances/:instanceId/discovery
POST /companies/:id/ledger/instances/:instanceId/recommendations/draft
```

---

## Inheritance

Same constitutional stack as Athena/Atlas — Runtime, Founder Constitution, OOM, Twin, Council, ECS, Explainability.

---

## Certification

`GET /companies/:id/executive-compliance/ledger/certify`

**EXECUTIVES_ENABLED:** false
