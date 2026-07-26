# Infrastructure Inventory

**Grayscale OS v1.0 — Dependency audit**

Audited against repository state at tag `Grayscale-OS-v1.0-Repository-Governance`.

---

## Required for Production

| Dependency | Why it exists | Required? | Recommended provider |
|------------|---------------|-----------|----------------------|
| **GitHub** | Source control, CI, Vercel/Render integration | ✅ Required | GitHub (TheDotProtocol/grayscaleproject) |
| **PostgreSQL 16+** | Primary data store (Prisma ORM) | ✅ Required | Supabase, Neon, Render Postgres |
| **pgvector extension** | Vector embeddings in schema (`extensions = [vector]`) | ✅ Required | Enable on Postgres host |
| **Redis 7+** | BullMQ job queues, async platform jobs | ✅ Required | Render Redis, Upstash |
| **Node.js 24+** | Runtime for frontend and backend | ✅ Required | Vercel + Render |
| **NestJS backend** | REST API, auth, Mission Control, Bedrock | ✅ Required | Render Web Service |
| **Next.js frontend** | Marketing, docs, founder workspace | ✅ Required | Vercel |
| **Domain registrar** | Public URLs | ✅ Required | Cloudflare, Namecheap, etc. |
| **DNS** | Route domain → Vercel / Render | ✅ Required | Cloudflare DNS (recommended) |
| **SSL/TLS** | HTTPS | ✅ Required | Auto via Vercel + Render |
| **JWT secret** | Authentication tokens | ✅ Required | Self-generated |
| **Environment variables** | Configuration | ✅ Required | Vercel + Render panels |

---

## Recommended for Commercial Launch

| Dependency | Why it exists | Required? | Notes |
|------------|---------------|-----------|-------|
| **Stripe** | Payments (Explorer/Builder/Scale tiers) | ⚠️ Commercial | Payment Links first — no SDK in v1.0 code |
| **Custom domain** | projectgrayscale.com | ⚠️ Strongly recommended | Currently may be on Squarespace |
| **Password manager** | Secrets storage | ⚠️ Strongly recommended | 1Password, Bitwarden |

---

## Optional / Phase 2

| Dependency | Why it exists | Required? | Notes |
|------------|---------------|-----------|-------|
| **Supabase Auth** | — | ❌ Not used | App uses custom JWT auth |
| **Supabase Storage** | — | ❌ Not used | No file upload to Supabase in v1.0 |
| **Supabase Realtime** | — | ❌ Not used | |
| **Resend / SMTP** | Waitlist, contact form email | ❌ Optional | Contact form shows success only today |
| **Sentry** | Error monitoring | ❌ Optional | Recommended post-launch |
| **Datadog / Axiom** | Logs & metrics | ❌ Optional | |
| **Cloudflare CDN** | Edge caching | ❌ Optional | Vercel includes CDN |
| **Object storage (S3/R2)** | File uploads | ❌ Optional | Not in v1.0 core path |
| **Analytics (Plausible/GA)** | Marketing analytics | ❌ Optional | |
| **GitHub Actions** | CI | ✅ Exists | Already configured — not runtime |
| **Docker Compose** | Local dev only | ❌ Dev only | postgres + redis locally |

---

## Not Applicable (Documented for clarity)

| Item | Status |
|------|--------|
| Supabase Authentication | **Not integrated** — use NestJS JWT |
| Supabase Row Level Security | **Not applicable** — auth at API layer |
| Stripe Subscriptions | **Not in v1.0** — Payment Links only |
| Background workers (separate) | BullMQ runs **inside** NestJS process |
| Cron jobs (external) | OrgOS heartbeat is internal runtime |
| Webhooks (inbound) | GitHub connector future; Stripe future |

---

## Service Architecture Diagram

