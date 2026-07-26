# Signal Correlation Engine

**Version:** 1.0.0 (Sprint 3 Phase B)  
**Module:** `packages/platform/src/signals/signal-correlation.ts`  
**Backend:** `backend/.../signal-correlation.service.ts`  
**ADR:** ADR-026 (Signals), ADR-058 (ONS)

---

## Purpose

Signals already exist via the Organizational Signal Bus. The Signal Correlation Engine defines **how signals become meaningful** — clusters, cascades, cross-domain patterns, and priority ranking.

Phase B delivers **contracts and deterministic assembly only**. No LLM recommendation logic.

---

## Contracts

| Type | Purpose |
|------|---------|
| `SignalCluster` | Thematic grouping of related signals |
| `SignalCascade` | Root signal → derived signal chain |
| `SignalAmplification` | Magnitude increase with correlated evidence |
| `SignalSuppression` | Noise filtering (duplicate, stale, low confidence) |
| `SignalCorrelation` | Cross-signal / cross-domain correlation |
| `SignalPriority` | Rank, urgency, importance, freshness |
| `SignalEscalation` | Escalation to attention, council, or founder |
| `SignalTimeline` | Lifecycle timeline entries |
| `SignalLifecycleStage` | emerging → active → amplifying → resolved |
| `SignalCorrelationSnapshot` | Full assembly for CompanyContext |
| `SignalCorrelationPort` | Service port |

---

## Snapshot Contents

`SignalCorrelationSnapshot` includes:

- `clusters`, `cascades`, `correlations`
- `priorities` — ranked active signals
- `weakSignals`, `emergingSignals`, `criticalSignals`
- `blindSpots` — domains with insufficient coverage

---

## Integration

- **CompanyContext.signalCorrelation** — read-only, assembler `signal-correlation`
- **Organizational Nervous System** — perception layer for signal meaning
- **Mission Control** — `signal-correlation`, `critical-signals`, `weak-signals`, `emerging-patterns` widgets
- **Attention Engine** — correlated signals inform queue ranking (future)

---

## Non-Negotiables

- Deterministic correlation in Phase B
- No executive direct signal bus access
- Everything versioned (`SIGNAL_CORRELATION_VERSION`)
- Explainable escalation paths

---

*Parent: `ORGANIZATIONAL_NERVOUS_SYSTEM.md`*
