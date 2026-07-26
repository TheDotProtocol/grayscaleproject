# Open Platform Strategy

**Project Grayscale — Immutable Platform Declaration**

**Version:** 1.0  
**Status:** Constitutional — Future repository splits must preserve this separation  
**Grayscale OS:** v1.0 (Codename Bedrock)

---

## Executive Summary

Grayscale is a **commercial Organizational Operating System**. Our open strategy is not "open source the product." Our open strategy is:

> **Developers build ON TOP OF Grayscale — they do not reproduce the commercial platform.**

This document defines four platform tiers and the philosophical boundary between openness and commercial protection.

---

## Platform Tiers

### 1. Open Platform

The **conceptual and contractual surface** where external builders interact with Grayscale:

- Documented APIs (Mission Control, Intelligence, Integrations)
- Plugin SDK and connector model
- Event schemas and integration sandbox
- Constitutional guarantees (explainability, audit, default-deny governance)

**Philosophy:** Open Platform means **predictable extension points** — not access to proprietary organizational reasoning engines, executive certification pipelines, or hosted multi-tenant infrastructure.

**Analogy:** Stripe's API is open; Stripe's fraud engine and ledger are not.

---

### 2. Source Available Components

Selected packages may be published **source available** for inspection, contribution, and self-hosted evaluation:

- `@grayscale/plugin-sdk`
- `@grayscale/connector-core`
- Reference connector implementations
- Documentation and example plugins

**Not source available (commercial core):**

- Bedrock runtime orchestration
- CompanyContext assembly pipeline
- Executive reasoning and certification runtime
- Policy Engine + Governance Kernel enforcement
- Mission Control widget intelligence layer
- Cloud-hosted multi-tenant control plane

**Principle:** Source availability is **opt-in per component**, governed by licensing (see `LICENSING_STRATEGY.md`), not a blanket repository license.

---

### 3. Cloud Platform

**Grayscale Cloud** is the managed commercial offering:

- Hosted Bedrock + OrgOS
- Founder workspaces and Mission Control
- Executive Intelligence Layer (certification-gated)
- Organizational Nervous System (Twin, Simulation, Council)
- Billing, SSO, compliance packs

**Revenue model:** Subscription tiers (Explorer → Enterprise) plus usage-based extensions.

**Developer relationship:** Cloud customers may use Open Platform APIs and plugins. They do not receive Bedrock source or executive model weights/prompts.

---

### 4. Enterprise Platform

**Grayscale Enterprise** is dedicated deployment for boards, PE, and holding companies:

- Private cloud / VPC / on-premise options
- Custom policies and constitutional amendments (contractual)
- Federation and multi-organization intelligence (roadmap)
- Dedicated support and compliance artifacts

**Isolation:** Enterprise deployments are **commercially licensed** — not community editions with extra features.

---

## Build On Top — Do Not Reproduce

| Allowed | Not Allowed |
|---------|-------------|
| Plugins that sync data into CompanyContext via approved connectors | Replicating CompanyContext assembly |
| Integrations using documented APIs | Forking Bedrock as a competing OOS |
| Custom dashboards consuming Mission Control widgets | Rebuilding executive certification pipeline |
| Workflow automation via Governance-approved actions | Bypassing Policy Engine / Governance Kernel |
| Industry packs as plugin bundles | Extracting and reselling executive prompts |

**We welcome:** CRM connectors, industry analytics plugins, board reporting tools, custom approval workflows.

**We protect:** The constitutional runtime, organizational reasoning integrity, and commercial cloud/enterprise value.

---

## Contribution Model (Future)

1. **Issues & RFCs** — Public feedback on Open Platform APIs
2. **Plugin marketplace** — Certified third-party plugins (roadmap)
3. **Reference implementations** — Source available examples, not production cores
4. **No silent core contributions** — Bedrock changes require internal certification; Architecture Lock applies

---

## Relationship to Documentation

- **PUBLIC** docs explain Open Platform surfaces
- **DEVELOPER** docs explain SDK and extension patterns
- **INTERNAL** docs cover Bedrock certification, executive prompts, sprint evidence — never published

See `docs/DOCUMENTATION_POLICY.md` and `docs/platform/PUBLIC_DOCUMENT_INDEX.md`.

---

## Immutability Clause

This strategy document defines **commercial boundaries**. Future repository splits (`REPOSITORY_STRATEGY.md`) must preserve:

1. Open Platform ≠ Open Source Product
2. Cloud + Enterprise remain commercial
3. Developers extend; they do not fork the OOS core for competing offerings

Amendments require founder and architecture lock approval.
