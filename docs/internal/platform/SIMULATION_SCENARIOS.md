# Simulation Scenarios

**Version:** 1.1.0 | **Module:** `packages/platform/src/simulation/simulation-scenarios.ts`

## Scenario Types (15)

| Type | Label |
|------|-------|
| `growth` | Growth |
| `hiring` | Hiring |
| `layoffs` | Layoffs |
| `revenue_decline` | Revenue Decline |
| `rapid_expansion` | Market Expansion |
| `market_change` | Market Change |
| `budget_change` | Cost Reduction / Budget Change |
| `executive_loss` | Executive Replacement |
| `unknown_event` | Founder Absence |
| `new_product_launch` | Product Launch |
| `vendor_outage` | Vendor Failure |
| `security_incident` | Security Incident |
| `infrastructure_failure` | Infrastructure Outage |
| `regulatory_change` | Regulatory Change |
| `custom` | Custom Scenario |

## Inheritance

Each scenario inherits from: Digital Twin, Organizational State, Signals, Insights, Intent, Temporal Intelligence, Organizational Intelligence, Homeostasis, Policies, Constraints, Founder Constitution.

## Deterministic Stress Multipliers

Scenario type maps to organizational stress delta via `SCENARIO_STRESS_MULTIPLIER` in `SimulationRunnerService` — no LLM, no randomness in outcome computation.
