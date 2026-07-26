# Changelog — Project Grayscale

All notable changes to **Project Grayscale Foundation (Bedrock)** are documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).  
Foundation versioning: **Semantic + codename** (`v1.0.0-bedrock`).

---

## [v1.0.0-bedrock] — Foundation-v1.0-Bedrock — 2026-07-25

**Codename:** BEDROCK  
**Status:** FOUNDATION CERTIFIED — READY FOR SPRINT 2  
**Certification Score:** 96/100  
**Architecture:** FROZEN

### Foundation Summary

Project Grayscale Foundation delivers the **Company Operating System** bedrock: event-sourced core platform, memory index, knowledge graph, strategic intelligence, integration & plugin platform, live Mission Control, and platform operations & reliability. Foundation is complete, validated, and certified. Sprint 2 (Executive Intelligence Layer) may begin. Architecture is frozen — all Sprint 2 work must extend Foundation without breaking changes.

**Repository:** https://github.com/TheDotProtocol/grayscaleproject.git

### Platform Pillars

| Pillar | Description | Phase |
|--------|-------------|-------|
| **Event Store** | Postgres source of truth + BullMQ transport; persist-then-publish | 1.5A |
| **Memory Engine** | Unified cross-type memory index facade | 1.5B |
| **Knowledge Graph** | Company-scoped nodes, edges, projectors | 1.5C |
| **Strategic Intelligence** | Goals, recommendations, policies, constraints, scenarios | 1.5D |
| **Executive Runtime** | Lifecycle, permissions, inbox — framework only (`EXECUTIVES_ENABLED=false`) | 1.5E |
| **Integration & Plugin Platform** | Connectors, vault, sandbox, sync, health, cost | 1.5F |
| **Mission Control Live** | Widget framework, health, readiness, brief, timeline, search | 1.5G |
| **Platform Operations** | Reliability, diagnostics, recovery, governance, security, evolution | 1.5H |

**Distinctions preserved (non-negotiable):**

- Platform Health ≠ Platform Reliability ≠ Company Readiness ≠ Platform Readiness ≠ Security Health

### Architecture Decision Records (ADRs)

| ADR | Title | Status |
|-----|-------|--------|
| ADR-001 | Monorepo and Data Plane | Accepted |
| ADR-002 | Auth and Company Guard | Accepted |
| ADR-005 | Pulse Engine and Plugins | Accepted |
| ADR-006 | Event Store | Accepted |
| ADR-007 | Memory Index Facade | Accepted |
| ADR-008 | Knowledge Graph | Accepted |
| ADR-009 | Strategic Intelligence Framework | Accepted |
| ADR-010 | Executive Runtime Framework | Accepted |
| ADR-011 | Integration & Plugin Platform | Accepted |
| ADR-012 | Mission Control Live | Accepted |
| ADR-013 | Platform Operations & Reliability | Accepted |

### Architecture Implementation Proposals (AIPs)

| Range | Domain |
|-------|--------|
| AIP-1 → AIP-6 | Core platform decisions (memory facade, event store, platform package, Mission Control API) |
| AIP-7 → AIP-13 | Memory, graph, intelligence engines |
| AIP-14 → AIP-25 | Integration & plugin platform |
| AIP-26 → AIP-32 | Mission Control live |
| AIP-33 → AIP-41 | Platform operations, governance, security observatory, evolution, Pulse v2 |

Full implementation checklist: `docs/engineering/SPRINT_1_5_CORE_PLATFORM.md`

### Mission Control

- **18 widgets** including platform-health, pulse-feed, readiness-matrix, founder-brief, and ops widgets (reliability-dashboard, diagnostics-panel, performance-metrics, platform-cost, foundation-readiness, platform-evolution, security-health)
- Live widget-driven dashboard — static mock data removed
- Platform Service Registry, Capability Discovery, Global Search, Quick Actions
- Async Operations Center actions via BullMQ platform jobs
- Company Readiness (14 dimensions) separate from Platform Readiness gate

### Platform Operations

- Reliability Engine — SLA/SLO, error budgets, RTO/RPO per service
- Diagnostics Engine — 9 subsystem probes
- Performance Observatory — metrics + trends
- Recovery Framework — replay, snapshot, rebuild
- Platform Cost Observatory — 9-category breakdown
- Platform Governance (AIP-39) — immutable log integrated with event store
- Security Observatory (AIP-40) — independent Security Health
- Platform Evolution (AIP-41) — version and compatibility tracking
- Pulse Engine v2 — 8 domain aggregation
- Platform Readiness Report — 12-section deterministic Sprint 2 gate

API: `docs/api/PLATFORM_OPERATIONS_API.md`

### Certification

**Foundation Validation Suite** (`pnpm validate:foundation:quick` / `pnpm validate:foundation`)

| Phase | Result |
|-------|--------|
| Platform Stress Testing | PASS |
| Recovery Validation | PASS |
| Performance Benchmark | PASS |
| Security Validation | PASS (94/100) |
| Founder Workflow | PASS (83/100) |

