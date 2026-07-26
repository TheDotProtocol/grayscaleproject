# Grayscale OS v1.0 — Deployment Guide

**Official production deployment manual**

**Version:** 1.0  
**Tag:** Grayscale-OS-v1.0-Deployment-Playbook  
**Audience:** Founder — first production deployment  
**Mode:** One service at a time. Validate before proceeding.

---

## Before You Begin

Read these documents in order:

1. [INFRASTRUCTURE.md](./INFRASTRUCTURE.md) — every dependency explained
2. [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) — complete variable inventory
3. [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) — printable checklist
4. This guide — step-by-step sequence

**Non-negotiables for Grayscale OS v1.0 production:**

```bash
EXECUTIVES_ENABLED=false
AUTONOMOUS_EXECUTION_ENABLED=false
DEV_AUTH_ENABLED=false
NODE_ENV=production
```

Do **not** enable executives or autonomous execution in production until explicitly certified and approved.

---

## Architecture Summary (Current Codebase)

| Layer | Technology | Production host (recommended) |
|-------|------------|-------------------------------|
| **Frontend** | Next.js 15 (`apps/web`) | **Vercel** |
| **Backend API** | NestJS 11 (`backend/`) | **Render** Web Service (or Railway / Fly.io) |
| **Database** | PostgreSQL 16 + **pgvector** | Supabase Postgres, Neon, or Render Postgres |
| **Queue / cache** | Redis 7 + BullMQ | Render Redis, Upstash, or Redis Cloud |
| **Auth** | Custom JWT (NestJS) | Built-in — **not** Supabase Auth |
| **Payments** | Not wired yet | **Stripe Payment Links** (manual setup) |
| **Email** | Not wired yet | **Resend** (optional, Phase 2) |

> **Important:** Grayscale does **not** currently use Supabase Auth, Supabase Storage, or Stripe SDK in code. Supabase is documented as an **optional PostgreSQL host** (with pgvector). Stripe Payment Links are configured in the Stripe Dashboard without code changes initially.

---

## Deployment Sequence Overview

| Step | Service | Document section |
|------|---------|------------------|
| 1 | GitHub repository | § Step 1 |
| 2 | Domain & DNS planning | § Step 2 |
| 3 | PostgreSQL (pgvector) | § Step 3 |
| 4 | Redis | § Step 4 |
| 5 | Environment secrets inventory | § Step 5 |
| 6 | Prisma migrations | § Step 6 |
| 7 | Backend (Render) | § Step 7 |
| 8 | Frontend (Vercel) | § Step 8 |
| 9 | Connect frontend ↔ backend | § Step 9 |
| 10 | Custom domains & SSL | § Step 10 |
| 11 | Stripe Payment Links | § Step 11 |
| 12 | Email (Resend) — optional | § Step 12 |
| 13 | Production smoke test | § Step 13 |
| 14 | Go live | [GO_LIVE_CHECKLIST.md](./GO_LIVE_CHECKLIST.md) |

Each step below includes: **What to do**, **Expected result**, **Validation**, **Rollback**.

---

## Step 1 — GitHub Repository

### What to do

1. Open https://github.com/TheDotProtocol/grayscaleproject
2. Confirm `main` branch contains tag `Grayscale-OS-v1.0-Repository-Governance` or later
3. Ensure you have admin access to connect Vercel and Render

### Expected result

- Repository accessible
- Latest commit on `main` matches local production candidate

### Validation

```bash
git clone https://github.com/TheDotProtocol/grayscaleproject.git
cd grayscaleproject
git log -1 --oneline
pnpm install
pnpm typecheck
```

All commands succeed without errors.

### Rollback

N/A — no infrastructure created yet.

---

## Step 2 — Domain & DNS Planning

### What to do

Decide domains (example):

| Purpose | Example |
|---------|---------|
| Marketing + docs + app | `www.projectgrayscale.com` |
| API | `api.projectgrayscale.com` |

Register or transfer domain in your registrar (Cloudflare, Namecheap, etc.). **Do not point DNS yet** — record planned hostnames.

### Expected result

- Domain registered and in your control
- DNS provider access ready

### Validation

- WHOIS lookup shows your ownership
- DNS dashboard loads

### Rollback

N/A

---

## Step 3 — PostgreSQL (pgvector required)

Grayscale **requires** PostgreSQL with the **pgvector** extension (see `backend/prisma/schema.prisma`).

### Option A — Supabase (recommended for founders)

1. Go to https://supabase.com → **New project**
2. Choose region closest to users
3. Set strong database password → **save in password manager**
4. Wait for project provisioning (~2 min)
5. Go to **Project Settings → Database → Connection string → URI**
6. Copy **Session pooler** or **Direct** connection string (for Prisma migrations, use **Direct** or transaction mode)
7. Enable pgvector:
   - Open **SQL Editor**
   - Run:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

8. Verify:

```sql
SELECT * FROM pg_extension WHERE extname = 'vector';
```

### Option B — Neon / Render Postgres

