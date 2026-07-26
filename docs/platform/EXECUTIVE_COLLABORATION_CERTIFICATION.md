# Executive Collaboration Certification

**ECS Extension — Executive Collaboration Gates**

**Version:** 1.0.0  
**Sprint:** Sprint 4 Phase B

---

## Certification Rule

Collaboration is **certified** when all 12 gates pass with score ≥ 90.

```
GET /companies/:companyId/council/collaboration/certify
```

---

## Gates

| Gate | Validation |
|------|------------|
| `delegation` | Delegation via collaboration network only |
| `consensus` | Consensus measurement available |
| `challenge` | Challenge requests supported |
| `minority_report` | Minority reports preserved |
| `evidence_trace` | Evidence trail append-only |
| `replay` | Council memory replay available |
| `audit` | Audit trail append-only |
| `governance` | Council governance configured |
| `council_explainability` | Deliberation stages explainable |
| `founder_constitution_compliance` | EXECUTIVE_COLLABORATION.md in hierarchy |
| `organizational_runtime_compliance` | Runtime owns council scheduling |
| `architecture_lock_compliance` | Bedrock unchanged; additive only |

---

## Relationship to Other Certification

| Certification | Scope |
|---------------|-------|
| Executive ECS | Individual executive activation |
| Council ECS | Council session integrity (Sprint 3) |
| Runtime ECS | OrgOS orchestration (Sprint 4 Phase A) |
| Collaboration ECS | Executive cooperation (Sprint 4 Phase B) |

`EXECUTIVES_ENABLED=false` until all applicable gates pass.
