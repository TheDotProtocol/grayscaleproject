# Architecture Review — Sprint 1

**Project:** Project Grayscale  
**Version:** 0.1.0  
**Date:** 2026-07-25  
**Author:** Founding Principal Engineer / CTO  
**Status:** Step 1 Complete — No code changes from this document alone

---

## Executive Summary

Project Grayscale is a **well-scoped Phase 1 scaffold** with a coherent product vision (Founder Memory → Executive Team → Company OS). The monorepo has a working web + API loop, Prisma domain model, event bus scaffold, and landing page. It is **not yet production-grade** for multi-tenant SaaS at scale.

**Verdict:** Proceed with Sprint 1 foundation work. Do not build executive agents until platform infrastructure is hardened.

**Readiness Score:** 22/100 (see Mission Control dashboard)

---

## 1. Current Strengths

| Area | Detail |
|------|--------|
| **Monorepo tooling** | pnpm workspaces + Turborepo with `dev`, `build`, `typecheck`, `db:*`, `docker:*` scripts |
| **Architecture docs** | `docs/architecture/OVERVIEW.md` + ADR-001 with explicit cost/ROI rationale |
| **Domain model** | 17 Prisma models: users, companies, memory, journal, knowledge graph, bills, agents, notifications |
| **Backend modularity** | NestJS with 12 feature modules, Swagger at `/api/docs`, global validation pipe |
| **Auth foundation** | JWT + bcrypt, register creates user+company in transaction, seed user for dev |
| **Shared packages** | `@grayscale/shared` (executives, events, Zod) + `@grayscale/agents` (runtime, OpenAI/Ollama) |
| **Event bus** | BullMQ on Redis with typed `DomainEvent` publishing from core modules |
| **Web dashboard** | Next.js 15 App Router, auth context, protected routes, CRUD for memory/journal/billing |
| **Dev infra** | Docker Compose: Postgres 16 (pgvector) + Redis 7 with healthchecks |
| **CI pipeline** | GitHub Actions: build, typecheck, Prisma generate with service containers |
| **AI abstraction** | Provider adapter pattern with Ollama (dev) + OpenAI (demos) fallback chain |
| **Design direction** | Unified Replit dark theme (#0A0A0F, blue/purple gradients) across landing + app |

---

## 2. Weaknesses

| Severity | Issue |
|----------|-------|
| **Critical** | No company-level authorization — any authenticated user can access any `companyId` |
| **Critical** | No test suite — zero unit, integration, or e2e tests |
| **High** | No Prisma migrations — only `db push` (unsafe for production) |
| **High** | JWT in localStorage — XSS exposure, no refresh token rotation |
| **High** | Client-side-only route protection — no Next.js middleware or server session |
| **High** | Integration tokens stored plaintext in database |
| **Medium** | pgvector extension enabled but no embeddings or semantic search |
| **Medium** | Events processor is a stub — logs only, no agent routing |
| **Medium** | Waitlist API missing — frontend silently succeeds on failure |
| **Medium** | Health check shallow — no DB/Redis connectivity validation |
| **Low** | Landing components in legacy `replit/` folder |
| **Low** | Executive naming drift between dashboard UI and shared package |

---

## 3. Technical Debt Register

| ID | Area | Description | Priority | Sprint |
|----|------|-------------|----------|--------|
| TD-001 | Database | `db push` instead of migrations | High | 1 |
| TD-002 | Auth | Refresh tokens defined in env but not implemented | High | 1 |
| TD-003 | Testing | No jest/vitest/playwright configured | High | 1 |
| TD-004 | Validation | Zod schemas in shared unused by backend DTOs | Medium | 2 |
| TD-005 | Security | Plaintext GitHub tokens in DB | High | 1 |
| TD-006 | Naming | `backend/` outside `apps/` — inconsistent layout | Medium | 1 |
| TD-007 | Agents | Only 2/8 executive prompt packs exist | Medium | 3 |
| TD-008 | Desktop | Tauri expects `web/out` but Next.js outputs `.next` | Low | 4 |
| TD-009 | Mobile | Flutter has no API client layer | Low | 4 |
| TD-010 | Billing | Module is bill reminders, not SaaS subscriptions | Medium | 5 |

---

## 4. Missing Components (Enterprise Foundation)

### Must-have before beta
- [ ] Multi-tenant isolation (company membership guards)
- [ ] Prisma migrations + rollback strategy
- [ ] Refresh token rotation
- [ ] Rate limiting / API throttling
- [ ] Structured logging + error tracking (Sentry)
- [ ] Audit logging for agent actions
- [ ] Test suite with CI gates

### Should-have before scale
- [ ] Vector search / RAG pipeline (pgvector)
- [ ] Encrypted integration token storage
- [ ] WebSocket real-time notifications
- [ ] Feature flags
- [ ] Staging/production deploy configs (K8s or Vultr)
- [ ] Email transactional service

### Defer until product-market fit
- [ ] SSO (SAML/OIDC)
- [ ] Stripe subscription billing
- [ ] Kafka / managed event streaming
- [ ] Neo4j knowledge graph (Postgres edges sufficient for now)

---

## 5. Folder Structure Assessment

### Current
```
projectgrayscale/
├── apps/web, desktop, mobile
├── backend/          ← inconsistent (not under apps/)
├── packages/shared, agents
├── docs/architecture/
├── design-system/
├── prompts/
└── docker-compose.yml
```

### Recommended (Sprint 1 target)
```
projectgrayscale/
├── apps/
│   ├── web/
│   ├── api/              ← rename backend
│   ├── desktop/
│   └── mobile/
├── packages/
│   ├── shared/
│   ├── agents/
│   ├── ui/               ← shared components
│   ├── database/         ← Prisma schema + client
│   └── config/           ← eslint, tsconfig, prettier
├── docs/
│   ├── architecture/
│   ├── engineering/
│   └── adr/
├── scripts/
├── tests/
│   ├── e2e/
│   └── integration/
├── infra/
│   └── docker-compose.yml
└── design-system/
```

**Why:** Consistent `@grayscale/*` naming, colocated tests, shared config packages reduce drift.

---

## 6. Naming Inconsistencies

| Location | Current | Should Be |
|----------|---------|-----------|
| Root package | `project-grayscale` | Keep (npm name) |
| Backend folder | `backend/` | `apps/api` → `@grayscale/api` |
| Desktop | `grayscale-desktop` | `@grayscale/desktop` |
| Product UI | "Project Grayscale" / "Grayscale" / "Founder OS" | Standardize: **Project Grayscale** (product), **Grayscale** (short) |
| Dashboard executives | Hermes, Chronos | Align with shared: Athena, Atlas, Ledger, Mercury, Nova, HackBox, Market Intelligence, Bounce Box |
| Auth storage key | `pg-auth` | `grayscale-auth` |
| Landing folder | `replit/` | `landing/` |

---

## 7. Dependency Assessment

| Package | Status | Action |
|---------|--------|--------|
| Next.js 15.5, React 19, NestJS 11 | Current | Keep |
| Prisma 6.19 | Current | Add migrations workflow |
| Turbo 2.5 | Current | Keep |
| BullMQ 5.8 | Current | Keep |
| framer-motion, jspdf, docx, xlsx | Web-only, heavy | Audit bundle splitting in Sprint 2 |
| zod | Duplicated in shared + backend | Consolidate validation in Sprint 2 |
| eslint | Script exists, no config | Add `@grayscale/config` package |
| jest/vitest/playwright | Missing | Add in Sprint 1 |
| husky/lint-staged | Missing | Add in Sprint 1 |

---

## 8. Auth / Login Flow

```
User → /login → POST /api/auth/login (Next.js proxy)
                    ↓
              NestJS /api/auth/login
                    ↓
              bcrypt.compare → JWT sign
                    ↓
              { accessToken, user, company }
                    ↓
              localStorage (pg-auth) → /dashboard
```

**Dev fallback:** When API unreachable, Next.js route validates against `DEV_AUTH_*` env vars (server-side only).

**Test credentials:** `akumartrabaajo@gmail.com` / `Ak1233@@5` (seed via `pnpm db:seed`)

**Gaps:** No refresh tokens, no httpOnly cookies, no company guard on API routes.

---

## 9. Infrastructure Status

| Service | Config | Runtime Usage |
|---------|--------|---------------|
| Postgres 16 + pgvector | Docker Compose :5432 | Prisma ORM — all persistence |
| Redis 7 | Docker Compose :6379 | BullMQ queues only |
| Ollama | localhost:11434 | Dev AI provider |
| OpenAI | API key in .env | Demo/production AI |

**Setup command:** `pnpm setup:dev` (docker up → db push → seed)

---

## 10. Recommendations (Prioritized)

### Sprint 1 — Do now
1. Prisma migrations replacing `db push`
2. Company membership authorization guard on all `:companyId` routes
3. Test suite foundation (vitest + supertest for API)
4. ESLint + Prettier shared config package
5. Refresh token implementation
6. Structured logging (pino)
7. Move `backend/` → `apps/api` (optional but recommended)

### Sprint 2 — Next
1. Vector embeddings pipeline on pgvector
2. Agent base framework (no executives yet)
3. Design system package (`@grayscale/ui`)
4. E2E tests with Playwright
5. Encrypted integration tokens

### Challenge decisions
| Decision | Current | Alternative | Recommendation |
|----------|---------|-------------|----------------|
| Auth storage | localStorage JWT | httpOnly cookies + refresh | **Migrate to cookies** — better security |
| Event bus | BullMQ | Kafka | **Keep BullMQ** until 100k+ events/day |
| Vector DB | pgvector (unused) | Pinecone | **Activate pgvector first** — $0 cost |
| Mobile | Flutter scaffold | React Native | **Keep Flutter** — better desktop/mobile parity |
| Desktop | Tauri | Electron | **Keep Tauri** — smaller bundle, Rust security |

---

## Sign-off

This review is the foundation for Sprint 1. No architectural changes should be made without updating this document and creating an ADR for significant decisions.

**Next document:** [ARCHITECTURE_BLUEPRINT.md](./ARCHITECTURE_BLUEPRINT.md)
