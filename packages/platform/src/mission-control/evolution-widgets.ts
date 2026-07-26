/** Mission Control — Organizational Evolution widgets (Sprint 4) */

import type { MissionControlWidgetDefinition } from "./widgets.js";

export const EVOLUTION_WIDGET_IDS = [
  "organizational-evolution",
  "learning-timeline-evolution",
  "wisdom-timeline",
  "reflection-dashboard",
  "reality-vs-learning",
  "forecast-accuracy",
  "simulation-accuracy",
  "autonomy-status",
  "organizational-maturity",
  "organizational-intelligence-summary",
  "institutional-knowledge",
  "evolution-history",
  "learning-health",
  "wisdom-growth",
  "reflection-metrics",
  "autonomy-readiness",
] as const;

export const EVOLUTION_WIDGETS: Pick<
  MissionControlWidgetDefinition,
  "id" | "name" | "category" | "dataProvider" | "emptyState"
>[] = [
  { id: "organizational-evolution", name: "Organizational Evolution", category: "intelligence", dataProvider: "evolution.overview", emptyState: "Evolution data unavailable." },
  { id: "learning-timeline-evolution", name: "Learning Timeline", category: "intelligence", dataProvider: "evolution.learning-timeline", emptyState: "No learning records." },
  { id: "wisdom-timeline", name: "Wisdom Timeline", category: "intelligence", dataProvider: "evolution.wisdom-timeline", emptyState: "No wisdom history." },
  { id: "reflection-dashboard", name: "Reflection Dashboard", category: "intelligence", dataProvider: "evolution.reflection", emptyState: "No reflections recorded." },
  { id: "reality-vs-learning", name: "Reality vs Learning", category: "intelligence", dataProvider: "evolution.reality-learning", emptyState: "No comparisons available." },
  { id: "forecast-accuracy", name: "Forecast Accuracy", category: "intelligence", dataProvider: "evolution.forecast-accuracy", emptyState: "No forecast validations." },
  { id: "simulation-accuracy", name: "Simulation Accuracy", category: "intelligence", dataProvider: "evolution.simulation-accuracy", emptyState: "No simulation comparisons." },
  { id: "autonomy-status", name: "Autonomy Status", category: "operations", dataProvider: "evolution.autonomy-status", emptyState: "Autonomy not configured." },
  { id: "organizational-maturity", name: "Organizational Maturity", category: "intelligence", dataProvider: "evolution.maturity", emptyState: "Maturity not computed." },
  { id: "organizational-intelligence-summary", name: "Organizational Intelligence", category: "intelligence", dataProvider: "evolution.intelligence", emptyState: "Intelligence unavailable." },
  { id: "institutional-knowledge", name: "Institutional Knowledge", category: "intelligence", dataProvider: "evolution.institutional-knowledge", emptyState: "No institutional knowledge." },
  { id: "evolution-history", name: "Evolution History", category: "intelligence", dataProvider: "evolution.history", emptyState: "No evolution history." },
  { id: "learning-health", name: "Learning Health", category: "health", dataProvider: "evolution.learning-health", emptyState: "Learning health unavailable." },
  { id: "wisdom-growth", name: "Wisdom Growth", category: "intelligence", dataProvider: "evolution.wisdom-growth", emptyState: "Wisdom growth unavailable." },
  { id: "reflection-metrics", name: "Reflection Metrics", category: "intelligence", dataProvider: "evolution.reflection-metrics", emptyState: "No reflection metrics." },
  { id: "autonomy-readiness", name: "Autonomy Readiness", category: "health", dataProvider: "evolution.autonomy-readiness", emptyState: "Autonomy readiness unavailable." },
];
