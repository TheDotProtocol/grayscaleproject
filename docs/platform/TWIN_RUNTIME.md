# Twin Runtime

**Version:** 1.0.0 (Sprint 3 Phase B alignment)  
**Module:** `packages/platform/src/twin/`  
**Backend:** `backend/src/modules/twin-runtime/`, `backend/.../twin-engine.service.ts`  
**ADR:** ADR-039, ADR-058

---

## Purpose

Twin Runtime assembles and serves the **Living Organizational Twin** — the single organizational reality for executives, council, simulation, and Mission Control.

The Twin is assembled from `CompanyContext`, not queried ad hoc from storage.

---

## Ports

| Port | Purpose |
|------|---------|
| `OrganizationalTwinPort` | Full twin lifecycle API |
| `TwinRuntimePort` | Alias for `OrganizationalTwinPort` (Phase B naming) |
| `TwinAssemblerPort` | Assemble twin from pre-built context |

---

## Core Contracts

| Type | Purpose |
|------|---------|
| `OrganizationalTwin` | Full twin assembly |
| `TwinSnapshot` | Point-in-time capture |
| `TwinTimeline` | Temporal twin history |
| `TwinState` / `TwinPresentState` | Current organizational state |
| `TwinHealth` | Twin health assessment |
| `TwinMetrics` | Operational metrics |
| `TwinAttention` | Attention slice within twin |
| `TwinCapacity` | Organizational capacity |
| `TwinResilience` | Resilience indicators |
| `TwinIntent` | Intent alignment |
| `TwinIdentity` | Organizational identity persistence |
| `TwinConfidence` | Confidence breakdown |
| `TwinVersion` | Version metadata |
| `TwinEvolution` | Evolution over time |
| `TwinIntegrity` | Integrity checks |
| `TwinConsistency` | Cross-source consistency |
| `TwinExplainability` | See `TWIN_EXPLAINABILITY.md` |

---

## Assembly Flow

```
CompanyContextAssembler
  → base context (strategy, memory, signals, attention, council, …)
  → TwinEngineService.assembleFromContext()
  → CompanyContext.twin / organizationalTwin
```

Context assembler ID: `twin`  
Context version: `1.7.2-s3b-ons`

---

## Integration

- **Executive Runtime** — receives `organizationalTwin`, `twinState`, `twinHealth`
- **Mission Control** — twin widgets + ONS twin widgets
- **Simulation / Scenario / Forecast** — must consume twin snapshots (Phase C+)

---

## Non-Negotiables

- One canonical twin per company
- No duplicate organization models
- No direct Prisma access from executives
- Everything versioned, explainable, auditable
- Reality supersedes simulation and forecast

---

*See also: `LIVING_ORGANIZATIONAL_TWIN.md`, `ORGANIZATIONAL_DIGITAL_TWIN.md`*
