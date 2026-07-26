# ADR-058: Organizational Nervous System Architecture

**Status:** Accepted  
**Date:** 2026-07-26  
**Sprint:** 3 Phase B

## Context

Sprint 3 Phase B establishes the Organizational Nervous System (ONS) as the perception layer of Project Grayscale. Events are infinite; attention is scarce. Executives must consume assembled organizational awareness—not raw events.

Prior ADRs cover subsystems:

- **ADR-026** — Organizational Signal Framework
- **ADR-038** — Organizational Attention Engine
- **ADR-039** — Living Organizational Twin
- **ADR-036** — Organizational Decision Model (separate concern)

Phase B unifies these under a constitutional umbrella without reimplementing Phase C twin runtime.

## Decision

1. Adopt `ORGANIZATIONAL_NERVOUS_SYSTEM.md` as immutable constitutional document.
2. Extend platform contracts:
   - Attention Engine: `AttentionItem`, `AttentionQueue`, `AttentionPolicy`, `AttentionRule`, `AttentionExplanation`, `AttentionHistory`, `AttentionMetrics`; aliases `OrganizationalAttentionPort`, `AttentionEngine`
   - Signal Correlation: clusters, cascades, correlations, lifecycle (contracts only)
   - Twin Runtime: `TwinRuntimePort` alias, `TwinAssemblerPort`
   - Homeostasis: stability, stress, equilibrium, fatigue (contracts + deterministic assembler)
   - Twin Explainability: `TwinExplainabilityPort`
3. Extend `CompanyContext` with optional read-only ONS fields (`organizationalTwin`, `organizationalAttention`, `attentionHealth`, `signalCorrelation`, `twinHealth`, `twinState`, `homeostasis`) — assembled, not duplicated.
4. Register 17 Mission Control ONS widget contracts (backend only; UI deferred).
5. Wire `SignalCorrelationService` and `HomeostasisEngineService` into context assembly (`1.7.2-s3b-ons`).

## Consequences

- Executives and council reason from Twin + Attention + Correlation — never raw event streams.
- Mission Control can visualize ONS when UI ships; contracts exist now.
- Phase C (Simulation), D (Scenario), E (Forecast), F (Autonomous Org) must consume ONS + Twin — no bypass.
- Homeostasis provides equilibrium metrics alongside attention optimization.
- No Bedrock changes; no duplicate storage; no Prisma in executive layer.

## References

- `docs/platform/ORGANIZATIONAL_NERVOUS_SYSTEM.md`
- `docs/platform/ORGANIZATIONAL_ATTENTION_ENGINE.md`
- `docs/platform/LIVING_ORGANIZATIONAL_TWIN.md`
- `docs/platform/SIGNAL_CORRELATION.md`
- `docs/platform/TWIN_RUNTIME.md`
- `docs/platform/TWIN_EXPLAINABILITY.md`
