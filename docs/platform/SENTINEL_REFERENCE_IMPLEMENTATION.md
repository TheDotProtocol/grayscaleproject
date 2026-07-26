# Sentinel Reference Implementation

**Version:** 1.0.0 (Sprint 3 Phase D)  
**Executive ID:** `sentinel`  
**Title:** Chief Risk & Security Executive  
**Status:** Certified dormant — twin-centric reference runtime

---

## Specialization

| Domain | Scope |
|--------|-------|
| Risk | Critical risk identification |
| Compliance | Regulatory and policy compliance |
| Security | Security posture |
| Governance | Governance enforcement |

---

## Twin-Centric Rule

Sentinel reads `strategyView.criticalRisks` and twin evidence — never direct Strategy Engine or Signals queries.

Risk recommendations are explainable through twin version, evidence count, and confidence.

---

## Backend

```
GET  /companies/:id/sentinel/status
POST /companies/:id/sentinel/instances/:instanceId/discovery
POST /companies/:id/sentinel/instances/:instanceId/recommendations/draft
```

---

## Council Role

Sentinel participates in council deliberation with structured evidence, minority opinions, and dissent preservation.

---

## Certification

`GET /companies/:id/executive-compliance/sentinel/certify`

**EXECUTIVES_ENABLED:** false
