# Organizational Decision Model

**Version:** 1.0.0  
**Status:** IMMUTABLE (constitutional hierarchy)  
**Position:** Below Executive Council Constitution; above council runtime

---

## Purpose

Define **how organizational decisions are classified** before any council deliberation begins.

The organization—not any executive—is the decision-making entity. Every decision must belong to a decision class with deterministic requirements.

*Platform registry:* `@grayscale/platform/decision` — `DECISION_CLASS_REGISTRY`

---

## Decision Classes (19)

| Class | Founder Approval | Min Confidence | Impact |
|-------|------------------|----------------|--------|
| Strategic | Required | 0.65 | Critical |
| Operational | Optional | 0.55 | Medium |
| Financial | Required | 0.70 | High |
| Technology | Optional | 0.60 | High |
| Security | Required | 0.75 | Critical |
| Compliance | Required | 0.75 | Critical |
| Legal | Required | 0.80 | Critical |
| People | Required | 0.65 | High |
| Product | Optional | 0.60 | Medium |
| Customer | Optional | 0.60 | Medium |
| Infrastructure | Optional | 0.65 | High |
| Emergency | Required | 0.50 | Critical |
| Innovation | Optional | 0.55 | Medium |
| Growth | Required | 0.65 | High |
| Risk | Required | 0.70 | Critical |
| Partnership | Required | 0.70 | High |
| Investment | Required | 0.75 | Critical |
| Acquisition | Required | 0.80 | Critical |
| Governance | Required | 0.70 | Critical |

---

## Per-Class Requirements

Each class defines:

- Required executives
- Founder approval requirement
- Council quorum
- Minimum confidence threshold
- Required evidence types
- Required explainability
- Required simulations (where applicable)
- Required risk assessment
- Required rollback strategy
- Automation eligibility (always false while `EXECUTIVES_ENABLED=false`)
- Audit retention policy
- Organizational impact level

---

## Constitutional Rule

**Council runtime MUST classify the decision FIRST** before deliberation begins.

`CouncilSessionService.openIssue()` enforces valid `decisionClass` via `classifyDecision()`.

---

*Companion:* `DECISION_CLASSIFICATION.md`, ADR-036
