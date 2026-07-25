# Executive Compliance Suite (ECS)

**Version:** 1.0.0 (Sprint 2)  
**Purpose:** Deterministic pre-activation validation for every executive

---

## Principles

1. **No LLM pass/fail** — every check produces deterministic evidence
2. **Critical vs standard** — critical failures block certification
3. **Score ≥ 90** required with zero critical failures
4. **EXECUTIVES_ENABLED=false** verified on every run

---

## Certification Categories

| Category | Check Focus |
|----------|-------------|
| Identity | Executive ID, runtime availability |
| Trust | Trust engine contract wired |
| Notebook | Notebook service operational |
| Curiosity | Curiosity service operational |
| Skeptic | Mandatory skeptic questions populated |
| Discovery | 13-stage pipeline defined and operational |
| Explainability | Athena explainability contract complete |
| Recommendation Lifecycle | Lifecycle port defined |
| Policy Compliance | Policies in CompanyContext |
| Constraint Compliance | Constraints in CompanyContext |
| Founder Constitution | Constitution in context, founder authority |
| Architecture Lock | Document exists |
| Manifesto | Document exists |
| Certification | Document exists, executives disabled |
| Philosophy | Document exists |
| Company Context | Assembly, runtime metadata, constitution |
| Memory Integrity | Memory in context |
| Graph Integrity | Graph summary in context |
| Strategy Integrity | Strategy context present |
| Intent Integrity | Intent field wired |
| Organizational Intelligence | Org intelligence field wired |

---

## Scoring

- Critical checks: 70% weight
- Standard checks: 30% weight
- `computeEcsScore()` in `@grayscale/platform`

---

## Verdicts

| Verdict | Meaning |
|---------|---------|
| `CERTIFIED_DORMANT` | Passed all gates; executive dormant until Founder activation |
| `NOT_CERTIFIED` | One or more critical failures or score < 90 |
| `PENDING` | Certification not yet run |

---

## API

```
GET /companies/:companyId/executive-compliance/athena/certify
```

Returns full `EcsCertificationReport` with per-check evidence.

---

## Implementation

- Platform contract: `packages/platform/src/executive/compliance-suite.ts`
- Backend service: `backend/src/modules/executive-compliance/`
- Report generation: `scripts/sprint2-certification.ts`

---

## Athena Certification Gates

Before `ATHENA_CERTIFICATION_REPORT.md` marks success:

- [x] Discovery validation
- [x] Identity validation
- [x] Trust validation
- [x] Notebook validation
- [x] Curiosity validation
- [x] Skeptic validation
- [x] Explainability validation
- [x] Founder Constitution validation
- [x] Policy validation
- [x] Constraint validation
- [x] Lifecycle validation
- [x] Mission Control validation
