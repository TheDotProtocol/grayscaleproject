# Homeostasis Engine

**Version:** 1.1.0 (Sprint 3 Phase C)  
**Module:** `packages/platform/src/homeostasis/`  
**Backend:** `backend/src/modules/context-runtime/homeostasis-engine.service.ts`  
**ADR:** ADR-058, ADR-063

---

## Purpose

The Organizational Homeostasis Engine represents the organization's ability to maintain **operational equilibrium**. It describes organizational state only — **no recommendations**.

Healthy organizations outperform merely optimized organizations.

---

## Metrics

Every metric includes: **reason**, **confidence**, **evidence**, **trend**, **history** via `HomeostasisMetricDetail`.

| Metric | Description |
|--------|-------------|
| Organizational Stability | Overall stability score + status |
| Organizational Stress | Composite stress index |
| Recovery Capacity | Available recovery windows |
| Adaptive Capacity | Adaptation potential |
| Recovery Velocity | Speed toward equilibrium |
| Burnout Risk | Sustained load indicators |
| Operational Equilibrium | Balance vs noise |
| Organizational Balance | Composite balance index |
| Resilience Index | Failure tolerance |
| Failure Cascade Resistance | Decision cascade resistance |
| Decision Saturation | Open decision congestion |
| Attention Saturation | Attention budget utilization |
| Executive Load | Aggregate executive allocation |
| Founder Load | Founder cognitive load |
| Operational Recovery | Recovery potential |
| Health Momentum | Direction of health trend |
| Equilibrium Index | Weighted equilibrium |

---

## Integration

- **CompanyContext.homeostasis** / **organizationalHomeostasis**
- **Simulation Pipeline** — homeostasis before/after on sessions
- **Mission Control** — ONS + simulation homeostasis widgets
- **ONS** — Section IX in `ORGANIZATIONAL_NERVOUS_SYSTEM.md`

---

## Non-Negotiables

- Deterministic assembly from Attention Engine
- No LLM dependency
- No recommendation generation
- Everything explainable and auditable
