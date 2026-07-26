# Security

Enterprise-grade security by architecture — not as an afterthought.

---

## Principles

- **Company-scoped data plane** — strict tenant isolation
- **Default deny** — Policy Engine before any automated action
- **Credential Vault** — secrets never in source code
- **Integration Sandbox** — uncertified connectors are gated
- **Audit trails** — event-sourced record of material actions

---

## Plugin Security

Plugins and connectors:

1. Run in sandbox until certified
2. Declare explicit permissions in manifest
3. Store credentials in vault
4. Pass security validation framework

See [Plugin Development](/docs/plugins).

---

## Authentication

Bearer JWT for API access. Enterprise SSO (SAML/OIDC) on Enterprise plans.

See [Authentication](/docs/authentication).

---

## Reporting

Report security concerns via [Contact](/contact) — do not open public issues for vulnerabilities.

---

## Related

- [Authentication](/docs/authentication)
- [Deployment](/docs/deployment)
- [Enterprise Edition](/docs/licensing/enterprise)
