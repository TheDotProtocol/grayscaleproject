# Public Repository Structure

**How GitHub presents Grayscale OS v1.0 as a developer platform**

---

## Public-Facing Surfaces

| Surface | Purpose |
|---------|---------|
| `README.md` | Developer platform entry — problem, features, build on Grayscale |
| `docs/public/` | Complete public documentation library |
| `CHANGELOG.md` | Release history (high-level) |
| `packages/plugin-sdk/` | SDK source (when extracted: `grayscale-sdk`) |
| Website `/docs` | Rendered documentation portal |

---

## Internal (Not Public Docs — Monorepo Today)

| Path | Contents |
|------|----------|
| `docs/internal/architecture/` | ADRs, architecture reviews |
| `docs/internal/platform/` | Constitutional docs, certification, runtime specs |
| `docs/internal/engineering/` | Validation reports, certification evidence |
| `docs/internal/executives/` | Executive implementation details |
| `docs/internal/api/` | Detailed internal API specifications |
| `docs/internal/releases/` | Full release documentation |
| `prompts/` | Executive prompt packs |

**Website manifest excludes all internal paths.**

---

## Target Three-Repository Split

```
grayscale-core (PRIVATE)
├── backend/
├── packages/platform/
├── packages/agents/
├── docs/internal/
└── prompts/

grayscale-sdk (PUBLIC)
├── packages/plugin-sdk/
├── packages/connector-core/
└── examples/

grayscale-docs (PUBLIC)
├── docs/public/
└── apps/web/docs-portal/   (optional extraction)
```

---

## What GitHub Users Should See

1. Professional README positioning Grayscale as an OS
2. Clean `docs/public/` tree — no constitutional dumps
3. Clear contributing and community guidelines
4. SDK and plugin development paths
5. Enterprise contact — not internal implementation

---

## What GitHub Users Should NOT Rely On

- Raw browsing of `docs/internal/` for product learning (use `/docs`)
- Copying Bedrock implementation from monorepo as a fork base
- Executive prompts from `prompts/` directory

---

## Migration Checklist (Future)

- [ ] Extract `grayscale-sdk` to public repository
- [ ] Extract `docs/public/` to `grayscale-docs`
- [ ] Move `docs/internal/` + `prompts/` to private `grayscale-core`
- [ ] Public GitHub org shows only public repositories
- [ ] Website docs CI syncs from `grayscale-docs`

---

## Related

- [REPOSITORY_GOVERNANCE.md](./REPOSITORY_GOVERNANCE.md)
- [PUBLIC_DOCUMENTATION_GUIDE.md](./PUBLIC_DOCUMENTATION_GUIDE.md)
