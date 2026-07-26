# Policy Engine Explainability

**Every policy decision must explain (Sprint 4 Phase D)**

---

## Record Schema

`PolicyExplainability` includes:

- `decisionId` — links to policy decision
- `action` — `actionKind:actionRef`
- `why` — human-readable reason (reasons joined)
- `verdict` — policy verdict
- `policiesEvaluated` — policy sources consulted
- `constraintsChecked` — constraint sources checked
- `approvalsRequired` — founder | council | executive
- `evidenceRequired` — boolean
- `defaultDenyApplied` — true when unknown_denied or prohibited
- `constitutionalSources` — hierarchy documents referenced
- `version`, `correlationId`, `traceId`, `auditReference`, `recordedAt`

---

## Constitutional Sources

Every explainability record references:

1. `FOUNDER_CONSTITUTION.md`
2. `ORGANIZATIONAL_OPERATING_MODEL.md`
3. `ARCHITECTURE_LOCK.md`
4. `ORGANIZATIONAL_POLICY_ENGINE.md`

---

## Rules

1. No silent denial — default deny always explained
2. Every verdict produces explainability on request
3. Explainability cached per decision ID (immutable)
4. Audit reference links to append-only trail
5. Default deny applied flag set when no explicit allow

---

## API

```
GET /policy-engine/:companyId/explainability/:decisionId
```

CompanyContext field: `policyExplainability` — latest decision explainability.

Mission Control widget: `policy-explainability`