```
                    ┌─────────────────┐
                    │   Cloudflare    │
                    │   DNS + (CDN)   │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
     ┌────────▼────────┐           ┌────────▼────────┐
     │  Vercel         │           │  Render         │
     │  Next.js (web)  │  HTTPS    │  NestJS (API)   │
     │  :443           │◄─────────►│  :443           │
     └────────┬────────┘           └────────┬────────┘
              │                             │
              │                    ┌────────┴────────┐
              │                    │                 │
              │           ┌────────▼───┐    ┌───────▼──────┐
              │           │ PostgreSQL │    │    Redis     │
              │           │ + pgvector │    │   (BullMQ)   │
              │           └────────────┘    └──────────────┘
              │
     ┌────────▼────────┐
     │ Stripe Payment  │  (external links, optional)
     │ Links           │
     └─────────────────┘
```

---

## Backend Hosting — Render vs Alternatives

| Platform | Verdict | Reason |
|----------|---------|--------|
| **Render** | ✅ **Recommended** | Always-on web service, Redis addon, Postgres, simple founder UX |
| **Railway** | ✅ Good alternative | Similar to Render, good monorepo support |
| **Fly.io** | ✅ Good | More DevOps control, steeper learning curve |
| **Vercel (backend)** | ❌ Not recommended | Serverless limits for long-running BullMQ workers |
| **AWS ECS/EKS** | ⚠️ Enterprise later | Overkill for v1.0 founder deploy |
| **Heroku** | ⚠️ Viable | Higher cost, less modern defaults |

**Recommendation:** **Render** for API + Redis; **Vercel** for Next.js. Matches founder skill level and current architecture.

---

## Supabase — What to Configure (PostgreSQL only)

Grayscale uses Supabase as **Postgres host**, not full Supabase platform.

| Supabase feature | Configure? | Notes |
|------------------|--------------|-------|
| **Database** | ✅ Yes | Connection string → `DATABASE_URL` |
| **pgvector** | ✅ Yes | `CREATE EXTENSION vector;` |
| **Backups** | ✅ Yes | Enable PITR on Pro plan |
| **Authentication** | ❌ No | Custom JWT in NestJS |
| **Storage buckets** | ❌ No | Not in v1.0 |
| **RLS policies** | ❌ No | Company guard at API |
| **Realtime** | ❌ No | |
| **Edge Functions** | ❌ No | |
| **OAuth providers** | ❌ No | Future SSO for Enterprise |

### Indexes & migrations

All indexes defined in Prisma migrations — run `pnpm db:migrate`. No manual SQL required beyond pgvector extension.

---

## Stripe — Payment Links (v1.0)

| Item | Action |
|------|--------|
| Products | Create in Stripe Dashboard |
| Prices | One-time or recurring per tier |
| Payment Links | Share on pricing section |
| Webhook | Defer until backend endpoint exists |
| Env vars | Not required for Payment Links-only |

**Upgrade path:** Stripe Checkout → Subscriptions → Customer Portal (Sprint 5+).

---

## Vercel — Key Settings

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) § Step 8.

| Setting | Value |
|---------|-------|
| Root Directory | `apps/web` |
| Production Branch | `main` |
| Node | 24.x |
| Framework | Next.js |

Preview branches: automatic per PR — use for staging validation.

---

## Render — Backend Settings

| Setting | Value |
|---------|-------|
| Type | Web Service |
| Root | `backend` (or monorepo build from root) |
| Build | `pnpm install && prisma generate && nest build` |
| Start | `node dist/main.js` |
| Health check | `/api/docs` or health endpoint |
| Autoscaling | Manual for v1.0 (1 instance) |
| Restart policy | On failure |

---

## Backups

| Asset | Method |
|-------|--------|
| Database | Supabase/Render automatic backups + manual before migrations |
| Redis | Ephemeral — jobs can be replayed; not primary store |
| Code | GitHub |
| Secrets | Password manager export |

---

## Rate Limiting

Not implemented at edge in v1.0. Future: Cloudflare rate limits or NestJS throttler.

---

## Related

- [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- [FUTURE_CLOUD.md](./FUTURE_CLOUD.md)
