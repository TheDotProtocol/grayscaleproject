# Deployment Checklist

**Grayscale OS v1.0 — Founder printable checklist**

Check each box only after **Validation** passes for that step.  
Reference: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## Pre-Deployment

- [ ] Read DEPLOYMENT_GUIDE.md and ENVIRONMENT_VARIABLES.md
- [ ] Confirm `EXECUTIVES_ENABLED=false` plan documented
- [ ] Confirm `DEV_AUTH_ENABLED=false` for production
- [ ] Password manager ready for secrets
- [ ] GitHub repo access confirmed

---

## Step 1 — GitHub

- [ ] Repository cloned and builds locally
- [ ] `pnpm typecheck` passes
- [ ] On correct commit / tag

---

## Step 2 — Domain

- [ ] Domain registered
- [ ] DNS provider access confirmed
- [ ] Hostnames planned (www + api)

---

## Step 3 — PostgreSQL

- [ ] Database provisioned
- [ ] `DATABASE_URL` saved securely
- [ ] pgvector extension enabled
- [ ] Migrations applied (`pnpm db:migrate`)
- [ ] Migration status verified

---

## Step 4 — Redis

- [ ] Redis instance provisioned
- [ ] `REDIS_URL` saved securely
- [ ] `PING` returns PONG

---

## Step 5 — Secrets

- [ ] `JWT_SECRET` generated (64+ chars)
- [ ] All backend vars prepared
- [ ] All frontend vars prepared
- [ ] No secrets in Git

---

## Step 6 — Migrations

- [ ] Production migrations complete
- [ ] No pending migrations

---

## Step 7 — Backend (Render)

- [ ] Web service created
- [ ] Build command configured
- [ ] Environment variables set
- [ ] Deploy succeeded
- [ ] `/api/docs` loads

---

## Step 8 — Frontend (Vercel)

- [ ] Project created and linked to GitHub
- [ ] Root directory `apps/web`
- [ ] Environment variables set
- [ ] Deploy succeeded
- [ ] Landing page styled correctly
- [ ] `/docs` loads

---

## Step 9 — Connect Services

- [ ] `WEB_URL` points to frontend domain
- [ ] `NEXT_PUBLIC_API_URL` points to API
- [ ] CORS working (login from frontend)
- [ ] Register / login tested

---

## Step 10 — Domains & SSL

- [ ] Frontend custom domain configured
- [ ] API custom domain configured
- [ ] SSL valid (browser padlock)
- [ ] Env vars updated to custom domains
- [ ] Both services redeployed

---

## Step 11 — Stripe (optional v1.0)

- [ ] Stripe account ready
- [ ] Products created
- [ ] Payment Links created
- [ ] Test payment succeeded

---

## Step 12 — Email (optional)

- [ ] Resend account (if using)
- [ ] Domain verified

---

## Step 13 — Production Validation

- [ ] PRODUCTION_VALIDATION.md complete
- [ ] No critical errors in logs

---

## Step 14 — Go Live

- [ ] GO_LIVE_CHECKLIST.md complete
- [ ] DEPLOYMENT_CERTIFICATE.md signed
- [ ] POST_DEPLOYMENT monitoring plan active

---

**Completion:** _____ / _____ steps validated  
**Date completed:** _______________  
**Signed:** _______________
