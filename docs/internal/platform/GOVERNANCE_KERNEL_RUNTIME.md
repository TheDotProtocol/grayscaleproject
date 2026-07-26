# Governance Kernel Runtime

**Final constitutional checkpoint — validates, never reasons (Sprint 4 Phase D)**

---

## Checkpoint Service

`GovernanceKernelService` is the backend implementation of the Governance Kernel.

### evaluate(request)

1. Delegates to `PolicyEvaluationService.evaluate()`
2. Determines `permitted` (verdict === `permitted`)
3. Sets `checkpointPassed` (permitted OR verdict starts with `requires_`)
4. Routes approvals via `PolicyApprovalService` when required
5. Publishes `governance.checkpoint.completed`
6. Returns `GovernanceEvaluationResult`

---

## State Services

| Method | Returns |
|--------|---------|
| `getState(companyId)` | `GovernanceState` — defaultDeny, pending approvals, exceptions |
| `getHealth(companyId)` | `GovernanceHealth` — score, status, violation count |
| `getMetrics(companyId)` | `GovernanceMetrics` — evaluations, approvals, denials |
| `getPolicySnapshot(companyId)` | `OrganizationalPolicySnapshot` from Bedrock |
| `listExceptions(companyId)` | `PolicyExceptionSnapshot` |

---

## Approval Routing

When verdict requires approval:

| Verdict | Authority | Queue |
|---------|-----------|-------|
| `requires_founder_approval` | Founder | `founder-approvals` widget |
| `requires_council_consensus` | Executive Council | `council-approvals` widget |
| `requires_executive_approval` | Executive | `approval-queue` widget |

Event: `policy.approval.routed`

---

## Constraint Integration

`PolicyEngineConstraintService` wraps Bedrock `ConstraintService`:

- No duplicate Prisma access
- Hard constraint violations → `prohibited`
- Constraint snapshot on CompanyContext: `policyConstraints`

---

## Mission Control Widgets

| Widget ID | Data Provider |
|-----------|---------------|
| `governance-health` | `governance.health` |
| `governance-timeline` | `governance.timeline` |
| `risk-escalation` | `governance.risk-escalation` |
| `governance-certification` | `governance.certification` |

---

## Non-Negotiables

- Kernel does not reason
- Kernel does not execute actions
- Kernel does not bypass Policy Engine
- `AUTONOMOUS_EXECUTION_ENABLED=false`
