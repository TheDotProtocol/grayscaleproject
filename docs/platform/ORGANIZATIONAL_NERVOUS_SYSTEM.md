# Organizational Nervous System

**Version:** 1.0.0 (Sprint 3 Phase B)  
**Status:** IMMUTABLE (constitutional hierarchy)  
**Foundation:** Bedrock v1.0.0-bedrock (Certified, FROZEN)  
**ADR:** ADR-058 (umbrella); ADR-038 (Attention); ADR-039 (Twin); ADR-026 (Signals)

> **Note:** ADR-036 governs the Organizational Decision Model. ONS architecture is ADR-058.

---

## Preamble

The Organizational Nervous System (ONS) is the **perception layer** of Project Grayscale.

Events are infinite. Attention is scarce. The organization exists to determine what deserves attention. Executives consume **attention**, not raw events.

The ONS is not a dashboard. It is the constitutional mechanism by which the organization notices change, filters noise, allocates scarce cognitive capacity, and presents a coherent organizational reality through the Living Organizational Twin.

Every executive, council session, and Mission Control surface inherits this document.

---

## Constitutional Principle

```
Events are infinite.
Attention is scarce.
The organization exists to determine what deserves attention.
Executives consume attention, not raw events.
```

No future system may bypass the Twin. The Twin is the single organizational reality.

---

## Constitutional Position

```
ARCHITECTURE_LOCK.md
FOUNDER_CONSTITUTION.md
ORGANIZATIONAL_OPERATING_MODEL.md
ORGANIZATIONAL_NERVOUS_SYSTEM.md          ← this document
ORGANIZATIONAL_ATTENTION_ENGINE.md
LIVING_ORGANIZATIONAL_TWIN.md
SIGNAL_CORRELATION.md
TWIN_RUNTIME.md
TWIN_EXPLAINABILITY.md
EXECUTIVE_COUNCIL_CONSTITUTION.md
Executive implementations
```

---

## I. Organizational Awareness

**Organizational Awareness** is the organization's capacity to notice meaningful change across domains without drowning in event volume.

| Property | Definition |
|----------|------------|
| **Scope** | Cross-domain perception assembled from signals, insights, intent, temporal context, and council state |
| **Source** | Event-driven projectors — never direct storage reads by executives |
| **Output** | Assembled `CompanyContext` slices: attention, signals, twin, homeostasis |
| **Constraint** | Awareness is read-only for executives; mutation belongs to Founder and governance |

Awareness is assembled — never duplicated. `CompanyContext` holds references; assemblers produce snapshots.

---

## II. Organizational Attention

**Organizational Attention** is the scarcest organizational resource.

See `ORGANIZATIONAL_ATTENTION_ENGINE.md` and OOM Part IV.

| Concept | Contract |
|---------|----------|
| Attention Budget | `AttentionBudget` |
| Attention Allocation | `AttentionAllocation` |
| Attention Saturation | `AttentionSaturation` |
| Attention Drift | `AttentionDrift` |
| Attention Recovery | Derived from saturation + homeostasis |
| Attention Queue | `AttentionQueue` |
| Attention Item | `AttentionItem` |
| Attention Policy / Rule | `AttentionPolicy`, `AttentionRule` |
| Attention Snapshot | `OrganizationalAttention` |
| Attention History | `AttentionHistory` |
| Attention Metrics | `AttentionMetrics` |
| Attention Health | `AttentionHealth` |
| Attention Explanation | `AttentionExplanation` |
| Attention Threshold | `AttentionThreshold` |
| Attention Domain | `AttentionDomain` |
| Attention Trend | `AttentionTrend` |

**Ports:** `OrganizationalAttentionPort`, `AttentionEngine`

Everything explainable. Everything auditable. Everything versioned.

---

## III. Signal Perception

Signals exist. The ONS determines how they become **meaningful**.

| Concept | Contract |
|---------|----------|
| Signal Importance | `SignalPriority.importance` |
| Signal Confidence | Cluster/correlation confidence scores |
| Signal Urgency | `SignalPriority.urgency` |
| Signal Freshness | `SignalPriority.freshness` |
| Signal Correlation | `SignalCorrelation` |
| Weak Signals | Filtered in `SignalCorrelationSnapshot.weakSignals` |
| Emerging Signals | `SignalCorrelationSnapshot.emergingSignals` |
| Critical Signals | `SignalCorrelationSnapshot.criticalSignals` |
| Signal Cluster | `SignalCluster` |
| Signal Cascade | `SignalCascade` |
| Signal Amplification | `SignalAmplification` |
| Signal Suppression | `SignalSuppression` |
| Signal Escalation | `SignalEscalation` |
| Signal Timeline | `SignalTimeline` |
| Signal Lifecycle | `SignalLifecycleStage` |

See `SIGNAL_CORRELATION.md`. Correlation contracts only in Phase B — no LLM recommendation logic.

---

## IV. Noise Filtering & Blind Spots

**Noise Filtering** reduces event volume to perceivable signal. Suppression reasons: duplicate, stale, low confidence, noise filter.

**Organizational Blind Spots** are domains or themes with insufficient signal coverage. Recorded in `SignalCorrelationSnapshot.blindSpots` and surfaced in Mission Control.

The organization must know what it **cannot** see — not only what it sees.

---

## V. Interrupts & Escalation

