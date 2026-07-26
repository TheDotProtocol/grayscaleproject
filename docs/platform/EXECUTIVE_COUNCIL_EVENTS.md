# Executive Council Events

**Alias document — canonical source elsewhere**

This file is a **navigation alias only**. Council events are defined once in the platform Event Catalog.

## Canonical event catalog

→ **[EVENT_CATALOG.md](./EVENT_CATALOG.md)**

Implementation: `packages/platform/src/events/catalog.ts`

## Council event types (Sprint 3 Phase B+)

| Event | Description |
|-------|-------------|
| `executive.council.message` | Sprint 2 messaging reserve (pre-council bus) |
| `council.session.started` | Council session started |
| `council.session.closed` | Council session closed |
| `council.issue.opened` | Issue opened with decision classification |
| `council.issue.classified` | Decision class assigned before deliberation |
| `council.evidence.submitted` | Evidence submitted to council |
| `council.deliberation.recorded` | Structured deliberation recorded |
| `council.vote.cast` | Vote cast with evidence |
| `council.consensus.measured` | Consensus measured deterministically |
| `council.resolution.proposed` | Resolution proposed |
| `council.decision.approved` | Council decision approved |
| `council.founder.escalated` | Issue escalated to Founder |
| `council.founder.override` | Founder override recorded |
| `council.audit.recorded` | Audit entry recorded |
| `council.collaboration.recorded` | Collaboration metrics (Phase D) |

## Architecture

→ **[EXECUTIVE_COUNCIL_ARCHITECTURE.md](./EXECUTIVE_COUNCIL_ARCHITECTURE.md)** — event-driven council runtime

→ **[EXECUTIVE_COUNCIL_RUNTIME.md](./EXECUTIVE_COUNCIL_RUNTIME.md)** — runtime implementation

All council events are append-only, versioned, auditable, and correlated.
