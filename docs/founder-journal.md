# Founder Journal

## Date: 2026-07-25

## Sprint: 1 — Platform Foundation (not feature delivery)

---

## Completed Today

- **The Pulse Engine** — invisible service: domain events → operational heartbeats → `pulse_events` table
- **7 pulse types:** project.updated, bill.due, sprint.completed, repository.changed, meeting.added, integration.failed, ai.recommendation.created
- **Plugin architecture** — `PLUGIN_HOOKS` registry in `@grayscale/shared`; `PluginsService` in backend
- **EventsProcessor upgraded** — routes all domain events → Pulse Engine + plugins (no more stub-only logging)
- **Mission Control** — live "The Pulse" feed from `/pulse/health` + `/pulse/recent` (15s refresh)
- **Event wiring** — memory updates, agent recommendations, integration disconnect, billing overdue now emit pulses
- **Documentation** — PULSE_ENGINE.md, ADR-005, plugins/README, SPRINT_1_FOUNDATION.md

---

## Architecture Decisions

| Decision | Choice | ADR |
|----------|--------|-----|
| Data plane | PostgreSQL + pgvector (single DB) | ADR-001 |
| Event bus | BullMQ on Redis (not Kafka) | ADR-001 |
| Auth (interim) | JWT + localStorage + Next.js proxy | — |
| Auth (target) | JWT refresh rotation + httpOnly cookies | ADR-002 (proposed) |
| AI providers | Ollama (dev) + OpenAI (demos) with adapter pattern | ADR-001 |
| Monorepo | pnpm + Turborepo | ADR-001 |
| Login dev fallback | Server-side env credentials when API down | — |
| **Pulse Engine** | Domain events → heartbeats; Mission Control subscribes | ADR-005 |
| **Plugin registry** | Hooks instead of module coupling | ADR-005 |

---

## Why These Decisions Were Made

1. **Single Postgres over multiple databases** — Reduces ops burden, backup complexity, and cost to $0 at seed stage. pgvector handles semantic search until millions of vectors.

2. **BullMQ over Kafka** — Same Redis instance serves queues + future cache. Kafka is overkill below 100k events/day and adds ~$200/mo managed cost.

3. **Login proxy route** — Avoids CORS issues, enables dev fallback when Docker/Postgres isn't running, keeps credentials server-side (not in client bundle).

4. **No executive agents yet** — Building agents on an unauthenticated, untested foundation creates compounding debt. Platform first.

5. **Mission Control as first "feature"** — Project Grayscale should manage itself. Dogfooding from day one validates the founder dashboard concept.

6. **NON_NEGOTIABLES as constitution** — Prevents scope creep and vanity features. Every future decision has a reference point.

---

## Files Created

| File | Purpose |
|------|---------|
| `docs/architecture/ARCHITECTURE_REVIEW.md` | Step 1 repository audit |
| `docs/architecture/ARCHITECTURE_BLUEPRINT.md` | Step 2 architecture design |
| `docs/NON_NEGOTIABLES.md` | Engineering constitution |
| `docs/founder-journal.md` | This journal |
| `apps/web/src/app/api/auth/login/route.ts` | Auth proxy + dev fallback |
| `apps/web/src/app/dashboard/mission-control/page.tsx` | Mission Control UI |
| `apps/web/src/lib/mission-control-data.ts` | Sprint 1 operational data |
| `scripts/setup-dev.sh` | One-command dev environment setup |

## Files Modified

| File | Change |
|------|--------|
| `apps/web/src/lib/auth-context.tsx` | Login via Next.js proxy |
| `apps/web/src/app/login/page.tsx` | Dev password pre-fill |
| `apps/web/next.config.ts` | Load root `.env` |
| `backend/prisma/seed.ts` | Ensure company for existing user |
| `package.json` | Added `setup:dev` script |
| `.env` / `.env.example` | Dev auth env vars |

---

## Technical Debt

| Item | Priority | Target Sprint |
|------|----------|---------------|
| No Prisma migrations | High | 1 |
| No company-level API authorization | High | 1 |
| JWT in localStorage | High | 1 |
| Zero test coverage | High | 1 |
| Dev-session-token doesn't load real dashboard data | Medium | 1 |
| Waitlist endpoint missing | Low | 2 |
| Landing folder named `replit/` | Low | 2 |
| Only 2/8 executive prompts | Medium | 3 |

---

## Open Issues

1. **Docker required for full auth** — Dev fallback works for UI access but dashboard API calls need Postgres. Run `pnpm setup:dev`.
2. **Backend not auto-started** — `pnpm dev` starts web + api via Turbo but requires Docker Postgres first.
3. **Git not initialized** — CI workflow exists but repo isn't a git repository yet.

---

## Suggestions

1. **Initialize git + first commit** — Version control is prerequisite for CI/CD and branch strategy.
2. **Add vitest to backend this week** — Start with auth service unit tests (login, register, guard).
3. **Implement company guard middleware** — Single `CompanyMemberGuard` applied to all `:companyId` routes.
4. **Rename `backend/` → `apps/api`** — Do it early before more imports reference the old path.
5. **Consider Supabase as alternative** — If self-hosting Postgres becomes a burden, Supabase free tier gives auth + DB + realtime. Challenge: less control, vendor dependency. Verdict: stick with self-hosted for now per local-first principle.

---

## Next Recommended Tasks

1. Run `pnpm setup:dev` then verify login with test credentials
2. Prisma migrations — `prisma migrate dev --name init`
3. Company membership authorization guard
4. Refresh token implementation
5. Vitest + first auth tests
6. ESLint/Prettier shared config package
7. ADR-002 (auth strategy) and ADR-003 (folder restructure)
8. README per major folder

---

## Estimated Completion

| Milestone | Estimate |
|-----------|----------|
| Sprint 1 foundation | 2 weeks (by 2026-08-08) |
| MVP (founder-ready product) | 8 weeks |
| First executive agent (Athena) | Sprint 3 (~4 weeks) |
| Mobile/Desktop parity | Sprint 4–5 (~6–8 weeks) |

---

## Confidence

| Area | Confidence | Notes |
|------|------------|-------|
| Architecture direction | **High** | Postgres + BullMQ + NestJS is proven at scale |
| Sprint 1 scope | **High** | Well-defined, no agent complexity |
| Login working end-to-end | **High** | With `pnpm setup:dev` |
| 8-week MVP timeline | **Medium** | Depends on founder availability + scope discipline |
| Flutter mobile Sprint 1 | **Low** | Defer to Sprint 4 — web + API first |
| Self-hosted cost target (<$50/mo) | **High** | Vultr + Docker keeps costs minimal |

**Overall Sprint 1 confidence: High (85%)**

---

*Project Grayscale — managing itself, one sprint at a time.*
