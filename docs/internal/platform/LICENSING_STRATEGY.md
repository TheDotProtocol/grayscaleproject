# Licensing Strategy

**Project Grayscale — Commercial Protection & Developer Extension**

**Version:** 1.0  
**Status:** Recommendation — **does not change current repository license automatically**  
**Grayscale OS:** v1.0

---

## Current State

The monorepo **does not currently ship a root `LICENSE` file**. All code is proprietary by default under copyright law. This document evaluates options and recommends a path aligned with `OPEN_PLATFORM_STRATEGY.md`.

---

## Goals

1. **Protect the commercial product** — Cloud, Enterprise, and Bedrock core remain monetizable
2. **Enable developers to build on top** — Plugins, connectors, and integrations without legal ambiguity
3. **Prevent competitive reproduction** — Forking the full OOS as a competing product must be restricted
4. **Support enterprise procurement** — Clear terms for SSO, compliance, and dedicated deployment customers
5. **Allow inspection where it builds trust** — SDK and reference implementations may be source available

---

## License Options — Tradeoffs

### MIT

| Pros | Cons |
|------|------|
| Maximum adoption frictionlessness | No copyleft; full product can be forked and commercialized |
| Simple compliance for developers | No protection for Bedrock or cloud offering |
| Industry standard for SDKs | Incompatible with "build on top, don't reproduce" |

**Verdict:** Suitable **only** for small utility libraries — **not** for core platform.

---

### Apache-2.0

| Pros | Cons |
|------|------|
| Patent grant clarity | Same commercial reproduction risk as MIT |
| Enterprise-friendly | No network copyleft |
| Good for SDKs | Core platform still fully forkable |

**Verdict:** Strong candidate for **`grayscale-sdk`** packages — **not** for Bedrock core.

---

### MPL-2.0 (Mozilla Public License)

| Pros | Cons |
|------|------|
| File-level copyleft — modifications to MPL files must be shared | Allows proprietary code in same repo that links to MPL modules |
| Middle ground between permissive and strong copyleft | Complexity for legal review |
| Safer than MIT for platform-adjacent code | Does not prevent SaaS reproduction of unmodified core |

**Verdict:** Viable for **connector-core** and plugin runtime interfaces if file boundaries are clean.

---

### AGPL-3.0

| Pros | Cons |
|------|------|
| Network copyleft — SaaS users must offer source | Strongly discourages commercial cloud competitors |
| Protects against hosted forks | Enterprise customers often reject AGPL |
| Aligns with "no reproduce" philosophy | May deter legitimate integrators |

**Verdict:** Too restrictive for Open Platform developer relations — **not recommended** as default SDK license.

---

### Source Available (Custom / Elastic-style)

| Pros | Cons |
|------|------|
| Tailored restrictions (no competing SaaS, no OOS reproduction) | Non-standard; requires legal drafting |
| Can allow read + contribute without full open source | Not OSI-approved; community skepticism |
| Matches commercial strategy precisely | Per-region enforcement complexity |

**Verdict:** Strong fit for **`grayscale-core`** when source is visible to enterprise customers under contract.

---

### Business Source License (BSL)

| Pros | Cons |
|------|------|
| Proven model (MariaDB, Sentry, Cockroach patterns) | Converts to open source after Change Date — may not be desired |
| Explicit "production use" restrictions | Requires defining Additional Use Grant carefully |
| Allows development and testing freely | Developers must read BSL terms (higher friction than MIT) |

**Verdict:** **Strong candidate** for core platform if timed conversion is acceptable — or BSL without conversion (permanent source available).

---

### Dual Licensing

| Pros | Cons |
|------|------|
| OSS license for community + commercial license for enterprises | Dual license administration overhead |
| Enterprise buyers get clean proprietary terms | Contributor CLA required |
| SDK can be Apache-2.0 while core is commercial | Two legal tracks to maintain |

**Verdict:** **Recommended composite model** for Grayscale long-term.

---

## Recommendation

### Tiered Licensing Model

| Component | Recommended License | Rationale |
|-----------|---------------------|-----------|
| **Bedrock / backend / OrgOS core** | **BSL 1.1** (or custom Source Available) with **no competing OOS / hosted offering** restriction | Protects commercial cloud; allows inspection for enterprise due diligence |
| **Grayscale Cloud control plane** | **Proprietary** — no public license | Pure commercial SaaS |
| **Grayscale Enterprise deployment** | **Commercial EULA** | Contract-driven |
| **Plugin SDK + connector-core** | **Apache-2.0** | Maximize plugin ecosystem; patent grant for integrators |
| **Reference connectors & examples** | **Apache-2.0** or **MIT** | Low friction adoption |
| **Documentation (PUBLIC)** | **CC BY 4.0** or proprietary with free use | Clear reuse terms for docs |
| **Documentation (INTERNAL)** | **Proprietary** | No external license |
| **Executive prompts / prompts/** | **Proprietary — all rights reserved** | Core IP; never licensed |

### Primary Recommendation

**Dual Licensing + BSL Core:**

1. **`grayscale-sdk`** → Apache-2.0 (immediate, when extracted)
2. **`grayscale-core`** → BSL 1.1 with Additional Use Grant permitting:
   - Development and testing
   - Self-hosted **single-organization** evaluation (non-production or limited pilot — define in grant)
   - **Prohibiting:** Multi-tenant hosted Grayscale competing services; redistribution of core as "Grayscale alternative"
3. **Enterprise customers** → Commercial license superseding BSL restrictions where contracted
4. **Do not** apply MIT/Apache to the monorepo root today without component separation

### Why Not MIT/Apache for Everything?

Grayscale's value is the **integrated Organizational Operating System** — constitutional governance, CompanyContext, executive certification, and Mission Control together. Permissive licensing of the full monorepo would allow immediate commercial reproduction with minimal differentiation.

### Why Not AGPL for Everything?

Enterprise and holding-company buyers require clean proprietary terms, SSO contracts, and indemnification. AGPL creates procurement friction disproportionate to the protection gain when BSL + dual licensing achieves the same commercial boundary more predictably.

---

## Implementation Checklist (Future — Not Automatic)

- [ ] Engage legal counsel to draft BSL Additional Use Grant for Grayscale
- [ ] Add `LICENSE` to SDK packages (Apache-2.0)
- [ ] Add `LICENSE` to core (BSL) upon repository split
- [ ] Contributor License Agreement (CLA) for external PRs to SDK
- [ ] `LICENSE` notice in Documentation Center footer
- [ ] Enterprise EULA template for dedicated deployment

---

## Non-Action Statement

**This document does not modify any license in the repository today.** It records the strategic recommendation for founder and legal approval before any `LICENSE` file is committed.

Cross-references:

- `docs/platform/OPEN_PLATFORM_STRATEGY.md`
- `docs/platform/REPOSITORY_STRATEGY.md`
