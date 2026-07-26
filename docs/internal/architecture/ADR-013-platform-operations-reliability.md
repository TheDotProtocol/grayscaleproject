# ADR-013: Platform Operations & Reliability

**Status:** Accepted  
**Date:** 2026-07-25  
**Phase:** 1.5H  
**Deciders:** Founding Principal Engineer

---

## Context

Phases 1.5A–1.5G built the Core Platform, Integration & Plugin Platform, and Mission Control Live. The platform can report **health** (1.5G) and **company readiness** (1.5G), but cannot yet:

- Prove **reliability** against SLO commitments
- **Diagnose** root causes across subsystems
- Show **performance trends** over time
- **Recover** deterministically from failures
- Track **full platform operational costs**
- **Gate Sprint 2** with engineering evidence

Sprint 2 (Executive Systems) requires trust that the foundation is production-grade. `EXECUTIVES_ENABLED=false` must remain until a formal Platform Readiness Report concludes `READY FOR SPRINT 2`.

---

## Decision

1. **Platform Operations Module** — New `PlatformOperationsModule` providing reliability, diagnostics, performance, recovery, cost, and readiness services. Extends Mission Control; does not duplicate health logic from 1.5G.

2. **Reliability Framework (AIP-33)** — Per-service SLA/SLO profiles with error budgets, RTO/RPO. Aggregated separately from health metrics in Mission Control.

3. **Diagnostics Framework (AIP-34)** — Nine standardized subsystem probes (memory, graph, strategy, executive, sandbox, integration, security, storage, queue). Findings exposed via `/platform/operations/diagnostics`.

4. **Performance Observatory (AIP-35)** — Metrics collection via NestJS interceptor + scheduled BullMQ collector. Time-series storage with 30-day retention. Categories: API latency, queue depth, worker throughput, slow queries, event processing, resource usage.

5. **Recovery Framework (AIP-36)** — Deterministic recovery workflows: replay, retry, snapshot, rebuild. Async via platform jobs with audit trail. Reuses existing `EventsService.replay()`.

6. **Platform Cost Observatory (AIP-37)** — Extends Integration Cost Monitor (1.5F) to nine platform cost categories with deterministic estimation.

7. **Platform Readiness Report (AIP-38)** — Deterministic engineering assessment across 12 sections. Verdict: `READY FOR SPRINT 2` or `NOT READY`. Formal gate before Sprint 2.

8. **Pulse Engine v2** — Seven new pulse types for SLO breaches, diagnostics, recovery, and readiness events.

9. **Contracts in `@grayscale/platform`** — New `operations/` exports for all frameworks.

---

## Consequences

### Positive

- Foundation completes with engineering evidence, not assumptions
- Sprint 2 gated by deterministic readiness report
- Subsystems become self-explaining and self-recovering
- Performance and cost visibility for engineering decisions
- Reliability separated from health — clearer operational model

### Negative

- Metrics storage adds database growth (mitigated: retention policy, aggregation)
- Recovery operations require careful safety gates (mitigated: confirmation flags, audit)
- Readiness report may block Sprint 2 if criteria not met (intentional gate)

### Neutral

- External APM deferred (1.5H uses internal observatory)
- Multi-region DR architecture designed but not deployed
- Cost estimates are deterministic models, not billing integration

---

## Out of Scope (1.5H)

- External monitoring SaaS integration
- Multi-region deployment
- PagerDuty/Slack alerting
- Executive agent execution
- Automated CI coverage gate (manual evidence acceptable for first report)

---

## References

- [Platform Operations Design Review](./PLATFORM_OPERATIONS_RELIABILITY_DESIGN_REVIEW.md)
- [Platform Operations API](../api/PLATFORM_OPERATIONS_API.md)
- [Platform Readiness Report](../engineering/PLATFORM_READINESS_REPORT.md)
- [ADR-012: Mission Control Live](./ADR-012-mission-control-live.md)
