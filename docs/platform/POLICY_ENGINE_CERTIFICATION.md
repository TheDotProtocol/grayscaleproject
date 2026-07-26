# Policy Engine Certification

**15 deterministic policy ECS gates + 12 governance gates**

---

## Policy Gates

| Gate | Validation |
|------|------------|
| `policies_versioned` | `POLICY_ENGINE_VERSION` on decisions |
| `policies_explainable` | Explainability contract defined |
| `policies_auditable` | Append-only audit trail |
| `policies_deterministic` | Same inputs → same verdict |
| `founder_constitution_inherited` | Founder authority in constitutional sources |
| `oom_inherited` | OOM in hierarchy |
| `architecture_lock_inherited` | Bedrock frozen |
| `executive_compliance_respected` | ECS gates mandatory |
| `unknown_fails_safe` | Unknown → `unknown_denied` |
| `no_implicit_permissions` | No implicit allow |
| `default_deny` | Default deny enforced |
| `explicit_allow` | Permits require explicit rule |
| `override_immutable` | Overrides recorded permanently |
| `emergency_temporary` | Emergency policies time-bounded |
| `expired_deactivate` | Expired policies inactive |

---

## Governance Gates

| Gate | Validation |
|------|------------|
| `kernel_checkpoint` | Checkpoint service operational |
| `policy_evaluation_integrated` | Kernel delegates to policy engine |
| `constraint_enforcement` | Constraints assessed |
| `approval_routing` | Approvals routed correctly |
| `founder_authority` | Founder queue supported |
| `council_authority` | Council queue supported |
| `exception_handling` | Exception queue operational |
| `audit_append_only` | Governance audit append-only |
| `governance_explainable` | Checkpoint links to decision |
| `automation_enforcement_ready` | Extension point defined (not activated) |
| `default_deny_enforced` | `governanceState.defaultDeny === true` |
| `no_reasoning_in_kernel` | Kernel validates only |

---

## Executive Compliance — Phase D (10 gates)

| Check ID | Name |
|----------|------|
| `phase_d.policy` | Policy compliance fields in context |
| `phase_d.governance` | Governance state in context |
| `phase_d.approval` | Approval compliance |
| `phase_d.constraint` | Constraint compliance |
| `phase_d.policy_explainability` | Policy explainability contract |
| `phase_d.policy_audit` | Policy audit validation |
| `phase_d.founder_approval` | Founder approval validation |
| `phase_d.council_approval` | Council approval validation |
| `phase_d.emergency_policy` | Emergency policy validation |
| `phase_d.default_deny` | Default deny validation |

---

## Certification Endpoints

```
GET /policy-engine/:companyId/certification
GET /policy-engine/:companyId/governance/certification
```

Certified when all gates pass, score ≥ 90.

Mission Control widget: `governance-certification`
