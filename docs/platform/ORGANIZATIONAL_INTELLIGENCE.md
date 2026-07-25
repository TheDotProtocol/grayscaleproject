# Organizational Intelligence

**Project Grayscale — Master Architecture Document**

**Version:** 1.0  
**Status:** Constitutional — Sprint 2 Phase A.2  
**Foundation:** Bedrock v1.0.0-bedrock (Certified, FROZEN)  
**Companion:** ADR-014 (Executive Discovery), ADR-015–022 (Organizational Engines)

---

## Purpose

Executives must eventually understand an organization the way an experienced founder would — not merely *what data exists*, but:

- **Who are we?** (Organizational DNA)
- **Who leads us?** (Founder DNA)
- **How do we feel?** (Emotional Engine)
- **How do we think?** (Cognitive Engine)
- **What have we learned?** (Learning Engine)
- **What principles guide us?** (Wisdom Engine)
- **How do we behave?** (Culture Engine)
- **How are we perceived?** (Reputation Engine)
- **How ready are we to change?** (Adaptation Engine)

This document defines how the nine **Organizational Intelligence engines** work together as permanent Core Platform capabilities inherited by every executive.

**Phase A.2 delivers contracts only.** No implementations. No LLM. No recommendations. `EXECUTIVES_ENABLED` remains `false`.

---

## Architectural Position

Organizational Intelligence **extends Bedrock** — it does not rewrite it.

```
Bedrock (FROZEN)
├── Memory Engine          ← company facts
├── Knowledge Graph        ← relationships
├── Strategy Engine        ← goals, risks, opportunities
├── Timeline               ← chronological events
├── Mission Control        ← operational visibility
└── CompanyContext         ← unified executive input

Sprint 2 Phase A.2 (NEW — contracts)
└── Organizational Intelligence Layer
    ├── Organizational DNA Engine
    ├── Founder DNA Engine
    ├── Organizational Emotional Engine
    ├── Organizational Cognitive Engine
    ├── Organizational Learning Engine
    ├── Organizational Wisdom Engine
    ├── Organizational Culture Engine
    ├── Organizational Reputation Engine
    └── Organizational Adaptation Engine
```

CompanyContext gains `organizationalIntelligence?: OrganizationalIntelligenceContext` — assembled by platform, read-only to executives.

---

## Engine Overview

| # | Engine | Question Answered | ADR | Contract |
|---|--------|-------------------|-----|----------|
| 1 | Organizational DNA | Who are we? | ADR-015 | `organizational-dna.ts` |
| 2 | Founder DNA | Who leads us? | ADR-015 §2 | `founder-dna.ts` |
| 3 | Emotional | How do we feel? | ADR-016 | `emotional-engine.ts` |
| 4 | Cognitive | How do we think? | ADR-017 | `cognitive-engine.ts` |
| 5 | Learning | What have we learned? | ADR-018 | `organizational-learning.ts` |
| 6 | Wisdom | What principles guide us? | ADR-019 | `wisdom-engine.ts` |
| 7 | Culture | How do we behave? | ADR-020 | `culture-engine.ts` |
| 8 | Reputation | How are we perceived? | ADR-021 | `reputation-engine.ts` |
| 9 | Adaptation | How ready are we to change? | ADR-022 | `adaptation-engine.ts` |

---

## Distinction Matrix

| Layer | Stores | Example | Mutable By Executives |
|-------|--------|---------|----------------------|
| **Memory** | Company facts | "Q3 revenue was $1.2M" | No |
| **Learning** | Lessons from events | "Launch failed due to scope creep" | No |
| **Wisdom** | Enduring principles | "Ship smaller, validate faster" | No |
| **Organizational DNA** | Immutable identity | Vision, values, non-negotiables | No (approval workflow) |
| **Founder DNA** | Founder behavioural evidence | Decision habits, risk tolerance | No (evidence only) |
| **Emotional** | Wellbeing observations | Founder stress, team morale | No (observe only) |
| **Cognitive** | Org thinking patterns | Planning maturity, bias detection | No |
| **Culture** | Behavioural health | Meeting quality, accountability | No |
| **Identity Engine** (A.1) | Operator presentation prefs | Tone, language, avatars | No |
| **ECM** (A.1) | Operator behavioural model | Focus duration, planning style | No |

**No duplicate storage.** Each engine owns its domain. Cross-references use `EngineLinkRef` (memory IDs, graph node IDs, strategy IDs, timeline IDs, project IDs).

---

## Data Flow

