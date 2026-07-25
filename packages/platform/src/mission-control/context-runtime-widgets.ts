/** Reserved Mission Control widgets — Sprint 2 Phase A.4 (ADR-023–027) */

import type { MissionControlWidgetDefinition } from "./widgets.js";

export const CONTEXT_RUNTIME_WIDGET_IDS = [
  "intent-hierarchy",
  "intent-coverage",
  "organizational-timeline",
  "organizational-evolution",
  "context-health",
  "signal-feed",
  "organizational-insights",
  "historical-comparisons",
  "snapshot-explorer",
] as const;

export type ContextRuntimeWidgetId = (typeof CONTEXT_RUNTIME_WIDGET_IDS)[number];

export const RESERVED_CONTEXT_RUNTIME_WIDGETS: Pick<
  MissionControlWidgetDefinition,
  "id" | "name" | "category" | "dataProvider" | "emptyState"
>[] = [
  { id: "intent-hierarchy", name: "Intent Hierarchy", category: "intelligence", dataProvider: "intent.hierarchy", emptyState: "No intent hierarchy defined." },
  { id: "intent-coverage", name: "Intent Coverage", category: "intelligence", dataProvider: "intent.coverage", emptyState: "Intent coverage not computed." },
  { id: "organizational-timeline", name: "Organizational Timeline", category: "intelligence", dataProvider: "temporal.timeline", emptyState: "No timeline data." },
  { id: "organizational-evolution", name: "Organizational Evolution", category: "intelligence", dataProvider: "temporal.evolution", emptyState: "Evolution index unavailable." },
  { id: "context-health", name: "Context Health", category: "health", dataProvider: "context-runtime.health", emptyState: "Context assembly health unknown." },
  { id: "signal-feed", name: "Signal Feed", category: "intelligence", dataProvider: "signals.feed", emptyState: "No active signals." },
  { id: "organizational-insights", name: "Organizational Insights", category: "intelligence", dataProvider: "insights.snapshot", emptyState: "No observations generated." },
  { id: "historical-comparisons", name: "Historical Comparisons", category: "intelligence", dataProvider: "temporal.comparisons", emptyState: "No historical comparisons." },
  { id: "snapshot-explorer", name: "Snapshot Explorer", category: "intelligence", dataProvider: "snapshots.explorer", emptyState: "No snapshots captured." },
];
