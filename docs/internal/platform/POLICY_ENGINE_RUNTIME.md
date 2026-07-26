# Policy Engine Runtime

**Deterministic, event-driven policy evaluation (Sprint 4 Phase D)**

---

## REST API

Base path: `/policy-engine/:companyId`

| Method | Path | Description |
|--------|------|-------------|
| POST | `/evaluate` | Evaluate action permission |
| POST | `/governance/evaluate` | Governance kernel checkpoint |
| GET | `/policies` | Organizational policy snapshot |
| GET | `/health` | Policy health assessment |
| GET | `/constraints` | Constraint snapshot |
| GET | `/approvals` | Approval queue |
| GET | `/exceptions` | Active exceptions |
| GET | `/history` | Policy history |
| GET | `/explainability/:decisionId` | Explainability record |
| GET | `/certification` | Policy certification report |
| GET | `/governance/certification` | Governance certification report |

---

## Evaluation Flow

```typescript
// 1. Policy evaluation
POST /policy-engine/:companyId/evaluate
{
  "actionKind": "executive_action",
  "actionRef": "athena:recommend-strategy",
  "correlationId": "corr-..."
}

// 2. Governance checkpoint (includes policy evaluation)
POST /policy-engine/:companyId/governance/evaluate
// Same body — kernel delegates to PolicyEvaluationService
```

---

## Default Deny Logic

1. Load Bedrock policies for company
2. Match action against policy rules
3. If no match and no `context.explicitAllow` → `unknown_denied`
4. If hard constraint violated → `prohibited`
5. If policy requires approval → route to appropriate authority
6. If explicit allow rule matches → `permitted`

---

## Events

| Event | Version | Category |
|-------|---------|----------|
| `policy.evaluated` | 1 | organization |
| `policy.certified` | 1 | organization |
| `governance.checkpoint.completed` | 1 | organization |
| `governance.certified` | 1 | organization |
| `policy.approval.routed` | 1 | organization |

---

## Context Runtime Integration

- Assembler ID: `policy-engine`
- Wired in `company-context-assembler.service.ts`
- Context version: `2.3.0-s4d-policy-engine`
- Module import: `PolicyEngineModule` in `ContextRuntimeModule`

---

## Flags

- `EXECUTIVES_ENABLED=false`
- `AUTONOMOUS_EXECUTION_ENABLED=false`

Policy evaluation runs. Autonomous execution does not.
