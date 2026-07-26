/** Mission Control — Executive Council widget contracts (Sprint 3 Phase A) */

import type { MissionControlWidgetDefinition } from "./widgets.js";

export const COUNCIL_MC_WIDGET_IDS = [
  "executive-council",
  "council-sessions",
  "council-open-deliberations",
  "council-consensus-score",
  "council-minority-opinions",
  "council-executive-participation",
  "council-health",
  "council-trust",
  "council-decisions",
  "council-founder-overrides",
  "council-history",
  "council-audit",
  "council-timeline",
  "council-metrics",
] as const;

export type CouncilMcWidgetId = (typeof COUNCIL_MC_WIDGET_IDS)[number];

export const RESERVED_COUNCIL_MC_WIDGETS: Pick<
  MissionControlWidgetDefinition,
  "id" | "name" | "category" | "dataProvider" | "emptyState"
>[] = [
  { id: "executive-council", name: "Executive Council", category: "intelligence", dataProvider: "council.feed", emptyState: "No council activity." },
  { id: "council-sessions", name: "Council Sessions", category: "intelligence", dataProvider: "council.sessions", emptyState: "No active sessions." },
  { id: "council-open-deliberations", name: "Open Deliberations", category: "intelligence", dataProvider: "council.deliberations", emptyState: "No open deliberations." },
  { id: "council-consensus-score", name: "Consensus Score", category: "intelligence", dataProvider: "council.consensus", emptyState: "Consensus not measured." },
  { id: "council-minority-opinions", name: "Minority Opinions", category: "intelligence", dataProvider: "council.minority", emptyState: "No minority opinions recorded." },
  { id: "council-executive-participation", name: "Executive Participation", category: "intelligence", dataProvider: "council.participation", emptyState: "No participation data." },
  { id: "council-health", name: "Council Health", category: "health", dataProvider: "council.health", emptyState: "Council health unavailable." },
  { id: "council-trust", name: "Council Trust", category: "intelligence", dataProvider: "council.trust", emptyState: "Trust metrics unavailable." },
  { id: "council-decisions", name: "Council Decisions", category: "intelligence", dataProvider: "council.decisions", emptyState: "No council decisions." },
  { id: "council-founder-overrides", name: "Founder Overrides", category: "intelligence", dataProvider: "council.overrides", emptyState: "No overrides recorded." },
  { id: "council-history", name: "Council History", category: "intelligence", dataProvider: "council.history", emptyState: "No council history." },
  { id: "council-audit", name: "Council Audit", category: "intelligence", dataProvider: "council.audit", emptyState: "No audit records." },
  { id: "council-timeline", name: "Council Timeline", category: "operations", dataProvider: "council.timeline", emptyState: "No council events." },
  { id: "council-metrics", name: "Council Metrics", category: "intelligence", dataProvider: "council.metrics", emptyState: "Metrics unavailable." },
];
