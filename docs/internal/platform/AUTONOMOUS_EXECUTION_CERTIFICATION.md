# Autonomous Execution Certification

**Future certification specification — governance validated in Phase C**

---

## Phase C Scope

Phase C certifies **governance readiness**, not autonomous capability.

Gate: `autonomy_disabled` must pass — confirms `AUTONOMOUS_EXECUTION_ENABLED=false` and `EXECUTIVES_ENABLED=false`.

---

## Future Gates (Reserved)

When a future phase activates autonomy, additional gates will require:

- Per-policy certification
- Reversibility proof
- Council path for material decisions
- Mission Control visibility
- Immutable evidence chain

---

## Current Validation

```
GET /attention-budget/:companyId/autonomy-governance
```

14 gates in `AUTONOMY_GOVERNANCE_ECS_GATES`.
