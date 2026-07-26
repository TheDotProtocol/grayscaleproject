# Sprint 1.5 — Core Platform Roadmap

**Date:** 2026-07-25  
**Status:** Phase 1.5H complete — Foundation gate ready for verification

The platform pillars:

1. **Event Store** — What happened?
2. **Memory Engine** — What do we know?
3. **Knowledge Graph** — How is everything connected?
4. **Strategy Engine** — What should we do next?  
**Prerequisite:** Sprint 1 Foundation ✅  
**Architecture:** [CORE_PLATFORM_DESIGN_REVIEW.md](../architecture/CORE_PLATFORM_DESIGN_REVIEW.md) — **Approved**

---

## Platform Philosophy

Every piece of information in Project Grayscale answers three questions:

| Question | System |
|----------|--------|
| **What is it?** | Domain objects (projects, tasks, bills, …) |
| **What happened to it?** | Event Store (`domain_events`) |
| **How is it connected?** | Knowledge Graph (relationships) |

The Event Store captures what happened.  
The Memory Engine preserves what is known.  
The Knowledge Graph models how everything relates.  
The Strategy Engine determines what should happen next.

---

## Approved Architecture (AIP-1 → AIP-6)

| ID | Decision | Phase |
|----|----------|-------|
| AIP-1 | Memory Index Facade — no table rewrite | 1.5B |
| AIP-2 | Postgres Event Store + BullMQ transport | **1.5A** |
| AIP-3 | Freeze executives (`EXECUTIVES_ENABLED=false`) | 1.5E |
| AIP-4 | Recommendation as first-class entity | **1.5D (SIF)** |
| AIP-5 | `@grayscale/platform` package | **1.5A** |
| AIP-6 | Mission Control Service API | 1.5G |

---

## Implementation Phases

### Phase 1.5A — Event Store ✅ (in progress)

Build the Event Store. No executive logic.

- [x] `@grayscale/platform` — catalog, envelope, projector interfaces
- [x] `domain_events` + `domain_event_failures` tables
- [x] Persist-then-publish via `EventsService`
- [x] Correlation / causation / trace IDs
- [x] Projector registry (Pulse, Plugins)
- [x] Dead letter queue (`domain-events-dlq`)
- [x] Replay API on `EventsService.replay()`
- [x] Event catalog documentation
- [ ] 80% test coverage for event module

### Phase 1.5B — Organizational Memory Engine ✅

Build the Memory Facade. No table rewrites.

- [x] `@grayscale/platform` memory types + ports
- [x] `memory_records` index table
- [x] `MemoryIngestionService` + `MemoryQueryService`
- [x] `MemoryIndexProjector` on event bus (11 event types)
- [x] Unified search API (`GET /memory/search`)
- [x] Source resolution (`GET /memory/records/:id`)
- [x] Backfill endpoint for existing data
- [x] `memory.deleted` event for index tombstoning
- [x] Agents use unified memory search for context
- [ ] pgvector semantic indexing (Sprint 2+)

### Phase 1.5C — Company Knowledge Graph ✅

**Design:** [KNOWLEDGE_GRAPH_DESIGN_REVIEW.md](../architecture/KNOWLEDGE_GRAPH_DESIGN_REVIEW.md) · **ADR:** [ADR-008](../architecture/ADR-008-knowledge-graph.md)

- [x] Memory v2 schema (identity, provenance, confidence, graphNodeId)
- [x] `@grayscale/platform/graph` + `/strategy` contracts
- [x] `graph_nodes` + `graph_edges` with entity references
- [x] Migrate Sprint 1 knowledge tables → graph (AIP-9)
- [x] GraphNodeService, GraphEdgeService, GraphValidationService
- [x] GraphTraversalService, GraphSearchService
- [x] GraphImportService, GraphExportService (provider export hook)
- [x] GraphProjector + Memory↔Graph linking
- [x] Decision node type + dependency relationships (DEPENDS_ON, REQUIRES, SUPPORTS)
- [x] Mission Control graph summary + health APIs
- [x] Strategy Engine interfaces only (fourth pillar)
- [x] Graph analytics interfaces (design only)
- [ ] 80%+ integration test coverage (unit tests: validation + mappers)

### Phase 1.5D — Strategic Intelligence Framework

**Design review:** [STRATEGIC_INTELLIGENCE_DESIGN_REVIEW.md](../architecture/STRATEGIC_INTELLIGENCE_DESIGN_REVIEW.md) — **approved**

Sprint 1.5D is the **Strategic Intelligence Framework** — not recommendation-only. Modular engines with dynamic registration orchestrated by the Strategy Engine. No LLM. No executives.

