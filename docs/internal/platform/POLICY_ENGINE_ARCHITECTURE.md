# Policy Engine Architecture

**Sprint 4 Phase D — Organizational Policy Engine + Governance Kernel**

---

## Stack

```
Bedrock PolicyService + ConstraintService (intelligence module)
    ↓
PolicyEvaluationService (deterministic, default deny)
    ↓
GovernanceKernelService (final checkpoint, validates)
    ↓
CompanyContext (policy-engine assembler)
    ↓
Mission Control (15 widget contracts)
    ↓
Executive Compliance Suite (Phase D gates)
```

---

## Module Layout

### Platform (`packages/platform/src/policy/`)

| File | Purpose |
|------|---------|
| `organizational-policy-engine.ts` | Core types, verdicts, snapshots, Sprint 5 extension points |
| `governance-kernel.ts` | Governance state, health, metrics, evaluation result |
| `policy-ports.ts` | 15 interface-first ports |
| `policy-explainability.ts` | Explainability record schema |
| `policy-history.ts` | Append-only history entries |
| `policy-audit.ts` | Audit event schema |
| `policy-certification.ts` | 15 policy ECS gates |
| `governance-certification.ts` | 12 governance ECS gates |
| `policy-widgets.ts` | 15 Mission Control widget definitions |

### Backend (`backend/src/modules/policy-engine/`)

| Service | Role |
|---------|------|
| `PolicyEvaluationService` | Deterministic evaluation; default deny |
| `PolicyEngineConstraintService` | Wraps Bedrock `ConstraintService` |
| `PolicyApprovalService` | Founder/council/executive approval routing |
| `PolicyAuditService` | Append-only audit |
| `PolicyHistoryService` | Append-only history |
| `PolicyExplainabilityService` | Explainability records |
| `GovernanceKernelService` | Final checkpoint |
| `GovernanceCertificationService` | Policy + governance certification |
| `PolicyEngineContextService` | CompanyContext assembly |

---

## Data Flow

1. **No duplicate storage** — policy data from Bedrock `PolicyService`; constraints from `ConstraintService`
2. **In-memory store** — decisions, explainability, history, exceptions (event-sourced pattern; persist via events)
3. **Context assembly** — single `PolicyEngineContextService.assemble()` call
4. **Events** — `policy.evaluated`, `governance.checkpoint.completed`, certification events

---

## Versioning

| Component | Version Constant |
|-----------|----------------|
| Policy Engine | `POLICY_ENGINE_VERSION` = `1.0.0` |
| Governance Kernel | `GOVERNANCE_KERNEL_VERSION` = `1.0.0` |
| CompanyContext | `2.3.0-s4d-policy-engine` |

---

## ADRs

- ADR-085 — Organizational Policy Engine
- ADR-086 — Governance Kernel
- ADR-087 — Policy Evaluation and Default Deny
- ADR-088 — Policy and Governance Certification
- ADR-089 — Sprint 5 Policy Extension Points
