/** Executive registry — immutable Phase D roster (Sprint 3) */

import type { ExecutiveIdentityRecord } from "./executive-identity.js";
import { EXECUTIVE_SPECIALIZATIONS } from "./executive-specialization.js";

export const PHASE_D_EXECUTIVE_IDS = [
  "athena",
  "atlas",
  "ledger",
  "mercury",
  "sentinel",
  "navigator",
  "forge",
] as const;

export type PhaseDExecutiveId = (typeof PHASE_D_EXECUTIVE_IDS)[number];

const now = () => new Date().toISOString();

function buildRecord(
  canonicalName: PhaseDExecutiveId,
  overrides: Partial<ExecutiveIdentityRecord> & Pick<ExecutiveIdentityRecord, "title" | "department" | "mission">,
): ExecutiveIdentityRecord {
  const spec = EXECUTIVE_SPECIALIZATIONS[canonicalName]!;
  return {
    id: `exec-${canonicalName}`,
    canonicalName,
    reportsTo: "founder",
    responsibilities: spec.domains.map((d) => d.replace(/_/g, " ")),
    authority: spec.decisionClasses.map((c) => `decisions:${c}`),
    limitations: [
      "Must not query source systems directly",
      "Must reason through CompanyContext.twin only",
      "Must not communicate via direct service calls",
      "Must remain dormant until Founder activation",
    ],
    capabilities: [`${canonicalName}.discovery`, `${canonicalName}.recommendation`, `${canonicalName}.council`],
    permissions: ["read:company_context", "write:executive_output", "send:executive_bus"],
    kpis: [{ id: "certification_score", name: "ECS Score", description: "Executive Compliance Suite score", target: 90, unit: "percent" }],
    missionControlWidgets: [`${canonicalName}-status`, `${canonicalName}-discovery`, `${canonicalName}-explainability`],
    version: "1.0.0",
    registeredAt: now(),
    ...overrides,
  };
}

export const EXECUTIVE_REGISTRY: Record<PhaseDExecutiveId, ExecutiveIdentityRecord> = {
  athena: buildRecord("athena", {
    title: "Chief Executive Strategist",
    department: "operations",
    mission: "Reference executive — discovery, recommendation, and constitutional governance through the Executive Council.",
  }),
  atlas: buildRecord("atlas", {
    title: "Chief Operations Executive",
    department: "operations",
    mission: "Operations, execution, capacity, workflow, and delivery excellence.",
  }),
  ledger: buildRecord("ledger", {
    title: "Chief Financial Executive",
    department: "finance",
    mission: "Finance, cash, revenue, forecasting, and budget stewardship.",
  }),
  mercury: buildRecord("mercury", {
    title: "Chief Communications Executive",
    department: "communications",
    mission: "Communication, stakeholders, narratives, and brand coherence.",
  }),
  sentinel: buildRecord("sentinel", {
    title: "Chief Risk & Security Executive",
    department: "risk",
    mission: "Risk, compliance, security, and governance protection.",
  }),
  navigator: buildRecord("navigator", {
    title: "Chief Strategy Executive",
    department: "strategy",
    mission: "Long-term strategy, scenario comparison, and trade-off analysis.",
  }),
  forge: buildRecord("forge", {
    title: "Chief Innovation Executive",
    department: "innovation",
    mission: "Innovation, experiments, opportunity discovery, and transformation.",
  }),
};

export function isPhaseDExecutive(id: string): id is PhaseDExecutiveId {
  return PHASE_D_EXECUTIVE_IDS.includes(id as PhaseDExecutiveId);
}

export function getExecutiveRecord(id: string): ExecutiveIdentityRecord | undefined {
  return isPhaseDExecutive(id) ? EXECUTIVE_REGISTRY[id] : undefined;
}