Ensure pgvector is supported and enabled. For Neon, enable pgvector in project settings. For Render Postgres, use PostgreSQL 16+ and run the same `CREATE EXTENSION` SQL.

### Expected result

- `DATABASE_URL` connection string saved securely
- pgvector extension active

### Validation

From your local machine (with `.env` pointing to production DB **temporarily** for migration only):

```bash
pnpm db:migrate
```

Exit code 0. All migrations in `backend/prisma/migrations/` applied.

Then verify tables exist (Supabase **Table Editor** or `pnpm db:studio`).

### Rollback

- Supabase: delete project (destroys data)
- Or restore from Supabase backup if created

See [ROLLBACK_GUIDE.md](./ROLLBACK_GUIDE.md)

---

## Step 4 — Redis

Required for BullMQ job queues (platform operations, async jobs).

### Option A — Render Redis

1. Render Dashboard → **New +** → **Redis**
2. Name: `grayscale-redis`
3. Region: same as backend
4. Copy **Internal Redis URL** (for Render backend) or **External** (for local testing only)

### Option B — Upstash Redis

1. https://upstash.com → Create Redis database
2. Copy `REDIS_URL` (TLS URL)

### Expected result

- `REDIS_URL` saved securely

### Validation

```bash
redis-cli -u "$REDIS_URL" ping
```

Returns `PONG`.

### Rollback

Delete Redis instance in provider dashboard.

---

## Step 5 — Secrets & Environment Variables

Using [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md), prepare all values **before** deploying services.

Minimum production set:

```bash
# Backend (Render)
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=<64+ random chars>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=production
API_PORT=4000
WEB_URL=https://www.projectgrayscale.com
EXECUTIVES_ENABLED=false
DEV_AUTH_ENABLED=false

# Frontend (Vercel)
NEXT_PUBLIC_API_URL=https://api.projectgrayscale.com/api
API_URL=https://api.projectgrayscale.com
```

Generate JWT secret:

```bash
openssl rand -base64 48
```

### Expected result

- All variables documented in password manager
- No secrets committed to Git

### Validation

- Cross-check against ENVIRONMENT_VARIABLES.md
- Confirm `DEV_AUTH_*` variables are **not** set in production

### Rollback

Rotate JWT secret (forces re-login) if leaked.

---

## Step 6 — Run Prisma Migrations

Run **once** against production database before backend deploy.

```bash
cd grayscaleproject
cp .env.example .env
# Edit .env with production DATABASE_URL only
pnpm install
pnpm db:migrate
pnpm db:generate
```

Optional seed (development data — **skip for production** unless intentional):

```bash
# Do NOT run db:seed in production unless you understand seed contents
```

### Expected result

- All migrations applied
- Prisma client generated

### Validation

```bash
pnpm --filter @grayscale/backend exec prisma migrate status
```

Shows all migrations applied.

### Rollback

See [ROLLBACK_GUIDE.md](./ROLLBACK_GUIDE.md) — database restore from backup.

---

## Step 7 — Deploy Backend (Render)

See [INFRASTRUCTURE.md](./INFRASTRUCTURE.md) § Backend Hosting for full Render setup.

### Quick steps

1. Render → **New +** → **Web Service**
2. Connect GitHub repo `grayscaleproject`
3. Settings:

| Setting | Value |
|---------|-------|
| Root Directory | `backend` |
| Runtime | Node |
| Build Command | `pnpm install && pnpm exec prisma generate && pnpm build` |
| Start Command | `node dist/main.js` |
| Node Version | 24 |

4. Add all backend environment variables from Step 5
5. **Health Check Path:** `/api/platform/health` (or create — verify Swagger at `/api/docs`)
6. Deploy

> **Note:** Render build may need monorepo context. Alternative build from repo root:
> `cd .. && pnpm install && pnpm --filter @grayscale/backend build`

### Expected result

- Service URL: `https://grayscale-api.onrender.com` (example)
- Swagger: `https://<host>/api/docs` loads

### Validation

```bash
curl -s https://<your-api-host>/api/docs | head -20
curl -s https://<your-api-host>/api/platform/health
```

API responds (health endpoint may require auth — check Swagger).

Register test user via `/api/auth/register` if exposed, or use existing seed policy.

### Rollback

Render → Service → **Manual Deploy** → previous deploy, or suspend service.

---

## Step 8 — Deploy Frontend (Vercel)

1. https://vercel.com → **Add New Project**
2. Import GitHub `grayscaleproject`
3. Settings:

| Setting | Value |
|---------|-------|
| Framework Preset | Next.js |
| Root Directory | `apps/web` |
| Build Command | `cd ../.. && pnpm install && pnpm --filter @grayscale/web build` |
| Install Command | `pnpm install` |
| Output Directory | `.next` (default) |
| Node.js Version | 24.x |

4. Environment variables (Production):

```
NEXT_PUBLIC_API_URL=https://<your-api-host>/api
API_URL=https://<your-api-host>
```

5. Deploy

### Expected result

- Vercel URL: `https://grayscaleproject.vercel.app`
- Landing page styled (not plain HTML)
- `/docs` loads

