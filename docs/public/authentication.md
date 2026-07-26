# Authentication

Authenticate with the Grayscale API for integrations and plugins.

---

## Overview

Grayscale uses **Bearer JWT** authentication. All API routes are **company-scoped** — tenant isolation is enforced by the Company Guard on every request.

---

## Obtain a Token

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"founder@example.com","password":"your-password"}'
```

Response includes a JWT access token.

---

## Use the Token

```bash
curl http://localhost:4000/companies/{companyId}/mission-control/health \
  -H "Authorization: Bearer <token>"
```

Replace `{companyId}` with your organization ID from the session or dashboard.

---

## Integration Authentication

Plugins and connectors use the **Integration Credential Vault**:

1. Register integration via Integration API
2. Store credentials in company-scoped vault
3. Connector runs in sandbox until certified
4. Policy Engine evaluates automated actions

See [Plugin Development](/docs/plugins) and [Webhooks](/docs/webhooks).

---

## Enterprise SSO

Single Sign-On (SAML/OIDC) is available on **Enterprise** plans. Contact [sales@projectgrayscale.com](/contact).

---

## Security Practices

- Rotate JWT secrets in production
- Never embed tokens in client-side code
- Use HTTPS in all non-local environments
- Scope integrations to minimum required permissions

---

## Related

- [API Reference](/docs/api)
- [Security](/docs/security)
