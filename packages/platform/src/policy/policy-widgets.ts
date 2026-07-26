/** Mission Control — Policy Engine & Governance widget contracts (Sprint 4 Phase D) */

import type { MissionControlWidgetDefinition } from "../mission-control/widgets.js";

export const POLICY_MC_WIDGET_IDS = [
  "policy-health",
  "policy-violations",
  "policy-decisions",
  "approval-queue",
  "founder-approvals",
  "council-approvals",
  "governance-health",
  "policy-history",
  "policy-explainability",
  "constraint-dashboard",
  "policy-coverage",
  "governance-timeline",
  "exception-queue",
  "risk-escalation",
  "governance-certification",
] as const;

export const POLICY_WIDGET_DEFINITIONS: Pick<
  MissionControlWidgetDefinition,
  "id" | "name" | "category" | "dataProvider" | "emptyState"
>[] = [
  { id: "policy-health", name: "Policy Health", category: "health", dataProvider: "policy.health", emptyState: "Policy health unavailable." },
  { id: "policy-violations", name: "Policy Violations", category: "operations", dataProvider: "policy.violations", emptyState: "No violations." },
  { id: "policy-decisions", name: "Policy Decisions", category: "operations", dataProvider: "policy.decisions", emptyState: "No decisions." },
  { id: "approval-queue", name: "Approval Queue", category: "operations", dataProvider: "policy.approval-queue", emptyState: "Queue empty." },
  { id: "founder-approvals", name: "Founder Approvals", category: "operations", dataProvider: "policy.founder-approvals", emptyState: "No founder approvals pending." },
  { id: "council-approvals", name: "Council Approvals", category: "operations", dataProvider: "policy.council-approvals", emptyState: "No council approvals pending." },
  { id: "governance-health", name: "Governance Health", category: "health", dataProvider: "governance.health", emptyState: "Governance health unavailable." },
  { id: "policy-history", name: "Policy History", category: "operations", dataProvider: "policy.history", emptyState: "No history." },
  { id: "policy-explainability", name: "Policy Explainability", category: "operations", dataProvider: "policy.explainability", emptyState: "No explainability records." },
  { id: "constraint-dashboard", name: "Constraint Dashboard", category: "operations", dataProvider: "policy.constraints", emptyState: "No constraints." },
  { id: "policy-coverage", name: "Policy Coverage", category: "intelligence", dataProvider: "policy.coverage", emptyState: "Coverage unavailable." },
  { id: "governance-timeline", name: "Governance Timeline", category: "operations", dataProvider: "governance.timeline", emptyState: "No timeline events." },
  { id: "exception-queue", name: "Exception Queue", category: "operations", dataProvider: "policy.exceptions", emptyState: "No exceptions." },
  { id: "risk-escalation", name: "Risk Escalation", category: "operations", dataProvider: "governance.risk-escalation", emptyState: "No escalations." },
  { id: "governance-certification", name: "Governance Certification", category: "health", dataProvider: "governance.certification", emptyState: "Not certified." },
];
