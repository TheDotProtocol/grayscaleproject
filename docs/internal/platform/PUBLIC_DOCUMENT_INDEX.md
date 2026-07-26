# Public Document Index

**Project Grayscale — Documents Intended for Public Consumption**

**Version:** 1.0  
**Grayscale OS:** v1.0  
**Status:** Planning index — governs Documentation Center manifest and future `grayscale-docs` repository

---

## Purpose

This index lists documentation **approved for public consumption**. Only documents in this index (or explicitly added to the web docs manifest) may appear in `/docs` or external public mirrors.

For visibility policy, see `docs/DOCUMENTATION_POLICY.md`.

---

## Documentation Center Routes (Live Manifest)

| Route | Source | Category |
|-------|--------|----------|
| `/docs` | `docs/public/index.md` | Overview |
| `/docs/getting-started` | `docs/public/getting-started.md` | Tutorial |
| `/docs/architecture` | `docs/public/architecture-overview.md` | Architecture |
| `/docs/bedrock` | `docs/releases/GRAYSCALE_OS_V1.md` | Product |
| `/docs/mission-control` | `docs/platform/MISSION_CONTROL_UI.md` | Product |
| `/docs/executives` | `docs/platform/EXECUTIVE_PHILOSOPHY.md` | Product |
| `/docs/athena` | `docs/executives/ATHENA.md` | Product |
| `/docs/council` | `docs/platform/EXECUTIVE_COUNCIL.md` | Product |
| `/docs/twin` | `docs/platform/ORGANIZATIONAL_DIGITAL_TWIN.md` | Product |
| `/docs/simulation` | `docs/platform/SIMULATION_ENGINE.md` | Product |
| `/docs/forecast` | `docs/platform/ORGANIZATIONAL_FORESIGHT_ENGINE.md` | Product |
| `/docs/security` | `docs/architecture/PLUGIN_SECURITY_MODEL.md` | Security |
| `/docs/api` | `docs/public/api-overview.md` | Developer |
| `/docs/sdk` | `docs/platform/PLUGIN_SDK_SPECIFICATION.md` | Developer |
| `/docs/deployment` | `docs/public/deployment.md` | Developer |
| `/docs/faq` | `docs/public/faq.md` | Overview |

---

## Additional Public-Intent Documents (Not Yet in Portal)

These may be added to `/docs` in future releases:

### Product & Platform

- `docs/platform/FOUNDER_CONSTITUTION.md` (public summary edition — redact internal gates)
- `docs/platform/EVENT_CATALOG.md` (stable event types only)
- `docs/platform/MEMORY_ENGINE.md`
- `docs/platform/ORGANIZATIONAL_OPERATING_MODEL.md`
- `docs/platform/POLICY_ENGINE_RUNTIME.md` (product behavior — not certification)
- `docs/platform/TWIN_RUNTIME.md`
- `docs/platform/SIMULATION_RUNTIME.md`
- `docs/platform/COUNCIL_RUNTIME_API.md` (public API portions)
- `docs/plugins/README.md`

### API Reference (Developer)

- `docs/api/MISSION_CONTROL_API.md`
- `docs/api/INTELLIGENCE_API.md`
- `docs/api/PLATFORM_INTEGRATION_API.md`
- `docs/api/PLATFORM_OPERATIONS_API.md`
- `docs/api/EXECUTIVE_RUNTIME_API.md`

### Architecture (Overview — Selected ADRs)

Public **summary** ADRs only when curated for external audiences:

- `docs/architecture/ADR-001-monorepo-and-data-plane.md` (overview excerpt)
- `docs/architecture/ADR-006-event-store.md`
- `docs/architecture/ADR-012-mission-control-live.md`

Full ADR catalog remains available internally — not bulk-published.

### Strategy (Public)

- `docs/platform/OPEN_PLATFORM_STRATEGY.md`
- `docs/DOCUMENTATION_POLICY.md`
- `docs/platform/REPOSITORY_STRATEGY.md` (marked planning-only)
- `docs/platform/LICENSING_STRATEGY.md` (recommendation — not legal advice)

### Releases

- `docs/releases/GRAYSCALE_OS_V1.md`
- Future `docs/releases/*.md` for commercial versions

---

## Explicitly Excluded from Public Index

See `docs/platform/INTERNAL_DOCUMENT_INDEX.md` for the full internal catalog. Never publish:

- Sprint certificates (`SPRINT*_CERTIFICATE*.md`)
- Certification reports (`*_CERTIFICATION_REPORT.md`, `*_CERTIFICATION.md` except public product behavior docs)
- `docs/engineering/validation/*`
- `docs/engineering/*_CERTIFICATION_REPORT.md`
- `prompts/**`
- Internal sprint alignment reports
- Founder workspace internal architecture debates

---

## Maintenance

When adding a document to the public index:

1. Confirm PUBLIC or DEVELOPER classification per `DOCUMENTATION_POLICY.md`
2. Add entry to web docs manifest (`apps/web/src/lib/docs/manifest.ts`)
3. Update this index
4. Security review for secrets, internal URLs, and credential patterns

**Owner:** Platform + Product Documentation  
**Review cadence:** Each Grayscale OS minor release
