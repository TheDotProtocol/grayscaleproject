# Repository Strategy

**Project Grayscale — Future Evolution Plan**

**Version:** 1.0  
**Status:** Planning only — **do not split repositories yet**  
**Current state:** Single monorepo (`grayscaleproject`)

---

## Purpose

This document describes the **target repository architecture** for when Grayscale scales engineering, open platform contributions, and commercial separation. It is a roadmap — not an immediate action item.

---

## Current State (Grayscale OS v1.0)

```
grayscaleproject/          # Monorepo (this repository)
├── apps/web               # Next.js founder workspace + marketing + docs portal
├── apps/desktop           # Tauri shell
├── backend/               # NestJS API (Bedrock surface)
├── packages/              # shared, platform, agents, connectors, plugin-sdk
├── docs/                  # All documentation (PUBLIC + INTERNAL today)
├── prompts/               # Executive prompt packs (INTERNAL)
└── tests/
```

**Constraints today:**

- Single git history and CI pipeline
- INTERNAL and PUBLIC docs coexist — filtered at publish time via docs manifest
- No separate release trains per repository

---

## Target Repository Architecture

### `grayscale-core`

**Contents:** Bedrock runtime, backend, platform packages, agents runtime, constitutional modules.

**Visibility:** Private / commercial license.

**Consumers:** `grayscale-cloud`, `grayscale-enterprise`, internal CI.

**Release:** Semver aligned with Grayscale OS versions (e.g., `1.0.0-bedrock`).

---

### `grayscale-sdk`

**Contents:** `@grayscale/plugin-sdk`, `@grayscale/connector-core`, reference connectors, CLI tooling.

**Visibility:** Source available (license TBD — see `LICENSING_STRATEGY.md`).

**Consumers:** External plugin developers, partners.

**Release:** Independent semver; compatibility matrix with core platform versions.

---

### `grayscale-docs`

**Contents:** PUBLIC + DEVELOPER documentation sources; MDX/markdown; docs site generator (or sync from `apps/web` docs portal sources).

**Visibility:** Public GitHub / static CDN.

**Consumers:** Customers, developers, search engines.

**Release:** Docs version tracks Grayscale OS version selector.

---

### `grayscale-cloud`

**Contents:** Multi-tenant control plane, billing integration, SSO, deployment manifests, cloud-specific services.

**Visibility:** Private.

**Consumers:** SaaS operations, managed hosting.

**Release:** Continuous deployment; pinned to `grayscale-core` releases.

---

### `grayscale-enterprise`

**Contents:** Enterprise deployment templates, compliance packs, federation modules, dedicated support tooling.

**Visibility:** Private / contractual distribution.

**Consumers:** Enterprise customers, professional services.

**Release:** Contract-driven; long-term support branches.

---

### `grayscale-internal`

**Contents:** Sprint certificates, certification reports, internal ADRs (pre-publication), founder prompts, cursor artifacts, roadmaps, engineering validation.

**Visibility:** Private — founders and core engineering only.

**Consumers:** Internal CI, certification gates, architecture reviews.

**Release:** Not published externally.

---

## Migration Principles (When Split Occurs)

1. **No big-bang rewrite** — Extract packages with proven boundaries first (SDK, docs).
2. **Preserve Architecture Lock** — Bedrock remains frozen; splits are organizational, not architectural rewrites.
3. **Manifest-driven docs** — Public docs allowlist moves with `grayscale-docs`; internal never syncs.
4. **Git history** — Prefer `git filter-repo` or subtree splits with preserved blame for legal audit trails.
5. **CI coupling** — Cross-repo integration tests pin compatible versions via lockfiles.

---

## Dependency Graph (Target)

```
grayscale-internal     (no upstream deps on commercial repos)

grayscale-core         ← grayscale-cloud
                       ← grayscale-enterprise

grayscale-sdk          ← grayscale-core (API contracts only, not full core)

grayscale-docs         ← references grayscale-sdk + public API specs
                       (no dependency on grayscale-internal)

grayscale-cloud        ← grayscale-core
grayscale-enterprise   ← grayscale-core
```

---

## Timeline (Indicative — Not Committed)

| Phase | Milestone |
|-------|-----------|
| **Now (v1.0)** | Monorepo; docs portal; policy indexes |
| **Phase A** | Extract `grayscale-docs` content pipeline |
| **Phase B** | Publish `grayscale-sdk` source available |
| **Phase C** | Private `grayscale-core` with cloud deployment repo |
| **Phase D** | `grayscale-internal` hard separation; enterprise repo |

---

## Non-Action Statement

**This document does not authorize repository splits today.** Engineering continues in the monorepo until founder and platform leadership approve Phase A.

Cross-references:

- `docs/DOCUMENTATION_POLICY.md`
- `docs/platform/OPEN_PLATFORM_STRATEGY.md`
- `docs/platform/LICENSING_STRATEGY.md`
- `docs/platform/PUBLIC_DOCUMENT_INDEX.md`
- `docs/platform/INTERNAL_DOCUMENT_INDEX.md`
