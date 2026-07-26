# Organizational Foresight Engine

**Version:** 1.0.0 (Sprint 3 Phase D)  
**Status:** IMMUTABLE (constitutional hierarchy)  
**ADR:** ADR-064

---

## Preamble

The Organizational Foresight Engine answers: **"What should the organization begin paying attention to before it becomes reality?"**

It is NOT prediction. It is NOT recommendation. It detects and explains **emerging conditions**.

Executives consume foresight. Executives never generate or own foresight.

---

## Concepts

| Concept | Contract |
|---------|----------|
| Weak Signal Detection | `WeakSignalDetection` |
| Trend Emergence | `TrendEmergence` |
| Strategic Drift | `StrategicDrift` |
| Opportunity Windows | `OpportunityWindow[]` |
| Competitive Movement | `CompetitiveMovement` |
| Internal Capability Evolution | `CapabilityEvolution` |
| Founder Blind Spots | `FounderBlindSpot` |
| Market Pattern Recognition | `MarketPattern[]` |
| Organizational Momentum | `OrganizationalMomentum` |
| Change Velocity | `ChangeVelocity` |
| Early Warning Indicators | `EarlyWarningIndicator[]` |
| Foresight Confidence | `ForesightConfidence` |
| Evidence Traceability | Every metric includes `evidence[]` |

---

## Integration

- **CompanyContext.foresight** / **organizationalForesight** — read-only assembled
- Consumes: Signals, Attention, Intent
- Mission Control: `organizational-foresight`, `strategic-drift`, `weak-signals-foresight`, `opportunity-radar`

---

## Non-Negotiables

- Deterministic assembly — no LLM
- No recommendations — emerging conditions only
- Everything explainable with confidence and evidence

*Parent: Organizational Nervous System (perception) → Foresight (emerging conditions)*
