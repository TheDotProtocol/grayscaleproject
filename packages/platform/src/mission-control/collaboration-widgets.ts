/** Mission Control — Executive Collaboration widget contracts (Sprint 4 Phase B) */

import type { MissionControlWidgetDefinition } from "./widgets.js";

export const COLLABORATION_MC_WIDGET_IDS = [
  "council-sessions-v2",
  "active-deliberations",
  "consensus-score-v2",
  "executive-participation-v2",
  "executive-trust-v2",
  "open-challenges",
  "evidence-flow",
  "council-timeline-v2",
  "minority-opinions-v2",
  "decision-queue-v2",
  "founder-reviews",
  "council-health-v2",
  "collaboration-heatmap",
  "executive-network-v2",
  "executive-availability",
] as const;

export const COLLABORATION_WIDGET_DEFINITIONS: Pick<
  MissionControlWidgetDefinition,
  "id" | "name" | "category" | "dataProvider" | "emptyState"
>[] = [
  { id: "council-sessions-v2", name: "Council Sessions", category: "intelligence", dataProvider: "collaboration.sessions", emptyState: "No council sessions." },
  { id: "active-deliberations", name: "Active Deliberations", category: "intelligence", dataProvider: "collaboration.deliberations", emptyState: "No active deliberations." },
  { id: "consensus-score-v2", name: "Consensus Score", category: "intelligence", dataProvider: "collaboration.consensus", emptyState: "Consensus not measured." },
  { id: "executive-participation-v2", name: "Executive Participation", category: "intelligence", dataProvider: "collaboration.participation", emptyState: "No participation data." },
  { id: "executive-trust-v2", name: "Executive Trust", category: "intelligence", dataProvider: "collaboration.trust", emptyState: "Trust metrics unavailable." },
  { id: "open-challenges", name: "Open Challenges", category: "intelligence", dataProvider: "collaboration.challenges", emptyState: "No open challenges." },
  { id: "evidence-flow", name: "Evidence Flow", category: "intelligence", dataProvider: "collaboration.evidence-flow", emptyState: "No evidence flow." },
  { id: "council-timeline-v2", name: "Council Timeline", category: "operations", dataProvider: "collaboration.timeline", emptyState: "No council events." },
  { id: "minority-opinions-v2", name: "Minority Opinions", category: "intelligence", dataProvider: "collaboration.minority", emptyState: "No minority opinions." },
  { id: "decision-queue-v2", name: "Decision Queue", category: "intelligence", dataProvider: "collaboration.decision-queue", emptyState: "No pending decisions." },
  { id: "founder-reviews", name: "Founder Reviews", category: "intelligence", dataProvider: "collaboration.founder-reviews", emptyState: "No founder reviews pending." },
  { id: "council-health-v2", name: "Council Health", category: "health", dataProvider: "collaboration.health", emptyState: "Council health unavailable." },
  { id: "collaboration-heatmap", name: "Collaboration Heatmap", category: "intelligence", dataProvider: "collaboration.heatmap", emptyState: "No collaboration data." },
  { id: "executive-network-v2", name: "Executive Network", category: "intelligence", dataProvider: "collaboration.network", emptyState: "Network not assembled." },
  { id: "executive-availability", name: "Executive Availability", category: "operations", dataProvider: "collaboration.availability", emptyState: "Availability unknown." },
];