**Verdict:** FOUNDATION CERTIFIED — READY FOR SPRINT 2  
**Overall validation score:** 96/100  
**Blockers:** None

Reports: `docs/engineering/validation/`  
Certificate: `FOUNDATION_CERTIFICATE.md`  
Executive gate spec: `docs/platform/EXECUTIVE_CERTIFICATION_SPECIFICATION.md`

### Known Limitations

- **Executives disabled** — `EXECUTIVES_ENABLED=false` until Sprint 2 implementation and per-executive certification
- **No first-class Project entity** — projects modeled as knowledge graph nodes (`nodeType=project`)
- **Semantic memory search (pgvector)** — deferred to Sprint 2+
- **Local Postgres port** — Docker Postgres mapped to **5433** to avoid conflict with macOS local Postgres on 5432
- **Docker CLI** — must be on PATH (`/Applications/Docker.app/Contents/Resources/bin`)
- **Founder UX gaps** — no launch wizard, no onboarding tour (documented in Founder Experience Report)
- **Security detect vs block** — event injection and credential expiry detected via observatory rather than hard-blocked at ingress (by design)
- **Quick validation scale** — certification run at quick scale (10 companies, 1K events); full scale available via `pnpm validate:foundation`
- **Desktop & mobile** — scaffolds only; web + API are production Foundation targets

### Engineering Metrics (Bedrock)

- **Backend tests:** 88 passing
- **Prisma migrations:** 9 applied
- **Platform contracts:** `@grayscale/platform`
- **Monorepo:** pnpm workspaces + Turbo

---

## [Sprint-4-Phase-C-AttentionBudget-v1.0] — 2026-07-26

**Context Version:** `2.2.0-s4c-attention-budget`  
**Status:** ATTENTION BUDGET CERTIFIED — `EXECUTIVES_ENABLED=false`, `AUTONOMOUS_EXECUTION_ENABLED=false`

### Added

- **Organizational Attention Budget** — `ORGANIZATIONAL_ATTENTION_BUDGET.md`
- **Autonomous Execution Governance** — constitutional rules only, no activation
- **Attention Budget Module** — allocator, capacity, debt, recovery, certification
- **CompanyContext** — 8 read-only attention budget fields
- **Mission Control** — 14 attention budget widget contracts
- **ECS Extension** — 9 Phase C compliance gates
- **ADRs 080–084**

### Verification

- `pnpm typecheck` — PASS
- `pnpm test` — 156 tests PASS

---

## [Sprint-4-Phase-B-ExecutiveCollaboration-v1.0] — 2026-07-26

**Context Version:** `2.1.0-s4b-exec-collaboration`  
**Council Runtime:** `2.0.0`  
**Status:** EXECUTIVE COLLABORATION CERTIFIED — `EXECUTIVES_ENABLED=false`

### Added

- **Executive Collaboration Constitution** — `EXECUTIVE_COLLABORATION.md`
- **Continuous Executive Council** — 7 schedule modes, runtime-owned scheduling
- **Executive Deliberation Engine** — 12-stage deterministic pipeline (no skipping)
- **Executive Collaboration Network** — 11 request kinds; all communication routed
- **Council Memory v2** — immutable searchable minutes, evidence, votes, replay
- **Collaboration Certification** — 12 ECS gates
- **Mission Control** — 15 collaboration widget contracts (UI deferred)
- **ADRs 075–079**

### Verification

- `pnpm typecheck` — PASS
- `pnpm test` — 153 tests PASS

---

## [Sprint-4-Phase-A-OrganizationalRuntime-v1.0] — 2026-07-26

**Context Version:** `2.0.0-s4a-org-runtime`  
**Status:** ORGANIZATIONAL RUNTIME CERTIFIED — `EXECUTIVES_ENABLED=false`

### Added

- **Organizational Runtime Constitution** — `ORGANIZATIONAL_RUNTIME.md`
- **OrgOS Platform Contracts** — 16 runtime ports, heartbeat, scheduler, explainability
- **Backend Runtime Module** — coordinator, heartbeat (10 steps), certification (11 gates)
- **Mission Control** — 19 runtime widget contracts
- **CompanyContext** — `organizationalRuntime`, `runtimeHealth`, `runtimeMetrics`
- **ADRs 070–074**

### Verification

- `pnpm typecheck` — PASS
- `pnpm test` — 150 tests PASS

---

## Upcoming — Sprint 2 (Not in Bedrock)

- **Athena** — Chief Executive Strategist (reference executive)
- Executive Manifesto compliance
- Per-executive certification before production
- Mission Control Athena widgets
- CompanyContext-only executive data access

**Do not implement Sprint 2 features until Executive governance documents are accepted.**

---

[Unreleased]: https://github.com/TheDotProtocol/grayscaleproject/compare/Foundation-v1.0-Bedrock...HEAD
[v1.0.0-bedrock]: https://github.com/TheDotProtocol/grayscaleproject/releases/tag/Foundation-v1.0-Bedrock
