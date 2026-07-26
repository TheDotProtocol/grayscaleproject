# API Reference

Grayscale HTTP APIs for integrations, Mission Control, and platform operations.

**Base URL (development):** `http://localhost:4000`  
**Authentication:** Bearer JWT (founder session token)

Interactive OpenAPI documentation is available at `/api/docs` when running the backend locally.

---

## Authentication

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"founder@example.com","password":"..."}'
```

Use the returned token:

```bash
curl http://localhost:4000/companies/{companyId}/mission-control/health \
  -H "Authorization: Bearer <token>"
```

All routes are **company-scoped**. The Company Guard enforces tenant isolation.

---

## API Surfaces

### Mission Control API

Operational widgets, health, readiness, timeline, and dashboard aggregation.

**Key routes:**

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/companies/:id/mission-control/health` | Platform health score |
| `GET` | `/companies/:id/mission-control/readiness` | Company readiness |
| `GET` | `/companies/:id/mission-control/dashboard` | Widget dashboard bundle |
| `GET` | `/companies/:id/mission-control/timeline` | Organizational timeline |

---

### Intelligence API

Executive recommendations, organizational intelligence, and context endpoints.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/companies/:id/intelligence/brief` | Founder briefing |
| `GET` | `/companies/:id/intelligence/recommendations` | Open recommendations |

---

### Platform Integration API

Connectors, webhooks, sandbox sync, and integration health.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/companies/:id/integrations` | List integrations |
| `POST` | `/companies/:id/integrations/:provider` | Configure connector |
| `POST` | `/companies/:id/memory/sync/:provider` | Trigger sync |

---

### Platform Operations API

Administrative operations, reliability, and observability endpoints.

---

### Executive Runtime API

Executive framework endpoints (certification-gated; disabled when `EXECUTIVES_ENABLED=false`).

---

## Event-Driven Integration

Grayscale uses persist-then-publish semantics. Integrations should:

1. Register via Integration API
2. Pass sandbox certification
3. Publish events through approved connector ports
4. Respect Policy Engine verdicts for automated actions

See [Plugin SDK](/docs/sdk) for connector development.

---

## Rate Limits & Versioning

- API version follows Bedrock release tags
- CompanyContext responses include `contextVersion`
- Production rate limits apply on Grayscale Cloud (Enterprise tiers vary)

---

## Related

- [Getting Started](/docs/quick-start)
- [Plugin SDK](/docs/sdk)
- [Security](/docs/security)
- [Mission Control](/docs/mission-control)
