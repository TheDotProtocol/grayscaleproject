# Council Collaboration

**Version:** 1.0.0 (Sprint 3 Phase D)  
**Constitution:** `EXECUTIVE_COUNCIL_CONSTITUTION.md`

---

## Purpose

True constitutional collaboration — council sessions with structured evidence, disagreements, minority opinions, consensus, founder escalation, tie breaking, and full replay.

Every deliberation is explainable.

---

## Collaboration Stages

```
session_opened → evidence_gathering → deliberation → voting → consensus
  → minority_preserved → founder_escalation → tie_break → conflict_resolution
  → decision_recorded → replay_available
```

Contract: `CouncilCollaborationStage` in `packages/platform/src/council/collaboration.ts`

---

## Structured Contributions

`CouncilExecutiveContribution` — NOT free-form chat:

- evidence, reasoning, confidence, assumptions
- risks, supporting/contradicting evidence
- alternatives, unknowns

---

## Voting

Council vote values: `approve` | `reject` | `abstain` | `defer`

Minority opinions preserved with rationale and evidence refs.

---

## Backend

| Service | Path |
|---------|------|
| `CouncilCollaborationService` | `backend/src/modules/council-runtime/council-collaboration.service.ts` |

### API

```
GET /companies/:id/council/collaboration
GET /companies/:id/council/collaboration/participation
GET /companies/:id/council/collaboration/conflicts
GET /companies/:id/council/sessions/:sessionId/replay
```

---

## Metrics

`CouncilCollaborationMetrics`:

- activeSessions, completedDecisions
- averageConsensus, escalationRate
- minorityPreservationRate, replayConsistency

---

## Council Membership

Default council: all 7 Phase D executives (`council-store.service.ts`).

Quorum and certification governed by `COUNCIL_CERTIFICATION.md`.

---

## Twin Binding

Every collaboration session records `twinVersionId` — deliberations bound to organizational truth at decision time.
