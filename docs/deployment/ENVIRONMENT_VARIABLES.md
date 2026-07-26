# Environment Variables

**Grayscale OS v1.0 — Complete inventory**

**Never commit secrets to Git.** Use Vercel / Render environment panels or a secrets manager.

---

## Summary Table

| Variable | Layer | Required (prod) | Secret |
|----------|-------|-----------------|--------|
| `DATABASE_URL` | Backend | ✅ | ✅ |
| `REDIS_URL` | Backend | ✅ | ✅ |
| `JWT_SECRET` | Backend | ✅ | ✅ |
| `JWT_EXPIRES_IN` | Backend | ✅ | ❌ |
| `JWT_REFRESH_EXPIRES_IN` | Backend | ✅ | ❌ |
| `NODE_ENV` | Both | ✅ | ❌ |
| `API_PORT` | Backend | ✅ | ❌ |
| `WEB_URL` | Backend | ✅ | ❌ |
| `API_URL` | Frontend (SSR) | ✅ | ❌ |
| `NEXT_PUBLIC_API_URL` | Frontend | ✅ | ❌ |
| `EXECUTIVES_ENABLED` | Backend | ✅ | ❌ |
| `DEV_AUTH_ENABLED` | Backend | ✅ (must be false) | ❌ |
| `OPENAI_API_KEY` | Backend | Optional | ✅ |
| `ANTHROPIC_API_KEY` | Backend | Optional | ✅ |
| `GOOGLE_AI_API_KEY` | Backend | Optional | ✅ |
| `OLLAMA_BASE_URL` | Backend | Optional | ❌ |
| `STRIPE_*` | Future | Optional | ✅ |
| `RESEND_API_KEY` | Future | Optional | ✅ |

---

## Backend — Required

### `DATABASE_URL`

| | |
|---|---|
| **Purpose** | PostgreSQL connection for Prisma ORM |
| **Required** | Yes |
| **Default** | None |
| **Example** | `postgresql://user:pass@host:5432/grayscale?schema=public` |
| **Source** | Supabase / Neon / Render Postgres dashboard |
| **Notes** | Must support **pgvector** extension |

### `REDIS_URL`

| | |
|---|---|
| **Purpose** | BullMQ job queues and caching |
| **Required** | Yes |
| **Default** | `redis://localhost:6379` (dev only) |
| **Example** | `rediss://default:pass@host:6379` |
| **Source** | Render Redis / Upstash |

### `JWT_SECRET`

| | |
|---|---|
| **Purpose** | Signs access and refresh tokens |
| **Required** | Yes |
| **Default** | None — **never use dev default in prod** |
| **Example** | 64+ char random string |
| **Source** | `openssl rand -base64 48` |

### `JWT_EXPIRES_IN`

| | |
|---|---|
| **Purpose** | Access token lifetime |
| **Required** | Yes |
| **Default** | `15m` |
| **Example** | `15m` |

### `JWT_REFRESH_EXPIRES_IN`

| | |
|---|---|
| **Purpose** | Refresh token lifetime |
| **Required** | Yes |
| **Default** | `7d` |
| **Example** | `7d` |

### `NODE_ENV`

| | |
|---|---|
| **Purpose** | Runtime mode |
| **Required** | Yes |
| **Default** | `development` |
| **Production** | `production` |

### `API_PORT`

| | |
|---|---|
| **Purpose** | Port NestJS listens on |
| **Required** | Yes |
| **Default** | `4000` |
| **Render** | Use `10000` if Render assigns, or `$PORT` if supported |

> **Render note:** Render sets `PORT` automatically. Update `main.ts` to use `process.env.PORT` in future if needed — currently uses `API_PORT`.

### `WEB_URL`

| | |
|---|---|
| **Purpose** | CORS allowed origin (frontend URL) |
| **Required** | Yes |
| **Default** | `http://localhost:3000` |
| **Production example** | `https://www.projectgrayscale.com` |

### `EXECUTIVES_ENABLED`

| | |
|---|---|
| **Purpose** | Gate executive runtime activation |
| **Required** | Yes |
| **Production value** | `false` |
| **Notes** | Must remain false until certification approval |

### `AUTONOMOUS_EXECUTION_ENABLED`

| | |
|---|---|
| **Purpose** | Gate autonomous execution |
| **Required** | Set explicitly |
| **Production value** | `false` |
| **Notes** | Compiled constant false in code; env for documentation |

---

## Backend — Development Only (NEVER in production)

### `DEV_AUTH_ENABLED`

| | |
|---|---|
| **Purpose** | Bypass API auth when Postgres unavailable |
| **Production** | **Must be `false` or unset** |
| **Default (dev)** | `true` in `.env.example` |

### `DEV_AUTH_EMAIL`, `DEV_AUTH_PASSWORD`, `DEV_AUTH_NAME`, `DEV_AUTH_COMPANY`

| | |
|---|---|
| **Purpose** | Dev login fallback for Next.js API route |
| **Production** | **Do not set** |

---

## Frontend — Required

### `NEXT_PUBLIC_API_URL`

| | |
|---|---|
| **Purpose** | Browser-side API base URL |
| **Required** | Yes |
| **Default** | `http://localhost:4000/api` |
| **Production example** | `https://api.projectgrayscale.com/api` |
| **Notes** | Exposed to browser — no secrets |

### `API_URL`

| | |
|---|---|
| **Purpose** | Server-side API URL (Next.js API routes) |
| **Required** | Yes |
| **Default** | `http://localhost:4000` |
| **Production example** | `https://api.projectgrayscale.com` |

---

## Optional — AI Providers

Configure when enabling AI features in Settings UI.

| Variable | Purpose |
|----------|---------|
| `OPENAI_API_KEY` | OpenAI models |
| `ANTHROPIC_API_KEY` | Claude models |
| `GOOGLE_AI_API_KEY` | Google AI models |
| `OLLAMA_BASE_URL` | Local Ollama endpoint |

---

## Future — Stripe (Payment Links phase)

| Variable | Purpose |
|----------|---------|
| `STRIPE_SECRET_KEY` | Server-side Stripe API (future) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signature verification (future) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client-side (future) |

Not required for Payment Links-only phase.

---

## Future — Email (Resend)

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Transactional email API |
| `EMAIL_FROM` | Verified sender address |

---

## Where to Set Variables

| Service | Variables |
|---------|-----------|
| **Render (backend)** | All backend vars |
| **Vercel (frontend)** | `NEXT_PUBLIC_*`, `API_URL` |
| **Never** | Commit to `.env` in Git |

---

## Validation

After setting variables:

1. Redeploy both services
2. Render logs: no `DATABASE_URL` or `REDIS_URL` connection errors
3. Vercel logs: build succeeds
4. Login flow works end-to-end

See [PRODUCTION_VALIDATION.md](./PRODUCTION_VALIDATION.md).
