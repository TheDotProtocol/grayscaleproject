# Organizational Governance Kernel

**Project Grayscale — Final Constitutional Checkpoint**

**Version:** 1.0.0  
**Status:** IMMUTABLE (constitutional hierarchy)  
**Foundation:** Bedrock v1.0.0-bedrock (Certified, FROZEN)  
**Sprint:** Sprint 4 — Phase D  
**Tag:** `Sprint-4-Phase-D-PolicyEngine-v1.0`

---

## Preamble

The Organizational Policy Engine determines permission. The **Governance Kernel** enforces it.

The Governance Kernel is the final constitutional checkpoint before execution. It does **not** reason. It **validates**.

Every organizational action that passes policy evaluation must still pass governance checkpoint validation before proceeding.

---

## Constitutional Position

```
ORGANIZATIONAL_POLICY_ENGINE.md     ← permission evaluation
ORGANIZATIONAL_GOVERNANCE_KERNEL.md ← this document (enforcement)
GovernanceKernelService             ← backend implementation
```

---

## Article I — Responsibilities

| Responsibility | Description |
|----------------|-------------|
| Policy evaluation integration | Delegates to Policy Engine; never duplicates logic |
| Constraint enforcement | Bedrock strategic constraints via `ConstraintService` |
| Founder authority | Routes `requires_founder_approval` to founder queue |
| Executive authority | Routes `requires_executive_approval` to executive queue |
| Council authority | Routes `requires_council_consensus` to council queue |
| Approval routing | Deterministic approval queue management |
| Risk escalation | Tracks escalations for Mission Control |
| Exception handling | Temporary policy exceptions with expiry |
| Audit | Append-only governance audit trail |
| Governance explainability | Links decisions to constitutional sources |
| Future automation enforcement | Extension point for Sprint 5 — not activated |

---

## Article II — Governance State

`GovernanceState` on CompanyContext includes:

- `kernelVersion` — `GOVERNANCE_KERNEL_VERSION`
- `defaultDeny: true` — always enforced
- `pendingApprovals` — count of queued approvals
- `activeExceptions` — temporary exception count
- `riskEscalations` — escalation count

---

## Article III — Checkpoint Flow

```
Action Request
    → PolicyEvaluationService.evaluate()
    → GovernanceKernelService.evaluate()
        → Approval routing (if required)
        → Event: governance.checkpoint.completed
    → GovernanceEvaluationResult
        → permitted | requires_* | prohibited | unknown_denied
```

Checkpoint passes when verdict is `permitted` or begins with `requires_` (approval path open). Execution remains blocked until approvals complete.

---

## Article IV — Constitutional Principles

1. **Validates, never reasons** — rule-based checkpoint only
2. **Deterministic** — same request → same checkpoint result
3. **Explainable** — every checkpoint links to policy decision
4. **Auditable** — events and audit records for every checkpoint
5. **Event-driven** — `governance.checkpoint.completed` on every evaluation
6. **Default deny enforced** — kernel state always reflects `defaultDeny: true`
7. **Founder authority preserved** — founder approvals never auto-granted
8. **Council authority preserved** — consensus never bypassed

---

## Article V — Platform Contracts

- `GovernanceKernelPort`, `GovernanceEvaluationPort`
- `GovernanceAuditPort`, `GovernanceMetricsPort`, `GovernanceCertificationPort`

Backend: `GovernanceKernelService`, `GovernanceCertificationService`.

---

## Article VI — CompanyContext

Read-only optional fields:

- `governanceState`, `governanceHealth`, `governanceMetrics`

Assembled via `PolicyEngineContextService` — never duplicate storage.

---

## Article VII — Boundaries

### The Governance Kernel DOES NOT

- Reason about strategy or outcomes
- Recommend actions
- Execute organizational actions
- Replace Policy Engine evaluation
- Activate autonomous execution

### The Governance Kernel DOES

- Validate policy decisions at checkpoint
- Route approvals to correct authority
- Emit governance events and metrics
- Certify governance readiness (12 ECS gates)

---

## Certification

12 deterministic governance certification gates. Certified when all gates pass, score ≥ 90.

```
GET /policy-engine/:companyId/governance/certification
```

**EXECUTIVES_ENABLED=false** and **AUTONOMOUS_EXECUTION_ENABLED=false** remain non-negotiable.
