# Project Grayscale — Grayscale OS v1.0

**The Organizational Operating System for decisive leadership.**

Grayscale OS is infrastructure for **collective judgment** — institutional memory, executive explainability, and constitutional governance for founders, boards, and enterprises.

**Codename:** Bedrock · **Version:** v1.0 · **Documentation:** [projectgrayscale.com/docs](https://www.projectgrayscale.com/docs)

---

## The Problem

Organizations fail not from lack of data, but from:

- Decisions made without institutional context
- Strategy drifting from execution without visibility
- Founders carrying cognitive load that should belong to the organization
- Tools that optimize for engagement, not judgment
- Automation without permission, audit, or reversibility

---

## What Grayscale OS Is

Grayscale OS is **not** a chatbot or productivity tool. It is an **Organizational Operating System**:

| Layer | Purpose |
|-------|---------|
| **Bedrock** | Event-sourced platform — memory, graph, intelligence |
| **Mission Control** | Founder command surface — health, timeline, widgets |
| **Executive Intelligence** | Multi-executive advisory framework |
| **Organizational Nervous System** | Twin, simulation, foresight, signals |
| **OrgOS** | Continuous organizational runtime |
| **Governance** | Policy Engine + Governance Kernel — permission before execution |

Everything is **deterministic**, **explainable**, **versioned**, and **auditable**.

---

## Features

- Live Mission Control with organizational health and readiness
- Unified CompanyContext — one read-only organizational state
- Digital Twin and Simulation Engine
- Executive Council deliberation
- Plugin SDK and integration platform
- Constitutional governance — default deny, explicit allow

---

## Architecture Overview

```
Mission Control · Founder Workspace
Executive Intelligence · Council
Organizational Nervous System · Twin · Simulation
OrgOS · Runtime · Scheduler
Policy Engine · Governance Kernel
Bedrock · Event Store · Memory · Graph
```

High-level only — internal implementation details are not published.  
**Full overview:** [Documentation → Architecture](https://www.projectgrayscale.com/docs/architecture)

---

## For Developers — Build on Grayscale

Grayscale is an **operating system**. Developers build **on top** of the platform:

| Build | Examples |
|-------|----------|
| **Plugins** | Connectors, sync jobs, integrations |
| **Connectors** | GitHub, CRM, billing, industry data |
| **Widgets** | Mission Control dashboard extensions |
| **Industry Packs** | Vertical templates and policies |
| **Automations** | Governance-approved workflow rules |

**Do not** recreate Grayscale as a competing platform. Extend it.

| Resource | Link |
|----------|------|
| Documentation | [/docs](https://www.projectgrayscale.com/docs) |
| Quick Start | [/docs/quick-start](https://www.projectgrayscale.com/docs/quick-start) |
| API Reference | [/docs/api](https://www.projectgrayscale.com/docs/api) |
| SDK Guide | [/docs/sdk](https://www.projectgrayscale.com/docs/sdk) |
| Plugin Development | [/docs/plugins](https://www.projectgrayscale.com/docs/plugins) |

---

## Getting Started

```bash
git clone https://github.com/TheDotProtocol/grayscaleproject.git
cd grayscaleproject
cp .env.example .env
docker compose up -d
pnpm install && pnpm db:push
cd apps/web && pnpm dev
```

| Service | URL |
|---------|-----|
| Website & Docs | http://localhost:3000/docs |
| API | http://localhost:4000 |

See [Installation Guide](https://www.projectgrayscale.com/docs/installation) for details.

---

## Documentation

All public documentation lives in **`docs/public/`** and renders at **`/docs`** on the website.

- [Introduction](https://www.projectgrayscale.com/docs)
- [Developer Platform](https://www.projectgrayscale.com/docs/developer-platform)
- [Release Notes](https://www.projectgrayscale.com/docs/release-notes)
- [Public Roadmap](https://www.projectgrayscale.com/docs/roadmap)
- [FAQ](https://www.projectgrayscale.com/docs/faq)
- [Contributing](https://www.projectgrayscale.com/docs/contributing)

Internal constitutional and certification documentation is maintained separately in `docs/internal/` for the private development repository.

---

## Community

- [Code of Conduct](./docs/public/code-of-conduct.md)
- [Community Guidelines](./docs/public/community-guidelines.md)
- [Contact](https://www.projectgrayscale.com/contact) — info@projectgrayscale.com

---

## Enterprise

Dedicated deployment, SSO, custom policies, and compliance packs for boards, holding companies, and PE.

**Contact:** [sales@projectgrayscale.com](mailto:sales@projectgrayscale.com) · [Enterprise Edition](https://www.projectgrayscale.com/docs/licensing/enterprise)

---

## Repository Structure

```
apps/web/           Next.js — website, docs portal, founder workspace
backend/            NestJS API
packages/           shared, platform, plugin-sdk, connectors
docs/public/        Public documentation (GitHub + website)
docs/internal/      Internal IP (private repo in future split)
prompts/            Executive prompts (internal — not public docs)
```

**Future evolution:** `grayscale-core` (private) · `grayscale-sdk` (public) · `grayscale-docs` (public)

See [REPOSITORY_GOVERNANCE.md](./REPOSITORY_GOVERNANCE.md) and [PUBLIC_REPOSITORY_STRUCTURE.md](./PUBLIC_REPOSITORY_STRUCTURE.md).

---

## Release

**Grayscale OS v1.0** — Commercial release, July 2026.  
[Release Notes](./docs/public/release-notes.md) · [CHANGELOG](./CHANGELOG.md)

---

## License

Licensing under legal review. See [License Overview](./docs/public/license.md).  
Core platform: commercial. SDK target: permissive (Apache-2.0 planned).

---

**Project Grayscale** — A AR Holdings Group Company