```
Evidence / Events / Observations
        ↓
Organizational Intelligence Engines
        ↓
Immutable Domain Events (event catalog)
        ↓
Synchronized Projections
├── Memory (linked references)
├── Knowledge Graph (linked nodes)
├── Timeline (chronological entries)
├── Strategy (wisdom informs evaluation)
└── Mission Control (widget snapshots)
        ↓
CompanyContext.organizationalIntelligence
        ↓
Executive Discovery Pipeline (ADR-014)
        ↓
[Future: Recommendation Mode]
```

---

## Common Requirements (All Engines)

Every engine MUST be:

| Requirement | Implementation |
|-------------|----------------|
| **Versioned** | `VersionedEngineRecord` with immutable history |
| **Event-driven** | Domain events in `events/catalog.ts` |
| **Explainable** | `ExplainableScore` with evidence, confidence, reason, trend |
| **Auditable** | `EngineAuditEntry` trail |
| **Graph-aware** | `EngineLinkRef.graphNodeIds` |
| **Memory-aware** | `EngineLinkRef.memoryIds` |
| **Strategy-aware** | Wisdom consumed before strategy; learning links to strategy |
| **Mission Control aware** | Reserved widget IDs |
| **CompanyContext aware** | Assembled into `OrganizationalIntelligenceContext` |
| **Executive read-only** | Executives consume; never mutate |
| **Provider independent** | Port interfaces only in Phase A.2 |

---

## Executive Consumption Rules

From constitutional documents (Phase A.2):

1. Executives **inherit** identity, culture, cognition, wisdom, and emotional context
2. Executives **never invent** organizational identity
3. Executives **never manipulate** emotional state
4. Executives **never bypass** governance or approval workflows
5. Executives **earn trust** through evidence — same as Phase A.1
6. Recommendations **must adapt** to identity, cognition, learning, wisdom, and emotional context
7. Wisdom is consumed **before** Strategy evaluation in the reasoning pipeline

---

## Mission Control Widgets (Reserved)

| Widget ID | Engine |
|-----------|--------|
| `organizational-dna` | Organizational DNA |
| `founder-dna` | Founder DNA |
| `organization-emotion` | Emotional (org-wide) |
| `founder-emotion` | Emotional (founder metrics) |
| `organizational-cognitive-profile` | Cognitive |
| `learning-timeline` | Learning |
| `wisdom-library` | Wisdom |
| `culture-health` | Culture |
| `reputation` | Reputation |
| `adaptation-index` | Adaptation |

Contract: `packages/platform/src/mission-control/organizational-widgets.ts`

---

## Event Catalog (Reserved)

| Event | Engine |
|-------|--------|
| `organizational-dna.updated` / `.proposed` | DNA |
| `founder-dna.evidence.recorded` | Founder DNA |
| `organizational-emotion.observed` | Emotional |
| `organizational-cognitive.evidence.recorded` | Cognitive |
| `organizational-learning.recorded` / `.linked` | Learning |
| `organizational-wisdom.proposed` / `.approved` | Wisdom |
| `organizational-culture.observed` | Culture |
| `organizational-reputation.signal.recorded` | Reputation |
| `organizational-adaptation.metric.recorded` | Adaptation |

All events category: `organization`. Version: 1.

---

## Relationship to Executive Discovery (ADR-014)

Discovery pipeline stages consume organizational intelligence:

```
Observe
    ↓
Identity Engine (operator)
    ↓
Executive Cognitive Model (operator behaviour)
    ↓
Organizational Intelligence ← Phase A.2 engines assemble here
    ↓
Memory Engine
    ↓
... (remaining ADR-014 pipeline)
```

Organizational Intelligence deepens CompanyContext **before** Athena is allowed to think.

---

## Phase Roadmap

| Phase | Deliverable |
|-------|-------------|
| **A.2** (this) | Contracts, ADRs, constitutional alignment, reserved widgets/events |
| **A.3** | NestJS service implementations, Prisma schemas, event projectors |
| **B** | Athena executive consumes organizational intelligence via CompanyContext |

---

## References

- `docs/architecture/ADR-015-organizational-dna-engine.md` through `ADR-022`
- `docs/architecture/ADR-014-athena-discovery-architecture.md`
- `packages/platform/src/organization/` — all engine contracts
- `docs/platform/EXECUTIVE_PHILOSOPHY.md`
- `docs/platform/EXECUTIVE_MANIFESTO.md`
- `docs/sprint-2/ATHENA_DISCOVERY.md`

---

*Build the Organization. Not the Chatbot.*
