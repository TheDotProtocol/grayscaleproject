# Executive Council Architecture

**Project Grayscale — Platform Architecture for Executive Collaboration**

**Version:** 1.0.0 (Sprint 3 Phase A — contracts only)  
**Status:** Architecture Lock compliant — **no runtime implementation**  
**Foundation:** Bedrock v1.0.0-bedrock (FROZEN)

---

## Purpose

Define provider-agnostic, event-driven platform contracts for the Executive Council **before** any runtime implementation (Phase B).

The Council is organizational governance—not multi-agent chat.

---

## Architectural Position

```
Bedrock (FROZEN)
├── Executive Runtime        ← lifecycle, bus (existing)
├── CompanyContext           ← single assembly (existing)
├── Organizational Intelligence
└── Mission Control          ← council widgets (reserved)

Sprint 3 Phase A (NEW — contracts only)
└── @grayscale/platform/council
    ├── Roles & membership
    ├── Sessions & issues
    ├── Evidence & deliberation
    ├── Voting & consensus
    ├── Resolutions & decisions
    ├── Governance & evolution
    ├── History, audit, replay
    └── Trust & conflict resolution

Sprint 3 Phase B (FUTURE — runtime)
└── backend/src/modules/executive-council-runtime/
    Implements council ports via events — no Bedrock modification
```

---

## Design Principles

| Principle | Rule |
|-----------|------|
| Provider-agnostic | Ports in `@grayscale/platform`; implementations swappable |
| Event-driven | All state transitions emit catalog events |
| Immutable history | Append-only council record |
| No LLM pass/fail | Certification and consensus are deterministic |
| Organization-owned | Council data ≠ executive notebook |
| Founder sovereignty | Resolutions are recommendatory until approved |

---

## Platform Contracts (Phase A)

Location: `packages/platform/src/council/`

| Contract | Purpose |
|----------|---------|
| `ExecutiveCouncilFoundationPort` | Phase B implementation target (full council) |
| `CouncilMember` | Executive membership and roles |
| `CouncilSession` | Bounded deliberation container |
| `CouncilIssue` | Issue under deliberation |
| `CouncilEvidence` | Evidence attachment and evaluation |
| `CouncilDeliberation` | Structured deliberation record |
| `CouncilVote` | Vote with evidence citation |
| `CouncilConsensus` | Measured consensus outcome |
| `CouncilMinorityOpinion` | Preserved dissent |
| `CouncilResolution` | Council output before Founder review |
| `CouncilDecision` | Approved organizational decision |
| `CouncilExplanation` | Full explainability trace |
| `CouncilGovernance` | Rules, compliance, escalation |
| `CouncilEvolution` | Membership changes |
| `CouncilHealth` | Session and council vitality |
| `CouncilMetrics` | Consensus score, participation |
| `CouncilHistory` | Historical record |
| `CouncilReplay` | Deterministic session replay |
| `CouncilAudit` | Compliance audit trail |
| `CouncilTrust` | Trust-weight deliberation context |
| `CouncilConflictResolution` | Responsibility conflicts |
| `CouncilResponsibility` | Domain ownership map |
| `CouncilEscalation` | Founder escalation |
| `CouncilOverride` | Founder override record |

**Note:** Sprint 2 `ExecutiveCouncilPort` in `executive/executive-council.ts` remains the **messaging bus subset**. Phase B unifies messaging under the foundation port.

---

## Relationship to Sprint 2

| Sprint 2 | Sprint 3 Phase A | Sprint 3 Phase B |
|----------|------------------|------------------|
| Council messaging stub | Full constitutional contracts | Runtime implementation |
| `executive-council.ts` bus | `council/` module | Event-driven council service |
| Council prep types | Governance model | ECS council gates |

**No changes** to Athena, Bedrock, or executive runtime in Phase A.

---

## Event Model (Preview — Phase B)

Council events extend the platform catalog additively:

- `council.session.started`
- `council.issue.opened`
- `council.evidence.submitted`
- `council.deliberation.recorded`
- `council.vote.cast`
- `council.consensus.measured`
- `council.resolution.proposed`
- `council.decision.approved`
- `council.founder.override`

---

## Mission Control (Reserved)

Widget contracts: `packages/platform/src/mission-control/council-widgets.ts`

UI and data providers deferred to Phase B.

---

## Phase B Readiness Checklist

- [x] Executive Council Constitution
- [x] Architecture contracts
- [x] Decision lifecycle definition
- [x] Governance model
- [x] Explainability model
- [x] ADR-035
- [ ] Council runtime service
- [ ] Event catalog entries
- [ ] ECS council gates
- [ ] Mission Control data providers

---

*Companion documents:* `EXECUTIVE_COUNCIL_CONSTITUTION.md`, `COUNCIL_DECISION_LIFECYCLE.md`, `COUNCIL_GOVERNANCE_MODEL.md`, `COUNCIL_EXPLAINABILITY.md`
