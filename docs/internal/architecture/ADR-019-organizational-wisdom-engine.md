# ADR-019: Organizational Wisdom Engine

**Status:** Accepted  
**Date:** 2026-07-25  
**Phase:** Sprint 2 — Phase A.2 (Organizational Intelligence)  
**Deciders:** Founding Principal Engineer  
**Foundation:** Bedrock v1.0.0-bedrock (Certified, FROZEN)

---

## Context

ADR-018 captures individual lessons. Over time, repeated patterns crystallize into **organizational principles** — durable wisdom that should constrain executive reasoning before Strategy evaluation.

**Problem:** Without an approval-gated wisdom layer, executives either ignore accumulated lessons or treat single incidents as universal rules.

**Constraint:** Contracts only. Wisdom requires explicit approval. No LLM principle generation.

---

## Decision

### 1. Organizational Wisdom Engine

Stores approved principles derived from evidence chains:

- Principle name, statement, rationale
- Evidence chain linking to memory, decisions, and outcomes
- Confidence score and approval lifecycle: `draft` → `pending_approval` → `approved` → `superseded` / `archived`
- Full version history with supersession tracking

### 2. Constitutional Rule

**Wisdom ≠ Memory ≠ Learning.** Executives consume `listApproved` before Strategy evaluation. Only approved wisdom constrains reasoning.

### 3. Approval Workflow

- `propose` creates draft/pending records
- `approve` requires human approver — executives MUST NOT approve
- Supersession preserves history; prior versions remain auditable

### 4. Platform Contract

| Contract | File | Purpose |
|----------|------|---------|
| Wisdom Engine | `wisdom-engine.ts` | Principles, approval port, history |
| Shared types | `common.ts` | Versioned records, evidence refs |

### 5. CompanyContext Extension

`OrganizationalIntelligenceContext.approvedWisdom` — approved principles for executive context.

### 6. Mission Control Widget (reserved)

| Widget ID | Purpose |
|-----------|---------|
| `wisdom-library` | Approved principles library |

### 7. Event Catalog (reserved)

- `organizational-wisdom.proposed`
- `organizational-wisdom.approved`

---

## Consequences

### Positive

- Repeated lessons become durable organizational constraints
- Approval gate prevents premature principle adoption
- Executives inherit accumulated institutional wisdom

### Negative

- Approval latency before principles take effect
- Requires sufficient learning volume before wisdom emerges

### Risks

| Risk | Mitigation |
|------|------------|
| Single incident promoted to principle | Approval workflow; evidence chain requirement |
| Wisdom conflated with Memory/Learning | Distinct contract; `isWisdomDistinctFromMemory()` guard |
| Stale principles persist | Supersession lifecycle; version history |

---

## Compliance

| Document | Alignment |
|----------|-----------|
| EXECUTIVE_PHILOSOPHY.md | Institutional knowledge earned through evidence |
| EXECUTIVE_MANIFESTO.md v1.2 | Wisdom constrains reasoning integrity |
| EXECUTIVE_CERTIFICATION.md v1.2 | Wisdom engine gates |
| ADR-018 | Learning records feed wisdom proposals |

---

## Out of Scope (Phase A.2)

- Automatic principle extraction from learning records
- Approval workflow UI
- Service implementations and persistence
- Mission Control widget implementation

---

## References

- `packages/platform/src/organization/wisdom-engine.ts`
- `packages/platform/src/organization/common.ts`
- `packages/platform/src/organization/context.ts`
- `packages/platform/src/mission-control/organizational-widgets.ts`

---

*Lessons are events. Wisdom is law — approved, evidence-backed, and superseded when wrong.*
