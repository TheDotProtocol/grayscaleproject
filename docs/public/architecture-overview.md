# Architecture Overview

High-level architecture of Grayscale OS v1.0 — for founders, architects, and developers.

---

## Design Principles

1. **Event-sourced bedrock** — Persist-then-publish; every action traceable
2. **Unified CompanyContext** — One read-only organizational state; no duplicate storage
3. **Constitutional hierarchy** — Founder Constitution → Policy Engine → Governance Kernel
4. **Explainability over confidence** — Unknown is preferable to fabricated certainty
5. **Architecture Lock** — Bedrock is frozen; extensions are constitutional, not rewrites

---

## Platform Layers

```
┌─────────────────────────────────────────────────────────┐
│  Mission Control · Founder Workspace · Command Bridge   │
├─────────────────────────────────────────────────────────┤
│  Executive Intelligence · Council · Athena            │
├─────────────────────────────────────────────────────────┤
│  Organizational Nervous System · Twin · Simulation      │
├─────────────────────────────────────────────────────────┤
│  OrgOS · Runtime · Scheduler · Heartbeat                │
├─────────────────────────────────────────────────────────┤
│  Policy Engine · Governance Kernel                      │
├─────────────────────────────────────────────────────────┤
│  Bedrock · Event Store · Memory · Graph · Intelligence  │
└─────────────────────────────────────────────────────────┘
```

---

## Bedrock

The certified foundation (96/100 — **FROZEN**):

- PostgreSQL event store
- Memory engine and index
- Knowledge graph
- Strategic intelligence layer
- Integration connectors

See [Bedrock / Grayscale OS v1.0](/docs/bedrock) for the commercial release overview.

---

## CompanyContext

All capabilities read organizational state through **CompanyContext** — assembled by the Context Runtime. Executives, Mission Control widgets, and governance modules **never** query duplicate stores directly.

Properties:

- Read-only at consumption boundaries
- Versioned (`contextVersion` in API responses)
- Explainable provenance for every field

---

## Constitutional Governance

| Layer | Role |
|-------|------|
| **Founder Constitution** | Immutable founder authority principles |
| **Policy Engine** | Evaluates permitted / prohibited / requires approval |
| **Governance Kernel** | Final checkpoint before execution; default deny |

No implicit permissions. No black-box automation.

---

## Mission Control

Live operational surface for founders and boards:

- Platform Health vs Company Readiness (distinct metrics)
- Widget framework (80+ backend contracts)
- Unified organizational timeline
- Search and command palette

[Mission Control documentation →](/docs/mission-control)

---

## Executive Intelligence

Multi-executive framework with certification gates:

- Recommendation pipeline with evidence
- Executive Compliance Suite (ECS)
- Per-executive activation requirements

[Executives overview →](/docs/executives) · [Athena reference →](/docs/athena)

---

## Organizational Nervous System

Perception and modeling layer:

- [Digital Twin](/docs/twin) — Living organizational model
- [Simulation Engine](/docs/simulation) — Scenario exploration
- [Foresight / Forecast](/docs/forecast) — Forward-looking intelligence
- [Executive Council](/docs/council) — Structured deliberation

---

## Open Platform

Grayscale separates **Open Platform** (APIs, SDK, extension points) from **Commercial Core** (Bedrock runtime, cloud, enterprise).

Developers **build on top** — plugins, connectors, integrations — they do not reproduce the full Organizational Operating System as a competing product.

Strategy documents (repository planning):

- Documentation Policy — visibility levels
- Open Platform Strategy — commercial boundaries
- Licensing Strategy — tiered licensing recommendation

---

## Security

Company-scoped data plane, credential vault, integration sandbox, and security observatory.

[Security model →](/docs/security)

---

## Further Reading

- [Getting Started](/docs/quick-start)
- [API Reference](/docs/api)
- [Plugin SDK](/docs/sdk)
- [Deployment](/docs/deployment)
