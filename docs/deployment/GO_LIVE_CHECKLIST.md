# Go Live Checklist

**Final gates before public production launch**

Complete only when [PRODUCTION_VALIDATION.md](./PRODUCTION_VALIDATION.md) passes.

---

## Business Readiness

- [ ] Pricing tiers finalized on landing page
- [ ] Stripe Payment Links active (or launch without payments documented)
- [ ] Contact emails live (info@, sales@, billing@)
- [ ] Legal pages accessible (license, code of conduct via `/docs`)
- [ ] Support process defined (who responds to contact form)

---

## Technical Readiness

- [ ] All DEPLOYMENT_CHECKLIST steps validated
- [ ] Custom domains live with SSL
- [ ] `EXECUTIVES_ENABLED=false` verified in production
- [ ] `DEV_AUTH_ENABLED=false` verified
- [ ] Database backup enabled
- [ ] Rollback procedure tested (at least frontend promote)
- [ ] No critical errors in 24h staging period (if used)

---

## Security Readiness

- [ ] JWT secret is production-grade (64+ chars)
- [ ] No secrets in Git history
- [ ] CORS restricted to production `WEB_URL`
- [ ] Default/test passwords removed from production DB

---

## Operational Readiness

- [ ] Render + Vercel dashboard access documented
- [ ] DNS registrar access documented
- [ ] Database admin access documented
- [ ] On-call contact defined (Founder)
- [ ] [POST_DEPLOYMENT.md](./POST_DEPLOYMENT.md) review complete

---

## Launch Actions

1. [ ] Remove any maintenance flags
2. [ ] Point production DNS (if not already)
3. [ ] Announce internally
4. [ ] Monitor logs for 2 hours post-launch
5. [ ] Complete [DEPLOYMENT_CERTIFICATE.md](./DEPLOYMENT_CERTIFICATE.md)

---

## Post-Launch (First 48 Hours)

- [ ] Monitor error rates
- [ ] Verify user registrations work
- [ ] Check Mission Control under real usage
- [ ] Document any incidents

---

**Go live approved by:** _______________  
**Date / time (UTC):** _______________
