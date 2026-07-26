# Simulation Engine

**Sprint 3 Phase C** | ADR-040

## Purpose

Simulation explores alternative possibilities. It is NOT prediction.

## Principles

- Simulations consume the Living Organizational Twin
- Simulations never modify reality (`realityModified: false`)
- Deterministic outcomes from assumptions + constraints + twin state
- Full audit trail and replay support

## Lifecycle

`created → assumptions_set → constraints_applied → running → outcomes_generated → compared → explained → archived`

## Scenario Types

growth, market_change, hiring, layoffs, budget_change, infrastructure_failure, security_incident, vendor_outage, revenue_decline, rapid_expansion, new_product_launch, regulatory_change, executive_loss, unknown_event, custom
