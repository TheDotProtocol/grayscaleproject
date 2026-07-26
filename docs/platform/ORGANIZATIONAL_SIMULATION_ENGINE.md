# Organizational Simulation Engine

**Version:** 1.1.0 (Sprint 3 Phase C)  
**Status:** IMMUTABLE (constitutional hierarchy)  
**Foundation:** Bedrock v1.0.0-bedrock (Certified, FROZEN)  
**ADR:** ADR-059 (umbrella); ADR-040 (framework); ADR-058 (ONS)

---

## Preamble

The Organizational Simulation Engine explores **organizational futures** without modifying reality.

**Constitutional distinction:** The Simulation Engine simulates the **ORGANIZATION**. It does NOT simulate Athena. It does NOT simulate executives. Executives **participate inside** simulations as observers — they never own simulation history.

The organization is the simulation subject.

---

## I. Why Simulations Exist

Simulations answer: *What happens to the organization if we choose differently?* — without risking the real organization.

| Principle | Definition |
|-----------|------------|
| Exploration | Reduce cost of exploring consequences before commitment |
| Isolation | `realityModified: false` — always |
| Determinism | Reproducible from twin state + assumptions + constraints |
| Evidence-first | Every outcome traceable to twin, signals, homeostasis |
| Hypothesis | Simulation outputs are hypotheses until validated by reality |

---

## II. Simulation Philosophy

1. **Organization-first** — the org is the subject, not agents or LLMs
2. **Twin-consumed** — every simulation inherits Digital Twin state
3. **ONS-aware** — attention, signals, homeostasis inform propagation
4. **No recommendations** — simulations describe state evolution, not advice
5. **No LLM dependency** — deterministic pipeline only
6. **Explainable** — every stage auditable
7. **Certified** — production readiness requires deterministic certification

---

## III. Digital Twin Relationship

Simulations consume the Living Organizational Twin. They never bypass it.

Inherited from Twin: identity, present state, confidence, evidence, strategy view, signal view, attention slice.

Simulated twin updates exist **only within the simulation session** — never written to canonical twin storage.

---

## IV. Executive Participation

Executives **never own** simulations.

| Allowed | Forbidden |
|---------|-----------|
| Observe simulation context | Modify simulation history |
| Comment on outcomes | Execute simulation mutations |
| Challenge assumptions | Bypass twin synchronization |
| Debate alternatives | Treat simulation as fact |
| Propose alternatives | Direct Prisma access |

Executives receive simulation context via `CompanyContext.simulation` — read-only, assembled.

---

## V. Simulation Lifecycle

```
Snapshot → Context Assembly → Scenario Injection → Signal Propagation
→ Twin Update → Organizational Response → Homeostasis Update
→ Executive Observation → Outcome Generation → Risk Assessment
→ Opportunity Assessment → Explainability → Audit → Version → Certification
```

Stages recorded in `SimulationLifecycle.stages` — immutable append-only.

---

## VI. Scenario Framework

15+ deterministic scenario types. See `SIMULATION_SCENARIOS.md`.

Scenarios inherit: Twin, Signals, Insights, Intent, Temporal Intelligence, Organizational Intelligence, Homeostasis, Policies, Constraints, Founder Constitution.

---

## VII. Explainability & Audit

Every simulation explains: starting assumptions, evidence, policies, constraints, signals, twin state, homeostasis changes, stress changes, capacity changes, confidence, unknowns, alternative outcomes, rollback assumptions.

See `SIMULATION_EXPLAINABILITY.md`. Audit trail in `SimulationSession.auditTrail`.

---

## VIII. Limitations & Ethics

| Limitation | Rule |
|------------|------|
| Not prediction | Simulations explore; they do not forecast as fact |
| Incomplete models | Unknowns explicitly recorded |
| External factors | Market/regulatory response timing may be unmodeled |
| Reality supremacy | Reality always wins over simulation |

Ethics: Simulations must not manipulate Founder judgment. Layoff/hiring scenarios require explicit assumptions. Security scenarios must not expose credentials.

---

## IX. Certification

Simulation is not production-ready until deterministic certification passes. See `SIMULATION_CERTIFICATION.md`.

Gates: replay determinism, explainability, scenario reproducibility, policy/constraint compliance, Founder Constitution compliance, homeostasis validation, audit validation, version validation, twin synchronization, reality protection.

---

## X. Constitutional Position

```
ARCHITECTURE_LOCK.md
FOUNDER_CONSTITUTION.md
ORGANIZATIONAL_OPERATING_MODEL.md
ORGANIZATIONAL_NERVOUS_SYSTEM.md
LIVING_ORGANIZATIONAL_TWIN.md
ORGANIZATIONAL_SIMULATION_ENGINE.md    ← this document
Executive implementations
```

---

## XI. Non-Negotiables

- No Bedrock modifications
- No architectural rewrites
- No duplicate storage
- No Prisma from executives
- Everything event-driven, versioned, auditable, explainable, deterministic
- `EXECUTIVES_ENABLED` remains `false`
- Digital Twin remains single source of organizational truth
- ONS remains perception layer
- Homeostasis represents equilibrium — no recommendations

---

*Companion:* `SIMULATION_RUNTIME.md`, `HOMEOSTASIS_ENGINE.md`, `SIMULATION_SCENARIOS.md`
