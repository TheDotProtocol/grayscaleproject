# Production Deployment Plan

**Grayscale OS v1.0 — Executive deployment plan**

**Status:** Planning — not yet executed  
**Owner:** Founder  
**Playbook:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## Objective

Deploy Grayscale OS from localhost to a secure, production-ready environment serving **www.projectgrayscale.com** — one validated step at a time over several days.

---

## Scope

### In scope

- Vercel frontend (Next.js)
- Render backend (NestJS)
- PostgreSQL + pgvector
- Redis (BullMQ)
- Custom domains + SSL
- Stripe Payment Links (manual dashboard setup)
- Production validation and go-live

### Out of scope (v1.0)

- Executive activation (`EXECUTIVES_ENABLED` stays false)
- Autonomous execution
- Stripe subscription SDK integration
- Supabase Auth / Storage
- Automated email (Resend wiring)
- TauCloud / Grayscale Cloud multi-tenant

---

## Timeline (Suggested)

| Day | Steps | Duration |
|-----|-------|----------|
| **Day 1** | Steps 1–4: GitHub, domain plan, Postgres, Redis | 2–4 hours |
| **Day 2** | Steps 5–7: Secrets, migrations, backend deploy | 2–4 hours |
| **Day 3** | Steps 8–9: Frontend deploy, connect API | 2–3 hours |
| **Day 4** | Steps 10–11: Custom domains, Stripe links | 2–3 hours |
| **Day 5** | Steps 12–14: Validation, go-live | 2–4 hours |

Adjust pace as needed. **Do not skip validation.**

---

## Service Map

| Service | Provider | Purpose |
|---------|----------|---------|
| Source | GitHub | Code |
| Frontend | Vercel | Web + docs + dashboard UI |
| Backend | Render | API + BullMQ |
| Database | Supabase Postgres | Primary store |
| Cache/queue | Render Redis | Jobs |
| Payments | Stripe | Payment Links |
| DNS | Cloudflare (recommended) | Domains |
| Email | Resend (optional) | Future |

---

## Risk Register

| Risk | Mitigation |
|------|------------|
| pgvector missing | Verify extension before migrations |
| CORS failure | Set `WEB_URL` before testing login |
| Stale Next.js cache | Use `pnpm dev:clean` locally; Vercel clean build |
| Secret leak | Password manager only; never Git |
| Executive accidental enable | Env audit before go-live |
| Migration failure | Backup DB before migrate |

---

## Success Criteria

- [ ] Public site live on custom domain with SSL
- [ ] Users can register, login, use Mission Control
- [ ] Executives remain dormant
- [ ] DEPLOYMENT_CERTIFICATE signed
- [ ] Rollback tested for frontend

---

## References

- [INFRASTRUCTURE.md](./INFRASTRUCTURE.md)
- [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)
- [PRODUCTION_READINESS_REPORT.md](./PRODUCTION_READINESS_REPORT.md)
- [FUTURE_CLOUD.md](./FUTURE_CLOUD.md)

---

## Approval

Plan approved by: _______________ Date: _______________
