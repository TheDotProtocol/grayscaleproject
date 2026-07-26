# Executive Network

**Version:** 2.0.0 (Sprint 4 Phase B)  
**Constitution:** `EXECUTIVE_COLLABORATION.md`, `EXECUTIVE_NETWORK_CONSTITUTION.md`

---

## Purpose

The Organizational Executive Network models how constitutional executives relate — dependencies, trust, collaboration frequency, shared responsibilities, risks, and opportunities.

**Sprint 4 Phase B extension:** All inter-executive communication flows through the **Executive Collaboration Network**. No executive communicates outside this network.

---

## Collaboration Request Kinds

| Kind | Purpose |
|------|---------|
| `opinion_request` | Request specialized perspective |
| `evidence_request` | Request supporting evidence |
| `knowledge_request` | Request institutional knowledge |
| `challenge_request` | Formal respectful challenge |
| `review_request` | Request review of position |
| `policy_question` | Clarify policy applicability |
| `delegation` | Request delegated analysis (not authority) |
| `escalation` | Escalate to Founder or chair |
| `consensus_vote` | Structured consensus voting |
| `minority_opinion` | Preserve minority position |
| `dissent_report` | Formal dissent with evidence |

Contract: `collaboration-network.ts`

---

## Platform Contracts

| Type | Location |
|------|----------|
| `ExecutiveNetwork` | `executive/executive-network.ts` |
| `ExecutiveCollaborationNetworkPort` | `council/collaboration-network.ts` |
| `CollaborationRequest` | Network request envelope |

---

## Backend

| Service | Path |
|---------|------|
| `ExecutiveNetworkService` | `executive-network/` — network assembly |
| `ExecutiveCollaborationNetworkService` | `council-runtime/` — request routing |

### API

```
GET  /companies/:id/executive-network
POST /companies/:id/council/collaboration/requests
GET  /companies/:id/council/collaboration/requests
```

---

## Roster (Phase D — Dormant)

| ID | Title |
|----|-------|
| athena | Chief Executive Strategist (reference) |
| atlas | Chief Operations Executive |
| ledger | Chief Financial Executive |
| mercury | Chief Communications Executive |
| sentinel | Chief Risk & Security Executive |
| navigator | Chief Strategy Executive |
| forge | Chief Innovation Executive |

All remain `certified_dormant` while `EXECUTIVES_ENABLED=false`.

---

## Mission Control Widgets

Phase B widgets: `executive-network-v2`, `collaboration-heatmap`, `executive-availability`, `executive-trust-v2`, `open-challenges`, `evidence-flow`

---

## Lifecycle States

`registered` → `certifying` → `certified_dormant` → `active` (Founder) → `suspended` → `retired`
