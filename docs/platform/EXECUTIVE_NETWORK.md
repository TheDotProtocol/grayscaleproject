# Executive Network

**Version:** 1.0.0 (Sprint 3 Phase D)  
**Constitution:** `EXECUTIVE_NETWORK_CONSTITUTION.md`

---

## Purpose

The Organizational Executive Network models how constitutional executives relate over the lifetime of the organization — dependencies, trust, collaboration frequency, shared responsibilities, risks, and opportunities.

---

## Platform Contracts

| Type | Location |
|------|----------|
| `ExecutiveNetwork` | `packages/platform/src/executive/executive-network.ts` |
| `ExecutiveNetworkPort` | Same |
| `ExecutiveDependency` | Dependency edges between executives |
| `ExecutiveTrustEdge` | Trust propagation via collaboration evidence |
| `ExecutiveCoverage` | Domain and decision-class coverage |

---

## Backend

| Service | Path |
|---------|------|
| `ExecutiveNetworkService` | `backend/src/modules/executive-network/` |
| Widget data | `backend/src/modules/mission-control/executive-network-widget-data.service.ts` |

### API

```
GET /companies/:id/executive-network
GET /companies/:id/executive-network/dependencies/:executiveId
```

---

## Roster (Phase D)

| ID | Title |
|----|-------|
| athena | Chief Executive Strategist (reference) |
| atlas | Chief Operations Executive |
| ledger | Chief Financial Executive |
| mercury | Chief Communications Executive |
| sentinel | Chief Risk & Security Executive |
| navigator | Chief Strategy Executive |
| forge | Chief Innovation Executive |

Registry: `packages/platform/src/executive/executive-registry.ts`

---

## Mission Control Widgets

15 network widgets registered in `EXECUTIVE_NETWORK_WIDGETS` — network overview, health, trust, dependencies, coverage, council collaboration, decision confidence, and more.

---

## Lifecycle States

`registered` → `certifying` → `certified_dormant` → `active` (Founder) → `suspended` → `retired`

All Phase D executives remain `certified_dormant` while `EXECUTIVES_ENABLED=false`.
