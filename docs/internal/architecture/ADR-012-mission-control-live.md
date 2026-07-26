# ADR-012: Mission Control Live

**Status:** Approved — **implemented** (Phase 1.5G complete)  
**Date:** 2026-07-25  
**Phase:** 1.5G  
**Deciders:** Founding Principal Engineer

---

## Context

Mission Control is the operational command center of Project Grayscale. Today:

- The UI at `apps/web/.../mission-control/page.tsx` renders ~90% static data from `mission-control-data.ts`
- Only the Pulse feed polls live APIs (`/pulse/health`, `/pulse/recent`)
- Platform modules (Memory, Graph, Intelligence, Integration, Executive Runtime) expose live APIs but Mission Control does not consume them
- `DashboardService.getDailyBriefing()` performs ad-hoc Prisma queries without a structured brief framework
- No service registry, capability discovery, widget framework, or unified action dispatch exists

Phase 1.5F delivered integration health, cost monitoring, and plugin status APIs designed for Mission Control consumption (1.5G).

AIP-6 (Core Platform Design Review) identified eliminating static dashboard data as a foundation requirement.

---

## Decision

1. **Mission Control as aggregation layer** — New `MissionControlModule` orchestrates live data from registered platform services. Mission Control owns no domain data.

2. **Platform Service Registry (AIP-26)** — Every platform module self-registers name, version, capabilities, health probe, routes, and dependencies at startup. Mission Control discovers services dynamically.

3. **Platform Health Framework (AIP-27)** — Standardized `ServiceHealthReport` from each service. Mission Control computes a unified Platform Health Score (0–100).

4. **Capability Discovery (AIP-28)** — Capabilities declared at registration, exposed via `/platform/capabilities`. Reused by Mission Control, APIs, and Executive Runtime.

5. **Widget Framework (AIP-29)** — Mission Control UI is widget-driven. Each widget declares data provider, refresh policy, permissions, actions, and layout metadata. User layouts persisted in `MissionControlLayout`.

6. **Operations Center Actions (AIP-30)** — Unified action dispatch via `POST /mission-control/actions`. Widgets and APIs invoke actions without business logic in the UI.

7. **Company Readiness Framework (AIP-31)** — Deterministic readiness scoring across 10 dimensions. Dimensions without data return `unknown` — never fake scores.

8. **Founder Daily Brief Framework (AIP-32)** — Deterministic assembly of 10 brief sections from live APIs. No LLM generation in 1.5G. Cached in existing `daily_briefings` table.

9. **Delete static data** — Remove `mission-control-data.ts` upon completion. Static panels replaced with live widgets or honest empty states.

10. **Contracts in `@grayscale/platform`** — Registry, health, capability, widget, action, readiness, and brief ports exported from platform package.

---

## Consequences

### Positive

- Single operational interface reflecting live platform state
- Service discovery enables future modules without UI changes
- Widget framework supports plugin UI extensions (1.5F manifest `uiExtensions`)
- Action dispatcher reusable by executives in Sprint 2
- Readiness and brief frameworks provide deterministic founder intelligence without LLM cost

### Negative

- Initial dashboard load requires parallel API fan-out (mitigated: 500ms target, widget-level lazy load)
- 12+ service registrations add startup complexity (mitigated: idempotent registration, health cache)
- Layout persistence adds Prisma tables and migration

### Neutral

- Polling acceptable in 1.5G; SSE enhancement deferred to 1.5H
- Code coverage widget depends on CI artifact (honest empty until configured)
- Hiring/Legal readiness dimensions return `unknown` until future modules

---

## Out of Scope (1.5G)

- LLM-generated brief narratives
- Third-party widget marketplace
- Executive agent execution
- Full SSE for all widgets (1.5H)
- Mobile Mission Control layout

---

## References

- [Mission Control Design Review](./MISSION_CONTROL_DESIGN_REVIEW.md)
- [Mission Control API](../api/MISSION_CONTROL_API.md)
- [ADR-011: Integration & Plugin Platform](./ADR-011-integration-plugin-platform.md)
- [AIP-6: Mission Control Backend API](./CORE_PLATFORM_DESIGN_REVIEW.md)
