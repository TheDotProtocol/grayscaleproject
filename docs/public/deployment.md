# Deployment

Production deployment considerations for Grayscale OS v1.0.

---

## Deployment Models

| Model | Audience | Description |
|-------|----------|-------------|
| **Grayscale Cloud** | Most customers | Managed SaaS (commercial) |
| **Dedicated Cloud** | Enterprise | Isolated tenant / VPC |
| **Self-Hosted Evaluation** | Developers | Local Docker development only today |
| **Enterprise On-Premise** | Boards, PE, regulated | Contractual — contact sales |

Self-hosted production deployment guides will expand as Enterprise packages mature. Contact [sales@projectgrayscale.com](/contact) for dedicated deployment.

---

## Local Development Stack

```bash
docker compose up -d    # PostgreSQL + Redis
pnpm db:push            # Apply schema
pnpm dev                # Web :3000 + API :4000
```

### Environment Variables

Copy `.env.example` to `.env`. Key variables:

```bash
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=<strong-secret>
EXECUTIVES_ENABLED=false
AUTONOMOUS_EXECUTION_ENABLED=false
```

Never commit `.env` or secrets to version control.

---

## Production Checklist (When Available)

- [ ] Strong `JWT_SECRET` and rotation policy
- [ ] TLS termination at load balancer
- [ ] PostgreSQL backups and point-in-time recovery
- [ ] Redis persistence configuration
- [ ] `EXECUTIVES_ENABLED` only after certification
- [ ] Policy Engine rules reviewed and published
- [ ] Integration sandbox enabled for new connectors
- [ ] Audit log retention policy configured
- [ ] SSO (Enterprise) integrated via IdP

---

## Infrastructure Requirements (Indicative)

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| API instances | 2 | 3+ (HA) |
| PostgreSQL | 16+ | Managed RDS / Cloud SQL |
| Redis | 7+ | Managed ElastiCache / Memorystore |
| Web | Static + SSR | CDN + Next.js server |

Exact sizing depends on organization count and event volume.

---

## Database Migrations

```bash
pnpm db:push      # Development
# Production: use approved migration pipeline (Prisma migrate deploy)
```

Schema changes require Bedrock architecture review — no breaking changes to certified Foundation.

---

## Monitoring

Mission Control exposes platform health endpoints consumed by the founder workspace. Enterprise deployments add:

- Security observatory
- Integration health dashboard
- Event store lag monitoring

---

## Related

- [Getting Started](/docs/quick-start)
- [Security](/docs/security)
- [API Reference](/docs/api)
- [Contact Sales](/contact)
