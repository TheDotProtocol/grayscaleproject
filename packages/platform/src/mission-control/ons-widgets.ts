/** Mission Control — Organizational Nervous System widget contracts (Sprint 3 Phase B) */

import type { MissionControlWidgetDefinition } from "./widgets.js";

export const ONS_MC_WIDGET_IDS = [
  "organizational-twin-overview",
  "attention-heatmap",
  "signal-correlation",
  "organizational-awareness",
  "attention-budget",
  "attention-saturation",
  "organizational-blind-spots",
  "critical-signals",
  "weak-signals",
  "emerging-patterns",
  "twin-evolution-summary",
  "twin-confidence",
  "twin-integrity-summary",
  "attention-history",
  "attention-timeline",
  "homeostasis-equilibrium",
  "organizational-stress",
] as const;

export type OnsMcWidgetId = (typeof ONS_MC_WIDGET_IDS)[number];

export const ONS_WIDGET_DEFINITIONS: Pick<
  MissionControlWidgetDefinition,
  "id" | "name" | "category" | "dataProvider" | "emptyState"
>[] = [
  { id: "organizational-twin-overview", name: "Organizational Twin", category: "intelligence", dataProvider: "twin.overview", emptyState: "Twin not assembled." },
  { id: "attention-heatmap", name: "Attention Heatmap", category: "intelligence", dataProvider: "attention.heatmap", emptyState: "Attention data unavailable." },
  { id: "signal-correlation", name: "Signal Correlation", category: "intelligence", dataProvider: "signals.correlation", emptyState: "No correlated signals." },
  { id: "organizational-awareness", name: "Organizational Awareness", category: "intelligence", dataProvider: "ons.awareness", emptyState: "Awareness unavailable." },
  { id: "attention-budget", name: "Attention Budget", category: "intelligence", dataProvider: "attention.budget", emptyState: "Budget unavailable." },
  { id: "attention-saturation", name: "Attention Saturation", category: "health", dataProvider: "attention.saturation", emptyState: "Saturation unavailable." },
  { id: "organizational-blind-spots", name: "Blind Spots", category: "intelligence", dataProvider: "ons.blind-spots", emptyState: "No blind spots detected." },
  { id: "critical-signals", name: "Critical Signals", category: "intelligence", dataProvider: "signals.critical", emptyState: "No critical signals." },
  { id: "weak-signals", name: "Weak Signals", category: "intelligence", dataProvider: "signals.weak", emptyState: "No weak signals." },
  { id: "emerging-patterns", name: "Emerging Patterns", category: "intelligence", dataProvider: "signals.emerging", emptyState: "No emerging patterns." },
  { id: "twin-evolution-summary", name: "Twin Evolution", category: "intelligence", dataProvider: "twin.evolution", emptyState: "No evolution data." },
  { id: "twin-confidence", name: "Twin Confidence", category: "intelligence", dataProvider: "twin.confidence", emptyState: "Confidence unavailable." },
  { id: "twin-integrity-summary", name: "Twin Integrity", category: "health", dataProvider: "twin.integrity", emptyState: "Integrity unavailable." },
  { id: "attention-history", name: "Attention History", category: "operations", dataProvider: "attention.history", emptyState: "No attention history." },
  { id: "attention-timeline", name: "Attention Timeline", category: "operations", dataProvider: "attention.timeline", emptyState: "No timeline entries." },
  { id: "homeostasis-equilibrium", name: "Equilibrium Index", category: "health", dataProvider: "homeostasis.equilibrium", emptyState: "Homeostasis unavailable." },
  { id: "organizational-stress", name: "Stress Index", category: "health", dataProvider: "homeostasis.stress", emptyState: "Stress data unavailable." },
];
