/** Simulation scenario library — constitutional types (Sprint 3 Phase C) */

import type { SimulationAssumption, SimulationConstraint, SimulationScenario, SimulationScenarioType } from "./simulation-engine.js";

export const SIMULATION_SCENARIO_VERSION = "1.1.0";

/** Extended scenario types — organization-first simulation subjects */
export type ExtendedSimulationScenarioType =
  | SimulationScenarioType
  | "funding"
  | "founder_absence"
  | "competitive_attack"
  | "cost_reduction"
  | "market_expansion";

export interface SimulationScenarioDefinition {
  type: SimulationScenarioType;
  label: string;
  description: string;
  defaultAssumptions: SimulationAssumption[];
  defaultConstraints: SimulationConstraint[];
  inheritedSources: Array<
    | "twin"
    | "signals"
    | "insights"
    | "intent"
    | "temporal"
    | "organizational-intelligence"
    | "homeostasis"
    | "policies"
    | "constraints"
    | "founder-constitution"
  >;
}

export const SIMULATION_SCENARIO_LIBRARY: SimulationScenarioDefinition[] = [
  { type: "growth", label: "Growth", description: "Explore scaling operations and capacity", defaultAssumptions: [], defaultConstraints: [], inheritedSources: ["twin", "homeostasis", "intent"] },
  { type: "hiring", label: "Hiring", description: "Simulate team expansion impact on load and equilibrium", defaultAssumptions: [], defaultConstraints: [], inheritedSources: ["twin", "homeostasis", "signals"] },
  { type: "layoffs", label: "Layoffs", description: "Simulate workforce reduction and recovery capacity", defaultAssumptions: [], defaultConstraints: [], inheritedSources: ["twin", "homeostasis"] },
  { type: "revenue_decline", label: "Revenue Decline", description: "Model revenue contraction and stress response", defaultAssumptions: [], defaultConstraints: [], inheritedSources: ["twin", "temporal", "homeostasis"] },
  { type: "rapid_expansion", label: "Market Expansion", description: "Simulate accelerated market expansion", defaultAssumptions: [], defaultConstraints: [], inheritedSources: ["twin", "signals", "intent"] },
  { type: "market_change", label: "Market Change", description: "Model shifting market conditions", defaultAssumptions: [], defaultConstraints: [], inheritedSources: ["twin", "signals", "temporal"] },
  { type: "budget_change", label: "Cost Reduction / Budget Change", description: "Model budget reallocation and cost reduction", defaultAssumptions: [], defaultConstraints: [], inheritedSources: ["twin", "homeostasis", "policies"] },
  { type: "executive_loss", label: "Executive Replacement", description: "Simulate leadership transition and executive load", defaultAssumptions: [], defaultConstraints: [], inheritedSources: ["twin", "homeostasis", "organizational-intelligence"] },
  { type: "unknown_event", label: "Founder Absence", description: "Simulate founder unavailability and governance continuity", defaultAssumptions: [], defaultConstraints: [], inheritedSources: ["twin", "founder-constitution", "homeostasis"] },
  { type: "new_product_launch", label: "Product Launch", description: "Simulate product launch organizational impact", defaultAssumptions: [], defaultConstraints: [], inheritedSources: ["twin", "signals", "intent"] },
  { type: "vendor_outage", label: "Vendor Failure", description: "Simulate third-party vendor failure", defaultAssumptions: [], defaultConstraints: [], inheritedSources: ["twin", "signals"] },
  { type: "security_incident", label: "Security Incident", description: "Simulate breach response and resilience", defaultAssumptions: [], defaultConstraints: [], inheritedSources: ["twin", "homeostasis", "policies"] },
  { type: "infrastructure_failure", label: "Infrastructure Outage", description: "Simulate platform outage and recovery", defaultAssumptions: [], defaultConstraints: [], inheritedSources: ["twin", "homeostasis"] },
  { type: "regulatory_change", label: "Regulatory Change", description: "Model compliance shift and adaptation", defaultAssumptions: [], defaultConstraints: [], inheritedSources: ["twin", "policies", "constraints"] },
  { type: "custom", label: "Custom Scenario", description: "Founder-defined custom organizational scenario", defaultAssumptions: [], defaultConstraints: [], inheritedSources: ["twin", "homeostasis", "founder-constitution"] },
];

export interface SimulationScenarioPort {
  list(): Promise<SimulationScenarioDefinition[]>;
  get(type: SimulationScenarioType): Promise<SimulationScenarioDefinition | undefined>;
  buildScenario(type: SimulationScenarioType, overrides?: Partial<SimulationScenario>): Promise<SimulationScenario>;
}
