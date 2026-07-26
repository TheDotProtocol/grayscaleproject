# Atlas Reference Implementation

**Version:** 1.0.0 (Sprint 3 Phase D)  
**Executive ID:** `atlas`  
**Title:** Chief Operations Executive  
**Status:** Certified dormant — twin-centric reference runtime

---

## Specialization

| Domain | Scope |
|--------|-------|
| Operations | Day-to-day operational rhythm |
| Execution | Delivery and workflow completion |
| Capacity | Organizational throughput |
| Workflow | Process coordination |
| Delivery | Outcome fulfillment |

Atlas does **not** own finance (Ledger), risk (Sentinel), strategy (Navigator), communications (Mercury), or innovation (Forge).

---

## Twin-Centric Rule

Atlas reasons exclusively through `CompanyContext.twin`. Source systems (Memory, Graph, Strategy, Signals, Insights, Pulse, Intent, OI) are never queried directly.

Key twin views consumed:

- `strategyView.openRecommendations` — operational backlog
- `organizationView.missionStatus` — execution health
- `memoryView`, `graphView` — evidence via twin only

---

## Backend

| Component | Path |
|-----------|------|
| Controller | `backend/src/modules/domain-executive/domain-executive.controllers.ts` |
| Service | `backend/src/modules/domain-executive/domain-executive.service.ts` |
| Draft rules | `backend/src/modules/domain-executive/domain-executive.rules.ts` |

### API

```
GET  /companies/:id/atlas/status
POST /companies/:id/atlas/instances/:instanceId/discovery
POST /companies/:id/atlas/instances/:instanceId/recommendations/draft
```

---

## Inheritance

- Executive Runtime
- Founder Constitution
- Organizational Operating Model
- Executive Manifesto / Philosophy / Certification
- Living Organizational Twin
- Executive Council
- Executive Compliance Suite
- Explainability

---

## Certification

`GET /companies/:id/executive-compliance/atlas/certify` — deterministic ECS gates including twin presence, council readiness, and collaboration contracts.

**EXECUTIVES_ENABLED:** false — Atlas remains dormant until Founder activation.
