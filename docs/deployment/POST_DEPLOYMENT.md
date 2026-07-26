# Post-Deployment Operations

**Grayscale OS v1.0 — After launch**

---

## Daily (First Week)

| Task | Action |
|------|--------|
| Check Render logs | Render → Service → Logs — scan for ERROR |
| Check Vercel deployments | Ensure production deploy is current |
| User registrations | Verify new signups in database |
| Uptime | Manual visit to homepage + login |

---

## Weekly

| Task | Action |
|------|--------|
| Database backup verify | Supabase/Render backup status |
| Dependency updates | Review GitHub Dependabot (do not auto-deploy) |
| SSL expiry | Auto-managed — verify no warnings |
| Review contact submissions | Manual until email wired |

---

## Monthly

| Task | Action |
|------|--------|
| Rotate review | Assess JWT secret rotation need |
| Cost review | Vercel, Render, Supabase, Redis bills |
| Performance spot check | Lighthouse on homepage |
| Security scan | securityheaders.com |

---

## Deploying Updates

1. Merge to `main` on GitHub
2. Vercel auto-deploys frontend
3. Render auto-deploys backend (if enabled) OR manual deploy
4. If migrations included: run `pnpm db:migrate` **before** backend deploy
5. Run smoke tests from PRODUCTION_VALIDATION § 1–3

**Never enable `EXECUTIVES_ENABLED=true` without certification sign-off.**

---

## Incident Response

| Severity | Response |
|----------|----------|
| Site down | Rollback Vercel + check Render |
| API down | Rollback Render, check DB/Redis |
| Data issue | Stop writes, restore DB backup |
| Security breach | Rotate JWT_SECRET, force re-login, audit logs |

See [ROLLBACK_GUIDE.md](./ROLLBACK_GUIDE.md).

---

## Monitoring (Recommended Additions)

| Tool | Purpose | Priority |
|------|---------|----------|
| Sentry | Frontend + backend errors | High |
| UptimeRobot | Ping homepage + API | Medium |
| Render metrics | CPU/memory | Medium |
| Supabase reports | DB performance | Medium |

---

## Scaling Triggers

| Signal | Action |
|--------|--------|
| API response > 3s consistently | Upgrade Render instance |
| DB connections maxed | Enable connection pooling (Supabase pooler) |
| Redis memory high | Upgrade Redis plan |
| Traffic > single instance | Render horizontal scaling (future) |

---

## Future Migration

When ready for Grayscale Cloud / TauCloud, see [FUTURE_CLOUD.md](./FUTURE_CLOUD.md).

---

## Document Updates

After each production deploy, update:

- [PRODUCTION_READINESS_REPORT.md](./PRODUCTION_READINESS_REPORT.md)
- CHANGELOG.md (user-facing release notes)
