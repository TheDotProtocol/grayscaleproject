# Council Decision Lifecycle

**Project Grayscale — Executive Council Decision Flow**

**Version:** 1.0.0  
**Status:** Constitutional — Sprint 3 Phase A  
**Companion:** `EXECUTIVE_COUNCIL_CONSTITUTION.md`

---

## Lifecycle Overview

Every council decision follows this immutable sequence. Stages may not be skipped.

```
Issue
  ↓
Evidence Collection
  ↓
Discovery
  ↓
Deliberation
  ↓
Challenge
  ↓
Counter Evidence
  ↓
Minority Opinions
  ↓
Consensus
  ↓
Founder Review (if required)
  ↓
Decision
  ↓
Explanation
  ↓
Execution Approval
  ↓
Organizational Learning
  ↓
Historical Wisdom
```

---

## Stage Definitions

### 1. Issue

A **CouncilIssue** is opened with: title, domain, urgency, intent linkage, and initiating executive.

- Must reference organizational intent or strategic objective when available
- Assigned correlation ID for full traceability

### 2. Evidence Collection

Executives and platform assemble **CouncilEvidence** from:

- Memory Engine
- Knowledge Graph
- Signals & Insights
- Organizational Intelligence
- Notebook investigations (references only—not notebook ownership)

Missing evidence is explicitly recorded.

### 3. Discovery

Per-organizational Operating Model: discovery before recommendation.

- 13-stage discovery alignment for issue domain
- Discovery snapshot linked to session

### 4. Deliberation

Structured **CouncilDeliberation** records:

- Position per executive
- Evidence refs per position
- Confidence bounds
- Role at time of deliberation

### 5. Challenge

Skeptic-equivalent challenge pass at council level:

- What could make positions wrong?
- Contradicting evidence?
- Weak assumptions?

### 6. Counter Evidence

Dissenting executives submit counter-evidence with citations.

- Required for formal dissent
- Preserved in session record

### 7. Minority Opinions

**CouncilMinorityOpinion** records preserved permanently:

- Executive ID, position, evidence, rationale
- Never suppressed for consensus cosmetic

### 8. Consensus

**CouncilConsensus** measured deterministically:

| Level | Criteria |
|-------|----------|
| Strong | Aligned evidence, no blocking challenges, vote threshold met |
| Weak | Partial alignment — Founder review required |
| None | Deadlock — competing resolutions + mandatory Founder review |

### 9. Founder Review (if required)

Triggered by: weak/no consensus, material impact, policy change, or constitution.

Founder may: approve, reject, select minority, defer, or override.

### 10. Decision

**CouncilDecision** — approved organizational choice with:

- Approved resolution ID
- Founder approval record (if applicable)
- Effective timestamp

### 11. Explanation

**CouncilExplanation** — full trace for Mission Control:

- Evidence used, votes, dissent, confidence, policies, constraints, rollback plan

### 12. Execution Approval

Explicit approval gate before automation or execution.

- `EXECUTIVES_ENABLED` and automation policies apply
- No implicit execution from consensus

### 13. Organizational Learning

Decision outcomes feed Learning Engine:

- Success/failure patterns
- Override analysis

### 14. Historical Wisdom

Validated patterns promote to organizational wisdom.

Failed patterns promote to constraints.

---

## Lifecycle Contract

Platform type: `CouncilDecisionLifecycleStage` in `@grayscale/platform/council`

Validation: `isCouncilLifecycleComplete(stages)` — deterministic, no LLM.

---

## Non-Negotiables

- No stage skipping
- No LLM lifecycle pass/fail
- Every transition event-driven and auditable
- Founder sovereignty at approval gates