### Validation

- Open Vercel URL — full styling, no console errors
- `/docs`, `/contact`, `/leadership` load

### Rollback

Vercel → Deployments → Promote previous deployment.

---

## Step 9 — Connect Frontend ↔ Backend

1. Update backend `WEB_URL` to Vercel production URL (then custom domain)
2. Redeploy backend (CORS uses `WEB_URL`)
3. Test login/register from Vercel URL

### Expected result

- Register → login → `/dashboard/home` works
- Mission Control loads data from API

### Validation

See [PRODUCTION_VALIDATION.md](./PRODUCTION_VALIDATION.md) § Authentication & Dashboard

### Rollback

Revert `WEB_URL` and redeploy backend.

---

## Step 10 — Custom Domains & SSL

### Vercel (frontend)

1. Vercel → Project → **Settings → Domains**
2. Add `www.projectgrayscale.com` and `projectgrayscale.com`
3. Copy DNS records Vercel provides
4. Paste in domain registrar DNS
5. Wait for SSL provisioning (automatic)

### Render (backend)

1. Render → Service → **Settings → Custom Domains**
2. Add `api.projectgrayscale.com`
3. Add CNAME at registrar
4. SSL automatic

Update environment variables to use custom domains. Redeploy both services.

### Expected result

- https://www.projectgrayscale.com loads
- https://api.projectgrayscale.com/api/docs loads
- Valid SSL (padlock in browser)

### Validation

```bash
curl -I https://www.projectgrayscale.com
curl -I https://api.projectgrayscale.com/api/docs
```

### Rollback

Remove custom domains; revert to provider default URLs.

---

## Step 11 — Stripe Payment Links

Grayscale v1.0 does **not** include Stripe SDK integration. Use **Payment Links** for initial commercial collection.

1. https://dashboard.stripe.com → **Products**
2. Create products matching pricing tiers (Explorer, Builder, Scale)
3. **Payment Links** → Create link per product
4. Set **Success URL:** `https://www.projectgrayscale.com/?payment=success`
5. Set **Cancel URL:** `https://www.projectgrayscale.com/#pricing`
6. Embed links on landing page `#pricing` CTAs (future code change) or share manually

### Webhook (optional Phase 2)

When ready for automation:
- Stripe → Developers → Webhooks → `https://api.projectgrayscale.com/api/webhooks/stripe`
- Requires future backend endpoint (not in v1.0)

### Expected result

- Payment links work in Stripe test mode
- Test card `4242 4242 4242 4242` succeeds

### Validation

Complete test payment in Stripe test mode.

### Rollback

Deactivate payment links in Stripe dashboard.

---

## Step 12 — Email (Resend) — Optional

Contact form and waitlist currently show success without backend email routing.

When ready:
1. https://resend.com → Create API key
2. Verify domain `projectgrayscale.com`
3. Future: add `RESEND_API_KEY` to backend (not in v1.0 code)

### Expected result

- Domain verified in Resend

### Validation

Send test email from Resend dashboard.

---

## Step 13 — Production Smoke Test

Complete [PRODUCTION_VALIDATION.md](./PRODUCTION_VALIDATION.md) in full.

Minimum gates:

- [ ] Website loads with styling
- [ ] `/docs` loads
- [ ] Register + login works
- [ ] Dashboard / Mission Control loads
- [ ] `EXECUTIVES_ENABLED=false` (Athena dormant)
- [ ] API `/api/docs` accessible
- [ ] Database connected (Mission Control widgets show data or empty states, not 500)
- [ ] SSL valid on all domains
- [ ] No `DEV_AUTH_ENABLED` in production

---

## Step 14 — Go Live

Complete [GO_LIVE_CHECKLIST.md](./GO_LIVE_CHECKLIST.md).

Sign [DEPLOYMENT_CERTIFICATE.md](./DEPLOYMENT_CERTIFICATE.md) when all validations pass.

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) | Printable step checklist |
| [ROLLBACK_GUIDE.md](./ROLLBACK_GUIDE.md) | Recovery procedures |
| [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) | Full env inventory |
| [INFRASTRUCTURE.md](./INFRASTRUCTURE.md) | Dependency audit |
| [PRODUCTION_VALIDATION.md](./PRODUCTION_VALIDATION.md) | Validation tests |
| [GO_LIVE_CHECKLIST.md](./GO_LIVE_CHECKLIST.md) | Final launch gates |
| [POST_DEPLOYMENT.md](./POST_DEPLOYMENT.md) | After launch operations |
| [FUTURE_CLOUD.md](./FUTURE_CLOUD.md) | TauCloud / Enterprise migration |
| [PRODUCTION_READINESS_REPORT.md](./PRODUCTION_READINESS_REPORT.md) | Status dashboard template |

---

## Support

- Internal deployment index: `docs/internal/INTERNAL_DOCUMENTATION_INDEX.md`
- Public docs: https://www.projectgrayscale.com/docs/deployment (high-level public guide)

**Do not deploy automatically.** Follow one step at a time.
