# Future Cloud Migration Strategy

**Grayscale OS v1.0 — Planning only. Do NOT implement.**

Documents migration path from founder-managed deployment (Vercel + Render) to Grayscale commercial cloud tiers.

---

## Deployment Tiers (Future)

| Tier | Codename | Description |
|------|----------|-------------|
| **Founder Deploy** | Current | Vercel + Render + managed Postgres — this playbook |
| **Grayscale Cloud** | SaaS | Multi-tenant managed platform |
| **Grayscale Enterprise** | Dedicated | VPC / private cloud per customer |
| **Grayscale Sovereign** | Air-gapped | On-premise, regulated industries |
| **TauCloud** | Infrastructure | AR Holdings cloud infrastructure layer |

---

## Migration Triggers

| From | To | When |
|------|-----|------|
| Founder Deploy | Grayscale Cloud | Multi-customer SaaS ready, billing automated |
| Grayscale Cloud | Enterprise | Customer requires dedicated infra / SSO / compliance |
| Enterprise | Sovereign | Regulatory air-gap requirement |
| Any | TauCloud | AR Holdings infrastructure standardization |

---

## What Migrates

| Asset | Founder → Cloud | Notes |
|-------|-------------------|-------|
| PostgreSQL | Export / replicate | pgvector preserved |
| Redis | Managed service | Same BullMQ patterns |
| User accounts | Migration script | Password hashes portable |
| Domain | DNS cutover | Maintenance window |
| Stripe | Account transfer or new | Customer billing continuity |
| Secrets | Vault migration | Never copy in plaintext |

---

## What Does NOT Migrate Automatically

- Render/Vercel-specific config
- Manual Stripe Payment Links (replaced by integrated billing)
- Local `.env` files
- Development Docker volumes

---

## Grayscale Cloud Architecture (Target)

```
                    ┌─────────────────────────┐
                    │   Grayscale Cloud       │
                    │   Control Plane         │
                    │   (billing, SSO, tenants)│
                    └───────────┬─────────────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
     ┌────────▼────────┐ ┌──────▼──────┐ ┌───────▼───────┐
     │ Tenant A        │ │ Tenant B    │ │ Tenant C      │
     │ Bedrock + OrgOS   │ │ ...         │ │ ...           │
     └───────────────────┘ └─────────────┘ └───────────────┘
```

Bedrock remains frozen — cloud wraps certified runtime.

---

## Enterprise / Sovereign

- Dedicated Postgres + Redis per deployment
- Custom domain per customer
- SSO (SAML/OIDC)
- Compliance artifact pack
- Professional services for migration

---

## Repository Split Alignment

Migration aligns with [PUBLIC_REPOSITORY_STRUCTURE.md](../../PUBLIC_REPOSITORY_STRUCTURE.md):

- `grayscale-core` → private cloud runtime
- `grayscale-sdk` → public developer tools
- `grayscale-docs` → public documentation

---

## Founder Action Today

**None.** Complete founder deploy using [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md). Revisit this document before Sprint 5 commercial cloud work.

---

## Non-Implementation Statement

This document does not authorize cloud infrastructure provisioning. No TauCloud resources should be created from this playbook.
