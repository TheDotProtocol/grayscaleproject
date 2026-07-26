# Grayscale OS v1.0 — Deployment Playbook

**Official production deployment documentation**

Deploy Grayscale one service at a time. Validate each stage before proceeding. **Do not deploy automatically.**

---

## Start Here

1. **[PRODUCTION_DEPLOYMENT_PLAN.md](./PRODUCTION_DEPLOYMENT_PLAN.md)** — Executive overview and timeline
2. **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** — Step-by-step founder instructions
3. **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** — Printable checklist

---

## Reference

| Document | Purpose |
|----------|---------|
| [INFRASTRUCTURE.md](./INFRASTRUCTURE.md) | Dependency audit |
| [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) | Complete env inventory |
| [PRODUCTION_VALIDATION.md](./PRODUCTION_VALIDATION.md) | Test procedures |
| [PRODUCTION_READINESS_REPORT.md](./PRODUCTION_READINESS_REPORT.md) | Status dashboard |
| [ROLLBACK_GUIDE.md](./ROLLBACK_GUIDE.md) | Recovery |
| [GO_LIVE_CHECKLIST.md](./GO_LIVE_CHECKLIST.md) | Launch gates |
| [POST_DEPLOYMENT.md](./POST_DEPLOYMENT.md) | Operations |
| [FUTURE_CLOUD.md](./FUTURE_CLOUD.md) | Cloud migration strategy |
| [DEPLOYMENT_CERTIFICATE.md](./DEPLOYMENT_CERTIFICATE.md) | Sign-off template |

---

## Non-Negotiables

```
EXECUTIVES_ENABLED=false
AUTONOMOUS_EXECUTION_ENABLED=false
DEV_AUTH_ENABLED=false
```

No Bedrock modifications. No automatic deployment from this playbook.

**Tag:** `Grayscale-OS-v1.0-Deployment-Playbook`
