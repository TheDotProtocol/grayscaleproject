# Public Documentation Guide

**For maintainers publishing Grayscale documentation**

---

## Where Public Docs Live

All public documentation is in **`docs/public/`**.

The website Documentation Center at **`/docs`** renders **only** files listed in:

```
apps/web/src/lib/docs/manifest.ts
```

The loader enforces path prefix `docs/public/` in `apps/web/src/lib/docs/load-doc.ts`.

---

## Adding a Public Document

1. Write markdown in `docs/public/` (or `docs/public/licensing/`)
2. Confirm content is **PUBLIC** per `docs/internal/DOCUMENTATION_POLICY.md`
3. Add entry to `manifest.ts` with slug, title, file path, section
4. Update `docs/internal/INTERNAL_DOCUMENTATION_INDEX.md` if moving content from internal
5. Run `pnpm build` in `apps/web` to verify static generation
6. Do **not** link to GitHub for reading — website is the portal

---

## Public Document Categories

| Category | Examples |
|----------|----------|
| Overview | Introduction, Quick Start, FAQ, Roadmap |
| Platform | Bedrock, Mission Control, Twin (high-level) |
| Developer | API, SDK, Plugins, Webhooks |
| Licensing | Edition placeholders (legal review pending) |
| Community | Code of Conduct, Contributing |

---

## Never Publish

- Executive Manifesto, Founder Constitution (full), certification reports
- ADRs, sprint certificates, engineering validation
- Executive prompt packs (`prompts/`)
- Internal platform architecture blueprints

These belong in `docs/internal/`.

---

## Link Conventions

Use absolute site paths in public docs:

```markdown
[Quick Start](/docs/quick-start)
[Contact](/contact)
```

Not GitHub raw URLs for documentation reading.

---

## Versioning

Documentation version selector shows **Grayscale OS v1.0**. Breaking doc changes require version bump in manifest `DOCS_VERSION`.

---

## Related

- [REPOSITORY_GOVERNANCE.md](./REPOSITORY_GOVERNANCE.md)
- [PUBLIC_REPOSITORY_STRUCTURE.md](./PUBLIC_REPOSITORY_STRUCTURE.md)
