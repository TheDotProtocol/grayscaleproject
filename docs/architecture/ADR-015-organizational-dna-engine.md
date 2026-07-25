# ADR-015: Organizational DNA Engine

**Status:** Accepted  
**Date:** 2026-07-25  
**Phase:** Sprint 2 — Phase A.2 (Organizational Intelligence)  
**Deciders:** Founding Principal Engineer  
**Foundation:** Bedrock v1.0.0-bedrock (Certified, FROZEN)

---

## Context

ADR-014 established how executives **think** (Discovery Architecture). Sprint 2 Phase A.2 defines how the platform models **what the organization is** — its immutable identity and the founder's behavioural profile.

Without formal DNA contracts, executives lack constitutional grounding: recommendations may drift from stated values, risk appetite, or founder communication preferences.

**Constraint:** Contracts and architecture only. No service implementations, no LLM inference, no executive mutation of DNA records.

---

## Decision

### 1. Organizational DNA Engine

Stores the company's **immutable identity** — vision, mission, values, operating principles, philosophies, ethical standards, brand personality, risk appetite, and non-negotiables.

- Versioned records with full evolution history
- Updates require **approval workflow** — executives MUST NOT call `proposeUpdate` or `approveVersion`
- Every field traceable via `EngineEvidenceRef` and audit trail

### 2. Founder DNA Engine (companion)

Stores the founder's **behavioural profile** derived from evidence only — leadership style, planning style, risk tolerance, communication preferences, executive interaction preferences, and historical behaviour patterns.

- Distinct from Organizational DNA (company identity ≠ operator behaviour)
- `applyEvidence` rejects updates without evidence — never inferred
- Executives consume read-only; platform applies evidence on behalf of the system

### 3. Platform Contracts

| Contract | File | Purpose |
|----------|------|---------|
| Shared types | `common.ts` | Evidence refs, versioned records, explainable scores |
| Organizational DNA | `organizational-dna.ts` | Company identity record & approval port |
| Founder DNA | `founder-dna.ts` | Founder behavioural profile & evidence port |
| Context assembler | `context.ts` | `OrganizationalIntelligenceContext` assembly |

### 4. CompanyContext Extension

`CompanyContext.organizationalIntelligence` gains optional `organizationalDna` and `founderDna` fields — assembled by platform, consumed read-only by executives.

### 5. Mission Control Widgets (reserved)

| Widget ID | Purpose |
|-----------|---------|
| `organizational-dna` | Company identity summary |
| `founder-dna` | Founder behavioural profile |

### 6. Event Catalog (reserved)

- `organizational-dna.proposed` / `organizational-dna.updated`
- `founder-dna.evidence.recorded`

---

## Consequences

### Positive

- Executives ground recommendations in stated company identity and founder preferences
- DNA evolution is auditable and approval-gated
- Founder DNA separated from Organizational DNA prevents identity conflation

### Negative

- Approval workflow adds latency for DNA changes (intentional)
- Founder DNA requires sustained evidence collection before profile is useful

### Risks

| Risk | Mitigation |
|------|------------|
| Executives mutate DNA | Port design excludes executive write access; certification gate |
| Founder profile inferred without evidence | `applyEvidence` rejects evidence-less updates |
| Org DNA treated as mutable config | Version history + approval workflow; audit trail |

---

## Compliance

| Document | Alignment |
|----------|-----------|
| EXECUTIVE_PHILOSOPHY.md | Organization-first; trust earned through evidence |
| EXECUTIVE_MANIFESTO.md v1.2 | Identity adaptation without reasoning corruption |
| EXECUTIVE_CERTIFICATION.md v1.2 | Organizational intelligence gates |
| ADR-014 | DNA feeds Discovery pipeline Identity/ECM layers |

---

## Out of Scope (Phase A.2)

- NestJS service implementations
- Database migrations for DNA storage
- Approval workflow UI
- Mission Control widget implementations
- Automatic founder behaviour inference

---

## References

- `packages/platform/src/organization/common.ts`
- `packages/platform/src/organization/organizational-dna.ts`
- `packages/platform/src/organization/founder-dna.ts`
- `packages/platform/src/organization/context.ts`
- `packages/platform/src/mission-control/organizational-widgets.ts`

---

*The organization has a soul. The founder has a pattern. Both are evidence, not assumption.*
