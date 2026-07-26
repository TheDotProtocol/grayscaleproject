# Sprint 1 — Platform Foundation

**Sprint 1 is NOT about building features.** It is about making Project Grayscale capable of supporting every feature we will ever build.

---

## Objective

Create a scalable, production-grade foundation for:

- Thousands of companies
- Millions of workflows
- Eight executive agents (Sprint 3+)
- Web, desktop, and mobile clients

---

## In Scope

| Area | Deliverable |
|------|-------------|
| **Infrastructure** | Docker, Postgres, Redis, env management |
| **Event-driven architecture** | BullMQ domain bus → Pulse Engine |
| **Pulse Engine** | 7 heartbeat types, health API, Mission Control subscription |
| **Plugin architecture** | Hook registry, manifests, core plugins |
| **Memory** | CRUD + event emission (project.updated pulses) |
| **Mission Control** | Live operational pulse + sprint tracking |
| **Documentation** | ADRs, READMEs per module, NON_NEGOTIABLES |
| **Developer Experience** | `pnpm setup:dev`, monorepo scripts |
| **Auth** | Login working, refresh tokens (pending) |

---

## Out of Scope (Sprint 1)

- Executive agent implementations
- Vector search / RAG
- Stripe billing
- Flutter/Tauri production builds
- SSO / passkeys

---

## Success Criteria

1. Any module action emits a domain event → pulse → Mission Control updates
2. New capability can register a plugin hook without editing core
3. `pnpm setup:dev && pnpm dev` → working login + pulse feed
4. Architecture documented with ADRs for major decisions
5. Zero features shipped without measurable founder benefit (NON_NEGOTIABLES #6)

---

## Current Readiness: ~28%

See Mission Control dashboard for live pulse health score.

---

**Next sprint gate:** Prisma migrations + company auth guard + vitest before Sprint 2 (Memory Engine enhancements).
