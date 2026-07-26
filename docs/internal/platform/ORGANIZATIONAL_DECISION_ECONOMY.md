# Organizational Decision Economy

**Version:** 1.0.0 (Sprint 3 Phase D)  
**Status:** IMMUTABLE  
**ADR:** ADR-066

---

## Purpose

Every organizational decision should eventually become **measurable**. The Decision Economy models costs, debt, velocity, and bandwidth — not recommendations.

---

## Metrics

| Metric | Description |
|--------|-------------|
| Decision Cost | Congestion as cost proxy (hours) |
| Decision Debt | Deferred decisions |
| Decision Velocity | Throughput inverse of backlog |
| Decision ROI | Quality inverse of congestion |
| Decision Complexity | Open decisions + council load |
| Decision Confidence | Inverse of attention drift |
| Decision Quality | Signal-to-noise in decision environment |
| Opportunity Cost | Deferred items |
| Attention Cost | Cognitive slots consumed |
| Founder Bandwidth | Founder utilization |
| Executive Bandwidth | Executive load aggregate |
| Risk Reduction | Capacity headroom |

---

## Integration

- **CompanyContext.decisionEconomy** — read-only
- Consumes: Attention Engine
- Mission Control: `decision-economy`

Executives consume decision economy metrics. Executives do not own them.