- [x] Goal Engine + Objective Engine
- [x] Priority Engine (hierarchical config — AIP-13)
- [x] Recommendation Engine (first-class, decoupled from AgentRun)
- [x] Decision Engine (recommendation → decision lifecycle)
- [x] Risk Engine + Opportunity Engine
- [x] Dependency Analyzer (Knowledge Graph integration)
- [x] Strategy Engine orchestrator + `StrategicIntelligenceContext`
- [x] Rule-based recommendation seeds (billing, integration, goals)
- [x] Decision Policies, Strategic Constraints, Scenario Planning
- [x] Company Operating Modes + Confidence Sources + Trade-Off schema
- [x] Dynamic engine registry (AIP-10) + Learning Engine interfaces (reserved)
- [x] Mission Control intelligence summary APIs (`/intelligence/*`)
- [x] Migrate `agent_recommendations` → `recommendations` (SQL migration + dual-write)
- [x] Strategic Graph Projector (AIP-11)
- [x] ADR-009 Accepted + [INTELLIGENCE_API](../api/INTELLIGENCE_API.md)

### Phase 1.5E — Executive Runtime Framework

**Renamed from:** Executive Base Framework

Runtime infrastructure only — no executive implementations, no LLM, no personalities.

- [x] Company Context Engine (`CompanyContext` assembler)
- [x] Executive Runtime (`ExecutiveRuntimePort`)
- [x] Capability Framework (dynamic registration)
- [x] Permission Framework (independent of capabilities)
- [x] Executive Communication Bus (event-driven)
- [x] Executive Inbox (8 queues)
- [x] Executive Lifecycle (13 states)
- [x] Explainability Framework
- [x] `ExecutiveBase` abstract class (platform)
- [x] `EXECUTIVES_ENABLED=false` gate on agent execution
- [x] ADR-010 + [EXECUTIVE_RUNTIME](../architecture/EXECUTIVE_RUNTIME.md) + [API](../api/EXECUTIVE_RUNTIME_API.md)

### Phase 1.5F — Integration & Plugin Platform

**Design review:** [INTEGRATION_PLUGIN_PLATFORM_DESIGN_REVIEW.md](../architecture/INTEGRATION_PLUGIN_PLATFORM_DESIGN_REVIEW.md) — **approved**

Seven-layer architecture: Connector Framework → Integration Layer → Normalization Layer → Plugin Runtime → Core Platform → Executive Runtime.

- [x] Connector Framework (`ConnectorBase` + registry + 17 providers)
- [x] GitHub production connector + reference plugin (AIP-20)
- [x] Integration Layer (auth, BullMQ sync, health, cost)
- [x] Normalization Layer (AIP-15)
- [x] Plugin Runtime (manifest v2, lifecycle, sandbox)
- [x] Credential vault (AES-256-GCM, rotation, audit)
- [x] Idempotency + duplicate suppression (AIP-22)
- [x] Integration Health Engine (AIP-23)
- [x] Integration Cost Monitor (AIP-24)
- [x] Connector Simulator (AIP-25)
- [x] Platform health APIs + ADR-011 Accepted
- [ ] ADR-011 + specs + 80%+ test coverage

**Foundation roadmap after 1.5F:**

```
1.5F Integration & Plugin Platform
  ↓
1.5G Mission Control Live
  ↓
1.5H Observability, Pulse Enhancement, Platform Hardening & Production Readiness
  ↓
FOUNDATION COMPLETE → Sprint 2 (Executive Systems)
```

### Phase 1.5G — Mission Control Live

**Design review:** [MISSION_CONTROL_DESIGN_REVIEW.md](../architecture/MISSION_CONTROL_DESIGN_REVIEW.md) — **approved**

- [x] Platform Service Registry (AIP-26) — dynamic service discovery
- [x] Platform Health Framework (AIP-27) — unified health score
- [x] Capability Discovery (AIP-28) — searchable capability catalog
- [x] Widget Framework (AIP-29) — resize, pin, collapse, refresh, export-ready
- [x] Operations Center Actions (AIP-30) — async platform jobs + events
- [x] Company Readiness Framework (AIP-31) — 14 dimensions with honest unknowns
- [x] Founder Daily Brief Framework (AIP-32) — workload intensity indicators
- [x] Operational Timeline — unified domain event history
- [x] Quick Actions + Global Search architecture
- [x] Mission Control APIs + delete `mission-control-data.ts`
- [x] ADR-012 Accepted

Replace mock panels with live APIs aggregating pulse, timeline, memory, recommendations, bills, integrations, plugins, graph, intelligence, and platform health. No duplicate business logic or storage.

### Phase 1.5H — Platform Operations & Reliability

**Design review:** [PLATFORM_OPERATIONS_RELIABILITY_DESIGN_REVIEW.md](../architecture/PLATFORM_OPERATIONS_RELIABILITY_DESIGN_REVIEW.md) — **approved**

