# Council Certification

**Sprint 3 Phase B — ECS Extension**

---

## Gates

| Gate | Validates |
|------|-----------|
| session_integrity | Session lifecycle operational |
| evidence_integrity | Evidence submission with bus |
| consensus_integrity | Deterministic consensus measurement |
| minority_opinion_preservation | Dissent preserved |
| founder_escalation | Escalation path exists |
| decision_traceability | Correlation IDs throughout |
| attention_engine_integration | Attention in CompanyContext |
| decision_classification | Class before deliberation |
| explainability | `isCouncilExplanationComplete` |
| replay_consistency | Session replay from events |
| audit_consistency | Audit trail complete |

---

## API

```
GET /companies/:companyId/council/certify
```

Returns `CouncilCertificationReport` — deterministic, no LLM.

Score ≥ 90 required to pass.

---

*Platform:* `@grayscale/platform/council/council-certification.ts`
