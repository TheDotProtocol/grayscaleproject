# Documentation Policy

**Project Grayscale — Grayscale OS v1.0**

This policy defines how documentation is classified, published, and protected across the monorepo and future repository evolution.

---

## Purpose

Grayscale is transitioning from an engineering monorepo to a **professionally documented platform**. Not all repository content belongs in public view. This policy ensures:

- Customers and developers receive clear, accurate product documentation
- Internal constitutional, certification, and planning material stays protected
- The public Documentation Center (`/docs`) serves only **PUBLIC** and curated **DEVELOPER** content

---

## Visibility Levels

### PUBLIC

Intended for customers, prospects, partners, and the open web.

**Includes:**

- Product documentation (Mission Control, Twin, Council, Simulation, etc.)
- Getting started guides and tutorials
- Architecture overview (non-debate, non-internal)
- API reference (stable, supported surfaces)
- SDK documentation (Plugin SDK, integration patterns)
- Deployment guides for self-hosted evaluation
- FAQ and release notes (commercial releases)

**Publishing:** Rendered in the website Documentation Center at `/docs`. May also be mirrored to `grayscale-docs` in future repository splits.

**Review:** Product + engineering sign-off before inclusion in the public manifest.

---

### DEVELOPER

Intended for builders extending Grayscale — plugin authors, integration partners, runtime extension developers.

**Includes:**

- Plugin SDK specification and examples
- Executive SDK patterns (where explicitly opened)
- Runtime extension guides
- Integration guides (connectors, webhooks, sandbox)
- Developer authentication and sandbox setup

**Publishing:** Rendered in `/docs` under Developer sections. Some DEVELOPER docs may require authenticated access in future (partner portal).

**Review:** Platform engineering + security review.

---

### INTERNAL

Must **never** appear in the public Documentation Center or public repository mirrors.

**Includes (non-exhaustive):**

- Sprint certificates and phase certification reports
- Internal validation and engineering verdict documents
- ADR drafts, architecture debates, and pre-decision discussions
- Founder prompts and executive prompt packs (`prompts/`)
- Cursor prompts and agent session artifacts
- Internal roadmaps and pre-announce planning
- Executive implementation notes and certification checklists
- Internal engineering reports and performance benchmarks (pre-release)
- Competitive analysis and pricing experiments
- Unreleased feature specifications

**Publishing:** Remains in `grayscale-internal` (future) or monorepo `docs/` with **no** entry in the public docs manifest.

**Access:** Founders, core engineering, and explicitly authorized contributors only.

---

## Documentation Center Rules

1. **Allowlist only** — The web app loads markdown via an explicit manifest. Arbitrary path traversal to `docs/` is forbidden.
2. **No runtime coupling** — Documentation rendering does not invoke Bedrock, APIs, or CompanyContext.
3. **Version pinning** — Public docs declare a version (currently **Grayscale OS v1.0**). Breaking changes require version bumps in the selector.
4. **Internal leakage review** — Before adding any file to the manifest, confirm it contains no INTERNAL-class content per this policy.
5. **GitHub is not the product docs surface** — External users should use `/docs`, not raw repository browsing, for product learning.

---

## Roles & Responsibilities

| Role | Responsibility |
|------|----------------|
| **Product** | PUBLIC product doc accuracy, FAQ, getting started |
| **Platform Engineering** | DEVELOPER docs, API reference, SDK specs |
| **Security** | Review PUBLIC/DEVELOPER docs for credential leaks, internal paths |
| **Founder / Architecture** | Approve architecture overview; gate INTERNAL exposure |

---

## Future Repository Evolution

When the monorepo splits (see `docs/platform/REPOSITORY_STRATEGY.md`):

| Repository | Documentation |
|------------|---------------|
| `grayscale-docs` | PUBLIC + DEVELOPER published content |
| `grayscale-sdk` | SDK docs co-located with packages |
| `grayscale-internal` | INTERNAL only — never deployed to public docs CDN |

---

## Amendment

Changes to this policy require founder or architecture lock approval. Version: **1.0** — Grayscale OS v1.0 launch documentation initiative.
