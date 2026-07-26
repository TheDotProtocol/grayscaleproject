# Governance Kernel Explainability

**Every checkpoint must trace to constitutional sources (Sprint 4 Phase D)**

---

## Explainability Chain

```
PolicyEvaluationService
    → PolicyDecision (reasons[], verdict, requiredApprovals)
    → PolicyExplainabilityService.explain(decisionId)
    → PolicyExplainability record

GovernanceKernelService
    → GovernanceEvaluationResult (links policyDecisionId)
    → Event: governance.checkpoint.completed
```

---

## Governance Explainability Fields

`GovernanceEvaluationResult` links to policy explainability via `policyDecisionId`.

Mission Control `governance-timeline` aggregates:

- `policy.evaluated` events
- `governance.checkpoint.completed` events
- `policy.approval.routed` events

---

## Constitutional Trace

Every governance checkpoint traces to:

1. Policy decision ID
2. Correlation ID (end-to-end trace)
3. Constitutional source documents
4. Audit reference

---

## Rules

1. No checkpoint without linked policy decision
2. No silent checkpoint pass — event always published
3. Approval routing explained in policy explainability record
4. Default deny state visible in `governanceState.defaultDeny`

---

## CompanyContext

- `governanceState` — current kernel state
- `governanceHealth` — health assessment
- `governanceMetrics` — evaluation counts
- `policyExplainability` — latest decision explainability

Mission Control widgets: `governance-timeline`, `policy-explainability`
