# Rollback Guide

**Grayscale OS v1.0 — Recovery procedures**

Use when a deployment step fails or production regresses. **Validate rollback** before continuing forward again.

---

## General Principles

1. **Stop forward deployment** — do not add services until rollback complete
2. **Identify blast radius** — database, backend, frontend, DNS
3. **Prefer redeploy previous version** over destructive deletes
4. **Never rollback database** without backup unless intentional

---

## Frontend (Vercel) Rollback

### When
- Broken UI, failed build, wrong env vars

### Procedure
1. Vercel → Project → **Deployments**
2. Find last known good deployment
3. Click **⋯** → **Promote to Production**
4. Verify site loads

### Validation
- Homepage styled
- Login works

### Time to recover
~2 minutes

---

## Backend (Render) Rollback

### When
- API 500 errors, failed deploy, bad env vars

### Procedure
1. Render → Service → **Events**
2. **Rollback** to previous deploy OR redeploy from last good commit
3. Verify env vars unchanged or corrected

### Validation
```bash
curl -I https://<api-host>/api/docs
```

### Time to recover
~5–10 minutes

---

## Database Rollback

### When
- Bad migration, data corruption

### Procedure — Supabase
1. Supabase → **Database → Backups**
2. Select point-in-time or daily backup
3. Restore to new project OR restore in place (destructive)
4. Update `DATABASE_URL` if new project
5. Re-run migrations if needed

### Procedure — Prevent migration damage
- Always backup before `pnpm db:migrate` in production
- Test migrations on staging clone first

### Validation
```bash
pnpm --filter @grayscale/backend exec prisma migrate status
```

### ⚠️ Warning
Database rollback may lose user data registered after backup point.

---

## Redis Rollback

### When
- Queue corruption, wrong Redis URL

### Procedure
1. Update `REDIS_URL` to correct instance
2. Redeploy backend
3. If jobs corrupted: flush Redis ( **loses queued jobs** )

```bash
redis-cli -u "$REDIS_URL" FLUSHALL  # use with caution
```

### Validation
Backend starts without Redis connection errors in logs.

---

## DNS Rollback

### When
- Wrong domain pointing, SSL issues

### Procedure
1. Revert DNS records to previous values at registrar
2. Wait for TTL propagation (5 min – 48 hrs)
3. Temporarily use Vercel/Render default URLs

### Validation
```bash
dig www.projectgrayscale.com
dig api.projectgrayscale.com
```

---

## Environment Variable Rollback

### When
- Wrong JWT secret, wrong URLs

### Procedure
1. Restore previous values from password manager history
2. Redeploy affected service(s)
3. If JWT secret changed: all users must re-login

---

## Full Production Rollback (Emergency)

1. **Frontend:** Promote last good Vercel deployment
2. **Backend:** Rollback Render deploy
3. **DNS:** Point to maintenance page if needed
4. **Database:** Restore from backup only if data issue
5. Communicate downtime to users

---

## Post-Rollback

1. Document failure in deployment log
2. Fix root cause locally
3. Re-run validation checklist from failed step
4. Do not skip validation steps on retry

See [POST_DEPLOYMENT.md](./POST_DEPLOYMENT.md) for incident logging.
