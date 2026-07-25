# ADR-023: Organizational Intent Engine

**Status:** Accepted  
**Date:** 2026-07-25  
**Phase:** Sprint 2 — Phase A.4 (Context Runtime)  
**Deciders:** Founding Principal Engineer  
**Foundation:** Bedrock v1.0.0-bedrock (Certified, FROZEN)

---

## Context

ADR-015–022 model **what the organization is** (Organizational Intelligence). Executives and Strategy still lack a constitutional answer to **why work exists** — the traceable chain from vision to execution.

Without an Intent Engine, goals, projects, and recommendations float without provenance. Strategy cannot validate alignment; Discovery cannot assess coverage gaps.

**Constraint:** Contracts and architecture only. No executive mutation of intent records. Founder DNA (ADR-015 §2) informs intent interpretation but does not replace approval-gated intent records.

---

## Decision

### 1. Organizational Intent Engine

Stores versioned **intent records** — the organization's declared purpose at every level of the hierarchy.

### 2. Intent Hierarchy (Vision → Execution)

Constitutional hierarchy — every operational entity SHOULD trace upward:

```
Vision
  ↓
Mission
  ↓
Intent
  ↓
Strategic Theme
  ↓
Goal
  ↓
Objective
  ↓
Project
  ↓
Task
  ↓
Recommendation
  ↓
Execution
```

- Parent-child links via `parentIntentId`
- Cross-domain links via `EngineLinkRef` (strategy IDs, graph nodes, memory refs)
- `validateTrace` confirms an entity's chain to root intent
- `getCoverage` reports unlinked strategic objects

### 3. Founder DNA Relationship (ADR-015)

Founder DNA supplies **behavioural evidence** (decision habits, risk tolerance) — not intent content. Intent records require approval workflow; Founder DNA is evidence-applied only. Executives consume both read-only; neither is executive-writable.

### 4. Platform Contract

| Contract | File | Purpose |
|----------|------|---------|
| Intent Engine | `intent-engine.ts` | Hierarchy, coverage, trace validation, snapshots |
| Shared types | `organization/common.ts` | `EngineEvidenceRef`, `VersionedEngineRecord` |

### 5. CompanyContext Extension

`CompanyContext.intent?: IntentContext` — assembled by platform, consumed read-only.

### 6. Mission Control Widgets (reserved)

| Widget ID | Purpose |
|-----------|---------|
| `intent-hierarchy` | Full hierarchy tree |
| `intent-coverage` | Coverage gaps and unlinked entities |

### 7. Event Catalog (reserved)

- `organizational-intent.proposed` / `organizational-intent.approved` / `organizational-intent.superseded`
- `organizational-intent.snapshot.captured`

---

## Consequences

### Positive

- Every strategic object traceable to declared purpose
- Coverage gaps visible before recommendation eligibility
- Intent evolution auditable via version history and snapshots

### Negative

- Approval workflow adds latency for intent changes (intentional)
- Full hierarchy requires sustained onboarding effort

### Risks

| Risk | Mitigation |
|------|------------|
| Executives mutate intent | Port excludes executive write; certification gate |
| Intent inferred from behaviour | Approval-gated records; Founder DNA separate (ADR-015) |
| Orphan goals/projects | `getCoverage` + `intent_coverage_gap` signal (ADR-026) |

---

## Compliance

| Document | Alignment |
|----------|-----------|
| EXECUTIVE_PHILOSOPHY.md | Purpose before action; clarity over output |
| EXECUTIVE_MANIFESTO.md v1.2 | Recommendations trace to organizational purpose |
| EXECUTIVE_CERTIFICATION.md v1.2 | Intent trace gates |
| ADR-015 | Founder DNA informs; Organizational DNA grounds values |
| ADR-014 | Intent feeds Discovery Strategy stage |

---

## Out of Scope (Phase A.4)

- NestJS service persistence beyond contract stubs
- Automatic intent inference from activity
- Mission Control widget implementations
- Recommendation generation from intent gaps

---

## References

- `packages/platform/src/intent/intent-engine.ts`
- `packages/platform/src/organization/common.ts`
- `packages/platform/src/organization/founder-dna.ts` — ADR-015
- `packages/platform/src/executive/context.ts`
- `packages/platform/src/mission-control/context-runtime-widgets.ts`

---

*Every action has a why. Every why has a chain.*