| Type | Definition |
|------|------------|
| **Founder Interrupts** | Explicit Founder-directed attention overrides — highest precedence |
| **Executive Interrupts** | Domain-executive flagged items — subordinate to Founder |
| **Escalation Thresholds** | `AttentionThreshold`, `SignalEscalation` — deterministic, auditable |

Escalation never bypasses the Twin. Escalated items enter the attention queue with evidence.

---

## VI. Cross-Domain Correlation

**Cross-Domain Correlation** connects signals across engines (strategy, pulse, council, temporal) into coherent patterns.

`SignalCorrelation.crossDomain` marks correlations spanning multiple domains. Executives reason from correlated patterns — not isolated events.

---

## VII. Attention Dynamics

| Concept | Definition |
|---------|------------|
| **Attention Decay** | Freshness degradation over time — older items lose queue rank unless revalidated |
| **Attention History** | Immutable record of allocation shifts |
| **Attention Audit** | Assembler results + event store trail |
| **Attention Explainability** | `AttentionExplanation` — why an item ranked, why drift detected |

---

## VIII. Organizational Digital Twin

The Twin is the **living representation** of organizational reality. It is not a database mirror.

The Twin consumes: Memory Engine, Knowledge Graph, Strategy Engine, Intent Engine, Temporal Intelligence, Signals, Insights, Organizational Intelligence, Executive Council, Attention Engine, Founder Constitution, Organizational Operating Model.

The Twin represents: current state, capacity, attention, health, trust, resilience, cognition, intent, priorities, constraints, risks, opportunities, confidence.

See `LIVING_ORGANIZATIONAL_TWIN.md`, `ORGANIZATIONAL_DIGITAL_TWIN.md` (alias), `TWIN_RUNTIME.md`, `TWIN_EXPLAINABILITY.md`.

**Ports:** `TwinRuntimePort`, `TwinAssemblerPort`

---

## IX. Organizational Homeostasis

Healthy organizations outperform merely optimized organizations.

The **Organizational Homeostasis Engine** maintains equilibrium alongside attention optimization.

| Concept | Contract |
|---------|----------|
| Organizational Stability | `OrganizationalStability` |
| Stress Index | `StressIndex` |
| Recovery Capacity | `RecoveryCapacity` |
| Adaptation Rate | `AdaptationRate` |
| Burnout Risk | `BurnoutRisk` |
| Operational Equilibrium | `OperationalEquilibrium` |
| Organizational Load | `OrganizationalLoad` |
| Organizational Fatigue | `OrganizationalFatigue` |
| Recovery Windows | `RecoveryWindow[]` |
| Stability Trend | `StabilityTrend` |
| Equilibrium Index | `EquilibriumIndex` |

Executives consume homeostasis alongside attention. Module: `packages/platform/src/homeostasis/`.

---

## X. CompanyContext Integration

Optional read-only fields on `CompanyContext` (no duplicated storage):

| Field | Assembler |
|-------|-----------|
| `attention` / `organizationalAttention` | `attention` |
| `twin` / `organizationalTwin` | `twin` |
| `attentionHealth` | derived from attention |
| `twinHealth` | twin.health |
| `twinState` | twin.present |
| `signalCorrelation` | `signal-correlation` |
| `homeostasis` | `homeostasis` |

Context version: `1.7.2-s3b-ons`.

---

## XI. Mission Control

Backend widget contracts reserved (UI deferred):

- Organizational Twin, Attention Heatmap, Signal Correlation, Organizational Awareness
- Attention Budget, Attention Saturation, Blind Spots
- Critical Signals, Weak Signals, Emerging Patterns
- Twin Health, Twin Evolution, Twin Confidence, Twin Integrity
- Attention History, Attention Timeline
- Homeostasis Equilibrium, Organizational Stress

Module: `packages/platform/src/mission-control/ons-widgets.ts`

---

## XII. Executive Integration

Executives **never** read raw events directly.

Executive Runtime receives:

- Organizational Twin (`organizationalTwin`)
- Attention Queue (`organizationalAttention`)
- Signal Correlation (`signalCorrelation`)
- Current Organizational State (`twinState`, `twinHealth`)
- Homeostasis (`homeostasis`)
- Council context (Phase A+)

Executives reason from the Twin — not from storage.

---

## XIII. Future Integration (Sprint 3 Phases C–F)

| Phase | Consumes ONS + Twin |
|-------|---------------------|
| C — Simulation Engine | Twin snapshots, attention constraints |
| D — Scenario Planning | Twin state, signal correlation |
| E — Forecast Intelligence | Twin timeline, attention trends |
| F — Autonomous Organization (Dormant) | Full Twin + homeostasis |

No future system may bypass the Twin.

---

## XIV. Non-Negotiables

- No Bedrock modifications
- No architectural rewrites
- No duplicate storage
- No Prisma access from executives
- No direct event consumption by executives
- Everything event-driven, explainable, auditable, versioned, constitutional
- Inherits Founder Constitution and Organizational Operating Model

---

## XV. Technical References

| Module | Path |
|--------|------|
| Attention Engine | `packages/platform/src/attention/` |
| Signal Correlation | `packages/platform/src/signals/signal-correlation.ts` |
| Twin Runtime | `packages/platform/src/twin/` |
| Homeostasis | `packages/platform/src/homeostasis/` |
| Context Assembler | `backend/.../company-context-assembler.service.ts` |
| ONS Widgets | `packages/platform/src/mission-control/ons-widgets.ts` |

---

*The objective is not another AI system. The objective is the world's first Organizational Operating System where executives reason from organizational awareness rather than isolated data.*
