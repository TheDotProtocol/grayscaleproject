# ADR-005: Pulse Engine and Plugin Architecture

**Status:** Accepted  
**Date:** 2026-07-25  
**Deciders:** Founding Principal Engineer

---

## Context

Project Grayscale must support thousands of companies and millions of workflows. Polling each module for Mission Control health is not scalable. Executive agents (Sprint 3+) must plug in without rewriting core services.

---

## Decision

1. **The Pulse Engine** — invisible service that converts domain events into operational heartbeats (`pulse_events` table).
2. **Plugin registry** — in-process hook system (`PLUGIN_HOOKS`) so capabilities register handlers instead of importing each other.
3. **Event flow:** Module → BullMQ → EventsProcessor → Pulse Engine + Plugins → Mission Control API.

---

## Alternatives Considered

| Alternative | Rejected Because |
|---------------|------------------|
| Mission Control polls each module API | O(n modules) coupling; breaks at scale |
| Kafka for pulse events | Overkill + cost; BullMQ sufficient |
| GraphQL subscriptions only | Requires GraphQL layer we don't have; SSE + poll is simpler for Sprint 1 |
| Microservice for Pulse | Premature; monolith module is correct until proven otherwise |

---

## Consequences

**Positive:**
- New modules emit domain events; Mission Control auto-updates
- Plugins decouple executives, integrations, and future features
- Single event stream for audit, analytics, and agent triggers

**Negative:**
- Requires Redis + BullMQ running for async pulse processing
- In-process plugins don't survive horizontal scaling without shared queue (acceptable Sprint 1–2)

---

## Compliance

- **NON_NEGOTIABLES #7:** Simplicity — one event bus, one pulse layer, no duplicate streams
- **NON_NEGOTIABLES #10:** Portability — pulse types defined in `@grayscale/shared`

---

## Follow-up

- [ ] Wire SSE in Mission Control web UI (currently 15s poll)
- [ ] Plugin package loader for external integrations
- [ ] Pulse retention policy (90 days default)
