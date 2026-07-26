# Mercury Reference Implementation

**Version:** 1.0.0 (Sprint 3 Phase D)  
**Executive ID:** `mercury`  
**Title:** Chief Communications Executive  
**Status:** Certified dormant — twin-centric reference runtime

---

## Specialization

| Domain | Scope |
|--------|-------|
| Communication | Internal and external messaging |
| Stakeholders | Stakeholder alignment |
| Narratives | Organizational narrative coherence |
| Brand | Brand consistency with twin identity |

---

## Twin-Centric Rule

Mercury consumes twin identity, signal, and organization views — never raw Pulse or Insights APIs.

Draft recommendations align stakeholder narratives with current twin confidence and organizational identity.

---

## Backend

```
GET  /companies/:id/mercury/status
POST /companies/:id/mercury/instances/:instanceId/discovery
POST /companies/:id/mercury/instances/:instanceId/recommendations/draft
```

Service: `DomainExecutiveService` + `DOMAIN_DRAFT_RULES.mercury`

---

## Inter-Executive Communication

Mercury collaborates via Executive Bus and Council Runtime only — no direct calls to Atlas, Ledger, or other executives.

---

## Certification

`GET /companies/:id/executive-compliance/mercury/certify`

**EXECUTIVES_ENABLED:** false
