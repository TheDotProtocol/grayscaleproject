# Organizational Policy Engine

**Project Grayscale — Constitutional Permission Authority**

**Version:** 1.0.0  
**Status:** IMMUTABLE (constitutional hierarchy)  
**Foundation:** Bedrock v1.0.0-bedrock (Certified, FROZEN)  
**Sprint:** Sprint 4 — Phase D  
**Tag:** `Sprint-4-Phase-D-PolicyEngine-v1.0`

---

## Preamble

Sprint 4 Phase A established continuous operation. Phase B established executive collaboration. Phase C established attention budgeting. Phase D establishes **whether organizational actions are permitted before execution**.

This document answers one question:

> **What is permitted, what requires approval, and what is prohibited?**

The Organizational Policy Engine (OPE) is **NOT** an executive. It is **NOT** a reasoning engine. It is **NOT** automation. It is the constitutional authority that determines whether organizational actions are permitted.

Every future executive, runtime, workflow, simulation, automation, integration, plugin, API, and autonomous capability **must consult the Policy Engine before execution**.

---

## Constitutional Position

```
ARCHITECTURE_LOCK.md
FOUNDER_CONSTITUTION.md
ORGANIZATIONAL_OPERATING_MODEL.md
ORGANIZATIONAL_RUNTIME.md
EXECUTIVE_COLLABORATION.md
ORGANIZATIONAL_ATTENTION_BUDGET.md
ORGANIZATIONAL_POLICY_ENGINE.md          ← this document
ORGANIZATIONAL_GOVERNANCE_KERNEL.md      ← enforcement checkpoint
ORGANIZATIONAL_NERVOUS_SYSTEM.md
Executive implementations (Athena, Atlas, …)
```

---

## Article I — Policy Questions

The Policy Engine answers:

| Question | Verdict Examples |
|----------|------------------|
| What is permitted? | `permitted` |
| What requires approval? | `requires_founder_approval`, `requires_council_consensus`, `requires_executive_approval` |
| What is prohibited? | `prohibited`, `unknown_denied` |
| What requires Executive Council consensus? | `requires_council_consensus` |
| What requires Founder approval? | `requires_founder_approval` |
| What requires additional evidence? | `requires_evidence` |
| What requires policy exceptions? | `requires_exception` |

---

## Article II — Constitutional Principles

1. **Policies are versioned** — `POLICY_ENGINE_VERSION` on every decision
2. **Policies are explainable** — every verdict produces an explainability record
3. **Policies are auditable** — append-only audit trail
4. **Policies are deterministic** — same inputs → same verdict
5. **Policies inherit the Founder Constitution** — founder authority never bypassed
6. **Policies inherit Organizational Operating Model** — org reasoning boundaries respected
7. **Policies inherit Architecture Lock** — Bedrock frozen; no rewrites
8. **Policies never bypass Executive Compliance** — ECS gates remain mandatory
9. **Policies may evolve** — new versions; history immutable
10. **History never changes** — append-only policy history
11. **Unknown policies fail safely** — `unknown_denied` when no matching allow rule
12. **No implicit permissions** — nothing permitted without explicit rule
13. **Default deny** — empty policy set denies unless `context.explicitAllow`
14. **Explicit allow** — permits require matching Bedrock policy or explicit context flag
15. **Policy overrides are immutable** — recorded permanently when granted
16. **Emergency policies are temporary** — time-bounded with automatic expiry
17. **Expired policies deactivate automatically** — no stale emergency rules

---

## Article III — Action Kinds

The Policy Engine evaluates permission for:

| Action Kind | Scope |
|-------------|-------|
| `executive_action` | Executive-initiated organizational actions |
| `runtime_orchestration` | OrgOS runtime orchestration |
| `workflow` | Workflow execution |
| `simulation` | Organizational simulation |
| `automation` | Autonomous or semi-autonomous execution |
| `integration` | External integration actions |
| `plugin` | Plugin platform actions |
| `api_call` | Platform API invocations |

---

## Article IV — Ownership Boundaries

### The Policy Engine DOES

- Evaluate constitutional permission
- Route approval requirements
- Record decisions, history, audit, explainability
- Delegate to Bedrock `PolicyService` and `ConstraintService` — no duplicate storage

### The Policy Engine DOES NOT

- Reason, recommend, forecast, or schedule
- Collaborate or simulate
- Generate strategies
- Replace executives, Founder authority, or Executive Council
- Execute actions — only evaluates permission

---

## Article V — Platform Contracts

Interface-first ports under `packages/platform/src/policy/`:

- `PolicyEnginePort`, `PolicyEvaluationPort`, `PolicyDecisionPort`
- `PolicyConstraintPort`, `PolicyApprovalPort`, `PolicyExceptionPort`
- `PolicyAuditPort`, `PolicyHistoryPort`, `PolicyExplainabilityPort`, `PolicyCertificationPort`

Backend: `PolicyEngineModule` — evaluation, constraints, approvals, audit, history.

---

## Article VI — CompanyContext

Read-only optional fields assembled via Context Runtime:

- `organizationalPolicies`, `policyHealth`, `policyConstraints`
- `policyApprovals`, `policyExceptions`
- `policyExplainability`, `policyHistory`

Never duplicate storage. Assembler ID: `policy-engine`. Context version: `2.3.0-s4d-policy-engine`.

---

## Article VII — Sprint 5 Extension Points (Reserved)

Defined but **NOT implemented** in Phase D:

- Policy inheritance
- Cross-company policy federation
- Policy templates
- Industry compliance packs
- Regulatory policies
- Regional governance
- Autonomous policy enforcement
- Multi-organization governance

---

## Article VIII — Non-Negotiables

- **EXECUTIVES_ENABLED=false**
- **AUTONOMOUS_EXECUTION_ENABLED=false**
- Organization first. Governance second. Executives third. Automation last.
- Bedrock frozen. No architectural rewrites. No executive direct Prisma access.

---

## Certification

Executive Compliance Suite validates 15 policy gates + 10 Phase D ECS checks before any executive activation.

**The objective of Phase D is NOT automation. The objective is constitutional governance that determines whether any future organizational action is permitted before execution.**
