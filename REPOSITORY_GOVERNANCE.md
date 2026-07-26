# Repository Governance

**Project Grayscale — Post Grayscale OS v1.0**

**Version:** 1.0  
**Tag:** Grayscale-OS-v1.0-Repository-Governance

---

## Purpose

This document defines how Project Grayscale separates **public developer documentation** from **internal intellectual property** while maintaining a single monorepo during Grayscale OS v1.0.

---

## Documentation Hierarchy

| Path | Audience | GitHub (current) | Website |
|------|----------|------------------|---------|
| `docs/public/` | Developers, customers, community | Visible | Rendered at `/docs` |
| `docs/internal/` | Core team, certification reviewers | Visible in monorepo* | **Never rendered** |
| `prompts/` | Internal only | Visible in monorepo* | **Never rendered** |

\* *Future: `docs/internal/` and `prompts/` migrate to private `grayscale-core` / `grayscale-internal` repositories before public GitHub exposure.*

---

## Public Documentation Rules

1. Only `docs/public/` files appear in the website docs manifest
2. Public docs contain **high-level product and developer content only**
3. No constitutional implementation, certification evidence, or executive prompts
4. README.md reflects developer platform positioning — not internal architecture

---

## Internal Documentation Rules

1. All ADRs, sprint certificates, certification reports, and executive blueprints live in `docs/internal/`
2. Indexed in `docs/internal/INTERNAL_DOCUMENTATION_INDEX.md`
3. Never added to `apps/web/src/lib/docs/manifest.ts`
4. `load-doc.ts` enforces `docs/public/` path prefix only

---

## Recommended Repository Split (Pre-Sprint 5)

| Repository | Visibility | Contents |
|------------|------------|----------|
| `grayscale-core` | Private | Bedrock, backend, executives, constitutional runtime |
| `grayscale-sdk` | Public | Plugin SDK, connectors, examples |
| `grayscale-docs` | Public | `docs/public/` source |

See `docs/internal/platform/REPOSITORY_STRATEGY.md` (internal) for migration plan.

---

## Roles

| Role | Responsibility |
|------|----------------|
| Founder / Architecture | Approve public doc additions; gate internal leakage |
| Platform Engineering | Maintain manifest allowlist and docs portal |
| Product | Public product docs accuracy |
| Security | Review public docs for credential/path leaks |

---

## Amendment

Changes require architecture lock approval. Documentation-only changes do not require Bedrock modifications.

---

## Related Documents

- [PUBLIC_DOCUMENTATION_GUIDE.md](./PUBLIC_DOCUMENTATION_GUIDE.md)
- [PUBLIC_REPOSITORY_STRUCTURE.md](./PUBLIC_REPOSITORY_STRUCTURE.md)
- [docs/internal/INTERNAL_DOCUMENTATION_INDEX.md](./docs/internal/INTERNAL_DOCUMENTATION_INDEX.md)
