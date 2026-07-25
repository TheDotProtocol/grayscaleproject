# ADR-001: Monorepo and Unified Data Plane

**Status:** Accepted  
**Date:** 2026-07-25  
**Confidence:** High

## Context

Project Grayscale spans web, desktop, mobile, backend, agents, and shared types. We need one repo that scales with the team.

## Decision

- **pnpm workspaces + Turborepo** for monorepo orchestration
- **Single PostgreSQL** instance with pgvector for relational + vector + knowledge graph edges
- **Redis + BullMQ** for cache, sessions, and event bus

## Alternatives Considered

| Alternative | Rejected Because |
|-------------|------------------|
| Nx monorepo | Heavier config; Turborepo sufficient at this scale |
| Separate vector DB | Extra cost, sync complexity, no Phase 1 need |
| Kafka event bus | Ops overhead; BullMQ covers Phase 1–3 volume |

## Consequences

- Positive: One `docker compose up` for full dev stack
- Positive: Shared `@grayscale/shared` types across all apps
- Negative: Must monitor Postgres size; partition/archive strategy needed at scale

## ROI

~$200–500/month saved vs managed vector DB + Kafka + separate graph DB at seed stage.
