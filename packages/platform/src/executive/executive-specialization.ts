/** Executive specialization domains — Sprint 3 Phase D */

import type { ExecutiveCanonicalId } from "./executive-identity.js";

export type ExecutiveSpecializationDomain =
  | "operations"
  | "execution"
  | "capacity"
  | "workflow"
  | "delivery"
  | "finance"
  | "cash"
  | "revenue"
  | "forecasting"
  | "budget"
  | "communication"
  | "stakeholders"
  | "narratives"
  | "brand"
  | "risk"
  | "compliance"
  | "security"
  | "governance"
  | "long_term_strategy"
  | "scenario_comparison"
  | "trade_offs"
  | "innovation"
  | "experiments"
  | "opportunity_discovery"
  | "transformation"
  | "strategy"
  | "discovery";

export interface ExecutiveSpecialization {
  executiveId: ExecutiveCanonicalId | "athena";
  /** Canonical executive title */
  title: string;
  /** Optional persona/presentation label (Identity Engine) — not canonical identity */
  personaLabel?: string;
  domains: ExecutiveSpecializationDomain[];
  decisionClasses: string[];
  /** Executives this role depends on */
  dependsOn: string[];
  /** Executives that depend on this role */
  dependedOnBy: string[];
}

export const EXECUTIVE_SPECIALIZATIONS: Record<string, ExecutiveSpecialization> = {
  athena: {
    executiveId: "athena",
    title: "Chief Executive Strategist",
    personaLabel: "Chief of Staff",
    domains: ["strategy", "discovery"],
    decisionClasses: ["strategic", "governance"],
    dependsOn: ["navigator", "sentinel"],
    dependedOnBy: ["atlas", "ledger", "mercury", "forge"],
  },
  atlas: {
    executiveId: "atlas",
    title: "Chief Operations Executive",
    domains: ["operations", "execution", "capacity", "workflow", "delivery"],
    decisionClasses: ["operational", "infrastructure"],
    dependsOn: ["sentinel", "ledger"],
    dependedOnBy: ["mercury", "forge"],
  },
  ledger: {
    executiveId: "ledger",
    title: "Chief Financial Executive",
    domains: ["finance", "cash", "revenue", "forecasting", "budget"],
    decisionClasses: ["financial", "investment", "acquisition"],
    dependsOn: ["navigator", "sentinel"],
    dependedOnBy: ["atlas", "mercury", "forge"],
  },
  mercury: {
    executiveId: "mercury",
    title: "Chief Communications Executive",
    domains: ["communication", "stakeholders", "narratives", "brand"],
    decisionClasses: ["customer", "partnership", "growth"],
    dependsOn: ["atlas", "navigator"],
    dependedOnBy: [],
  },
  sentinel: {
    executiveId: "sentinel",
    title: "Chief Risk & Security Executive",
    domains: ["risk", "compliance", "security", "governance"],
    decisionClasses: ["security", "compliance", "legal", "emergency", "risk"],
    dependsOn: ["ledger"],
    dependedOnBy: ["atlas", "athena", "forge", "navigator"],
  },
  navigator: {
    executiveId: "navigator",
    title: "Chief Strategy Executive",
    domains: ["long_term_strategy", "scenario_comparison", "trade_offs", "strategy"],
    decisionClasses: ["strategic", "growth", "partnership"],
    dependsOn: ["ledger", "sentinel"],
    dependedOnBy: ["athena", "mercury", "forge"],
  },
  forge: {
    executiveId: "forge",
    title: "Chief Innovation Executive",
    domains: ["innovation", "experiments", "opportunity_discovery", "transformation"],
    decisionClasses: ["innovation", "technology", "product"],
    dependsOn: ["atlas", "navigator", "ledger"],
    dependedOnBy: [],
  },
};

export function getSpecialization(executiveId: string): ExecutiveSpecialization | undefined {
  return EXECUTIVE_SPECIALIZATIONS[executiveId];
}

export function executivesShareDomain(a: string, b: string): boolean {
  const specA = getSpecialization(a);
  const specB = getSpecialization(b);
  if (!specA || !specB) return false;
  return specA.domains.some((d) => specB.domains.includes(d));
}
