# ADR-055: Unified Organizational Timeline

**Status:** Accepted  
**Date:** 2026-07-26  
**Track:** RC1 Track B

## Context

Founders need one chronological history merging Mission Control events, council sessions, evolution milestones, journal entries, and domain events — not separate module timelines.

## Decision

Introduce `OrganizationalTimelineService` that aggregates from existing sources:

- Operational timeline (domain events)
- Council session store
- Evolution-related domain events
- Journal entries

Expose via `GET /companies/:id/mission-control/organizational-timeline`.

## Consequences

- No new storage — aggregation only
- Categories mapped from event types
- UI at `/dashboard/timeline`
- Contract: `OrganizationalTimelinePort` in platform package
