# Founder Workspace Architecture

**Version:** 1.0.0 (RC1 Track A)  
**Status:** Immutable

---

## Purpose

The Founder Workspace is the **only human-first interface** for Project Grayscale. Every platform capability plugs into the Workspace. The Workspace orchestrates — it never duplicates business logic.

---

## Principles

1. **API-only** — Workspace consumes backend APIs only. No direct Prisma. No duplicated storage.
2. **Explainable** — Every page surfaces evidence, confidence, and reasoning where available.
3. **Auditable** — Every action routes through documented API endpoints with correlation.
4. **Modular** — Capabilities remain independent modules; Workspace composes them.
5. **Reusable widgets** — Mission Control widgets render anywhere in the Workspace.
6. **Twin-centric** — Organizational truth flows through the Living Organizational Twin.
7. **Constitutional** — EXECUTIVES_ENABLED remains false until Founder activation; UI reflects dormant certified executives.

---

## Architecture

```
Founder Workspace (apps/web)
        ↓ API only
Backend Modules (NestJS)
        ↓
Platform Contracts (@grayscale/platform)
        ↓
Bedrock (frozen)
```

---

## Primary Navigation

Home · Organization · Mission Control · Executive Council · Living Organizational Twin · Strategy · Projects · Goals · Memory · Knowledge Graph · Notebook · Learning · Wisdom · Reflection · Simulation · Forecasts · Automation · Integrations · Settings · Founder Profile

---

## Executive Workspaces

Seven constitutional executives each have dedicated workspace pages consuming executive-runtime, compliance, and Mission Control APIs — no chat interface.

---

## Constitutional Hierarchy

```
ARCHITECTURE_LOCK.md
FOUNDER_CONSTITUTION.md
ORGANIZATIONAL_OPERATING_MODEL.md
ORGANIZATIONAL_EVOLUTION_CONSTITUTION.md
FOUNDER_WORKSPACE_ARCHITECTURE.md  ← this document
```

---

*The Founder interacts with the organization. The platform orchestrates. The architecture remains invisible.*
