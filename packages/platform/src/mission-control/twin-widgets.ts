/** Mission Control — Living Organizational Twin widget contracts (Sprint 3 Phase C) */

import type { MissionControlWidgetDefinition } from "./widgets.js";

export const TWIN_MC_WIDGET_IDS = [
  "living-organizational-twin",
  "twin-timeline",
  "twin-evolution",
  "twin-health",
  "twin-state",
  "simulation-queue",
  "simulation-results",
  "scenario-library",
  "forecast-dashboard",
  "reality-vs-forecast",
  "twin-replay",
  "twin-metrics",
  "twin-integrity",
  "twin-synchronization",
  "twin-learning",
] as const;

export type TwinMcWidgetId = (typeof TWIN_MC_WIDGET_IDS)[number];

export const TWIN_WIDGET_DEFINITIONS: Pick<
  MissionControlWidgetDefinition,
  "id" | "name" | "category" | "dataProvider" | "emptyState"
>[] = [
  { id: "living-organizational-twin", name: "Living Organizational Twin", category: "intelligence", dataProvider: "twin.overview", emptyState: "Twin not assembled." },
  { id: "twin-timeline", name: "Twin Timeline", category: "operations", dataProvider: "twin.timeline", emptyState: "No timeline entries." },
  { id: "twin-evolution", name: "Twin Evolution", category: "intelligence", dataProvider: "twin.evolution", emptyState: "No evolution data." },
  { id: "twin-health", name: "Twin Health", category: "health", dataProvider: "twin.health", emptyState: "Twin health unavailable." },
  { id: "twin-state", name: "Twin State", category: "intelligence", dataProvider: "twin.state", emptyState: "No twin state." },
  { id: "simulation-queue", name: "Simulation Queue", category: "intelligence", dataProvider: "simulation.queue", emptyState: "No simulations queued." },
  { id: "simulation-results", name: "Simulation Results", category: "intelligence", dataProvider: "simulation.results", emptyState: "No simulation results." },
  { id: "scenario-library", name: "Scenario Library", category: "intelligence", dataProvider: "simulation.scenarios", emptyState: "No scenarios defined." },
  { id: "forecast-dashboard", name: "Forecast Dashboard", category: "intelligence", dataProvider: "forecast.dashboard", emptyState: "No forecasts generated." },
  { id: "reality-vs-forecast", name: "Reality vs Forecast", category: "intelligence", dataProvider: "forecast.reality-comparison", emptyState: "No comparisons available." },
  { id: "twin-replay", name: "Twin Replay", category: "intelligence", dataProvider: "twin.replay", emptyState: "No replay data." },
  { id: "twin-metrics", name: "Twin Metrics", category: "intelligence", dataProvider: "twin.metrics", emptyState: "Metrics unavailable." },
  { id: "twin-integrity", name: "Twin Integrity", category: "health", dataProvider: "twin.integrity", emptyState: "Integrity check unavailable." },
  { id: "twin-synchronization", name: "Twin Synchronization", category: "health", dataProvider: "twin.synchronization", emptyState: "Sync status unavailable." },
  { id: "twin-learning", name: "Twin Learning", category: "intelligence", dataProvider: "twin.learning", emptyState: "No learning entries." },
];
