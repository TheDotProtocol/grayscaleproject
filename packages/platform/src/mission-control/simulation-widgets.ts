/** Mission Control — Simulation Engine widget contracts (Sprint 3 Phase C) */

import type { MissionControlWidgetDefinition } from "./widgets.js";

export const SIMULATION_MC_WIDGET_IDS = [
  "simulation-timeline",
  "simulation-health",
  "simulation-confidence",
  "twin-comparison-simulation",
  "organizational-stress-simulation",
  "homeostasis-simulation",
  "recovery-simulation",
  "simulation-history",
  "simulation-replay",
  "simulation-audit",
  "simulation-metrics",
  "simulation-certification",
] as const;

export type SimulationMcWidgetId = (typeof SIMULATION_MC_WIDGET_IDS)[number];

export const SIMULATION_WIDGET_DEFINITIONS: Pick<
  MissionControlWidgetDefinition,
  "id" | "name" | "category" | "dataProvider" | "emptyState"
>[] = [
  { id: "simulation-timeline", name: "Simulation Timeline", category: "operations", dataProvider: "simulation.timeline", emptyState: "No simulation timeline." },
  { id: "simulation-health", name: "Simulation Health", category: "health", dataProvider: "simulation.health", emptyState: "Simulation health unavailable." },
  { id: "simulation-confidence", name: "Simulation Confidence", category: "intelligence", dataProvider: "simulation.confidence", emptyState: "Confidence unavailable." },
  { id: "twin-comparison-simulation", name: "Twin Comparison", category: "intelligence", dataProvider: "simulation.twin-comparison", emptyState: "No twin comparison." },
  { id: "organizational-stress-simulation", name: "Organizational Stress", category: "health", dataProvider: "simulation.stress", emptyState: "Stress data unavailable." },
  { id: "homeostasis-simulation", name: "Homeostasis", category: "health", dataProvider: "simulation.homeostasis", emptyState: "Homeostasis unavailable." },
  { id: "recovery-simulation", name: "Recovery", category: "health", dataProvider: "simulation.recovery", emptyState: "Recovery data unavailable." },
  { id: "simulation-history", name: "Simulation History", category: "operations", dataProvider: "simulation.history", emptyState: "No simulation history." },
  { id: "simulation-replay", name: "Simulation Replay", category: "operations", dataProvider: "simulation.replay", emptyState: "No replay data." },
  { id: "simulation-audit", name: "Simulation Audit", category: "operations", dataProvider: "simulation.audit", emptyState: "No audit entries." },
  { id: "simulation-metrics", name: "Simulation Metrics", category: "intelligence", dataProvider: "simulation.metrics", emptyState: "Metrics unavailable." },
  { id: "simulation-certification", name: "Simulation Certification", category: "health", dataProvider: "simulation.certification", emptyState: "Not certified." },
];
