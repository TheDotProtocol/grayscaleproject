/** Mission Control — Executive Network widgets (Sprint 3 Phase D) */

import type { MissionControlWidgetDefinition } from "./widgets.js";

export const EXECUTIVE_NETWORK_WIDGET_IDS = [
  "executive-network",
  "executive-health",
  "executive-trust",
  "executive-contributions",
  "executive-confidence",
  "executive-workload",
  "executive-relationships",
  "executive-dependencies",
  "executive-coverage",
  "council-collaboration",
  "council-consensus",
  "council-replay",
  "organizational-capacity",
  "decision-confidence",
  "decision-evolution",
] as const;

export const EXECUTIVE_NETWORK_WIDGETS: Pick<
  MissionControlWidgetDefinition,
  "id" | "name" | "category" | "dataProvider" | "emptyState"
>[] = [
  { id: "executive-network", name: "Executive Network", category: "intelligence", dataProvider: "network.overview", emptyState: "Network not assembled." },
  { id: "executive-health", name: "Executive Health", category: "health", dataProvider: "network.health", emptyState: "Health unavailable." },
  { id: "executive-trust", name: "Executive Trust", category: "intelligence", dataProvider: "network.trust", emptyState: "Trust data unavailable." },
  { id: "executive-contributions", name: "Executive Contributions", category: "intelligence", dataProvider: "council.participation", emptyState: "No contributions." },
  { id: "executive-confidence", name: "Executive Confidence", category: "intelligence", dataProvider: "council.confidence", emptyState: "No confidence data." },
  { id: "executive-workload", name: "Executive Workload", category: "operations", dataProvider: "network.workload", emptyState: "No workload data." },
  { id: "executive-relationships", name: "Executive Relationships", category: "intelligence", dataProvider: "network.relationships", emptyState: "No relationships." },
  { id: "executive-dependencies", name: "Executive Dependencies", category: "intelligence", dataProvider: "network.dependencies", emptyState: "No dependencies." },
  { id: "executive-coverage", name: "Executive Coverage", category: "intelligence", dataProvider: "network.coverage", emptyState: "No coverage data." },
  { id: "council-collaboration", name: "Council Collaboration", category: "intelligence", dataProvider: "council.collaboration", emptyState: "No collaboration data." },
  { id: "council-consensus", name: "Council Consensus", category: "intelligence", dataProvider: "council.consensus", emptyState: "No consensus data." },
  { id: "council-replay", name: "Council Replay", category: "intelligence", dataProvider: "council.replay", emptyState: "No replay data." },
  { id: "organizational-capacity", name: "Organizational Capacity", category: "intelligence", dataProvider: "twin.capacity", emptyState: "Capacity unavailable." },
  { id: "decision-confidence", name: "Decision Confidence", category: "intelligence", dataProvider: "council.decision-confidence", emptyState: "No decision confidence." },
  { id: "decision-evolution", name: "Decision Evolution", category: "intelligence", dataProvider: "twin.evolution", emptyState: "No evolution data." },
];