Foundation completes when the platform is observable, diagnosable, recoverable, and trusted.

- [x] Reliability Framework (AIP-33) — SLA/SLO, error budgets, RTO/RPO
- [x] Platform Diagnostics Framework (AIP-34) — 9 subsystem probes
- [x] Performance Observatory (AIP-35) — metrics + historical trends
- [x] Recovery Framework (AIP-36) — replay, retry, snapshot, rebuild
- [x] Platform Cost Observatory (AIP-37) — 9-category cost breakdown
- [x] Platform Readiness Report (AIP-38) — Sprint 2 gate (12 sections)
- [x] Platform Governance (AIP-39) — immutable governance log + event store
- [x] Security Observatory (AIP-40) — independent Security Health
- [x] Platform Evolution (AIP-41) — version/compatibility tracking
- [x] Pulse Engine v2 — 8 domain aggregation
- [x] Mission Control ops widgets (reliability, diagnostics, metrics, cost, readiness, evolution, security)
- [x] Executive Certification Specification — Foundation gate deliverable
- [x] ADR-013 Accepted
- [x] Platform Operations API docs
- [x] 76 backend tests passing

**Foundation gate:** Sprint 2 blocked until report verdict is `READY FOR SPRINT 2`. Generate via `POST /platform/operations/readiness/generate`.

↓

**Platform Readiness Report** → **FOUNDATION COMPLETE** → Sprint 2 (Executive Systems)

---

## Documentation Deliverables

| Document | Status |
|----------|--------|
| [ADR-006 Event Store](../architecture/ADR-006-event-store.md) | ✅ |
| [Event Catalog](../platform/EVENT_CATALOG.md) | ✅ |
| Architecture diagrams | Phase 1.5A |
| Sequence diagrams | Phase 1.5A |
| Knowledge Graph docs | [KNOWLEDGE_GRAPH](../platform/KNOWLEDGE_GRAPH.md) · [GRAPH_API](../platform/GRAPH_API.md) · [ADR-008](../architecture/ADR-008-knowledge-graph.md) |
| [Memory Engine](../platform/MEMORY_ENGINE.md) | ✅ |
| [ADR-007 Memory Index](../architecture/ADR-007-memory-index-facade.md) | ✅ |
| Strategic Intelligence docs | [Design Review](../architecture/STRATEGIC_INTELLIGENCE_DESIGN_REVIEW.md) · [ADR-009](../architecture/ADR-009-strategic-intelligence-framework.md) · [INTELLIGENCE_API](../api/INTELLIGENCE_API.md) | ✅ |
| Executive Runtime docs | [EXECUTIVE_RUNTIME](../architecture/EXECUTIVE_RUNTIME.md) · [ADR-010](../architecture/ADR-010-executive-runtime-framework.md) · [API](../api/EXECUTIVE_RUNTIME_API.md) | ✅ |
| Integration & Plugin Platform docs | [Design Review](../architecture/INTEGRATION_PLUGIN_PLATFORM_DESIGN_REVIEW.md) · [ADR-011](../architecture/ADR-011-integration-plugin-platform.md) · [Connector Spec](../platform/CONNECTOR_SPECIFICATION.md) · [Plugin SDK](../platform/PLUGIN_SDK_SPECIFICATION.md) | ✅ |
| Mission Control docs | [Design Review](../architecture/MISSION_CONTROL_DESIGN_REVIEW.md) · [ADR-012](../architecture/ADR-012-mission-control-live.md) · [API](../api/MISSION_CONTROL_API.md) | ✅ |
| Platform Operations docs | [Design Review](../architecture/PLATFORM_OPERATIONS_RELIABILITY_DESIGN_REVIEW.md) · [ADR-013](../architecture/ADR-013-platform-operations-reliability.md) · [API](../api/PLATFORM_OPERATIONS_API.md) · [Readiness Report](../engineering/PLATFORM_READINESS_REPORT.md) · [Executive Cert Spec](../platform/EXECUTIVE_CERTIFICATION_SPECIFICATION.md) | ✅ |

---

## Engineering Rule

The platform is the **operating system for companies**. Every module must be reusable, event-driven, observable, testable, and independently extensible. Optimize for the next five years of platform evolution — not today's requirements alone.

---

## Gates

- ❌ No executive agents (Athena, Atlas, Ledger, Mercury, Nova, HackBox, Market Intelligence, Bounce Box)
- ❌ No LLM execution (`EXECUTIVES_ENABLED=false`)
- ❌ Sprint 2 blocked until Foundation complete (1.5F → 1.5G → 1.5H)
- ✅ Event-driven, modular, testable, documented
