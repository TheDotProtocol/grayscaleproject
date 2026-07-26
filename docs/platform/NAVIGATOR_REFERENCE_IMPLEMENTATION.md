# Navigator Reference Implementation

**Version:** 1.0.0 (Sprint 3 Phase D)  
**Executive ID:** `navigator`  
**Title:** Chief Strategy Executive  
**Status:** Certified dormant — twin-centric reference runtime

---

## Specialization

| Domain | Scope |
|--------|-------|
| Long-term strategy | Strategic direction |
| Scenario comparison | Twin-backed scenario analysis |
| Trade-offs | Strategic trade-off evaluation |

Navigator consumes Simulation Engine and Scenario Planning outputs **through the twin** — never directly.

---

## Twin-Centric Rule

Navigator uses twin timeline, intent themes, and strategy views for navigation recommendations.

---

## Backend

```
GET  /companies/:id/navigator/status
POST /companies/:id/navigator/instances/:instanceId/discovery
POST /companies/:id/navigator/instances/:instanceId/recommendations/draft
```

---

## Distinction from Athena

Athena remains the reference executive for discovery pipeline mechanics. Navigator owns long-horizon strategic trade-offs and scenario comparison — not operational discovery.

---

## Certification

`GET /companies/:id/executive-compliance/navigator/certify`

**EXECUTIVES_ENABLED:** false
