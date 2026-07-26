/** Mission Control — Organizational Runtime widget contracts (Sprint 4 Phase A) */

import type { MissionControlWidgetDefinition } from "../mission-control/widgets.js";

export const RUNTIME_MC_WIDGET_IDS = [
  "organizational-runtime",
  "runtime-heartbeat",
  "runtime-scheduler",
  "runtime-health",
  "runtime-capacity",
  "runtime-queue",
  "runtime-audit",
  "runtime-activity",
  "runtime-timeline",
  "background-jobs",
  "runtime-resource-usage",
  "executive-scheduler",
  "council-scheduler",
  "twin-runtime-status",
  "simulation-runtime-status",
  "forecast-runtime-status",
  "context-runtime-status",
  "memory-runtime-status",
  "graph-runtime-status",
] as const;

export const RUNTIME_WIDGET_DEFINITIONS: Pick<
  MissionControlWidgetDefinition,
  "id" | "name" | "category" | "dataProvider" | "emptyState"
>[] = [
  { id: "organizational-runtime", name: "Organizational Runtime", category: "operations", dataProvider: "runtime.overview", emptyState: "Runtime unavailable." },
  { id: "runtime-heartbeat", name: "Runtime Heartbeat", category: "health", dataProvider: "runtime.heartbeat", emptyState: "No heartbeat data." },
  { id: "runtime-scheduler", name: "Runtime Scheduler", category: "operations", dataProvider: "runtime.scheduler", emptyState: "Scheduler unavailable." },
  { id: "runtime-health", name: "Runtime Health", category: "health", dataProvider: "runtime.health", emptyState: "Health unavailable." },
  { id: "runtime-capacity", name: "Runtime Capacity", category: "health", dataProvider: "runtime.capacity", emptyState: "Capacity unavailable." },
  { id: "runtime-queue", name: "Runtime Queue", category: "operations", dataProvider: "runtime.queue", emptyState: "Queue empty." },
  { id: "runtime-audit", name: "Runtime Audit", category: "operations", dataProvider: "runtime.audit", emptyState: "No audit entries." },
  { id: "runtime-activity", name: "Runtime Activity", category: "operations", dataProvider: "runtime.activity", emptyState: "No activity." },
  { id: "runtime-timeline", name: "Runtime Timeline", category: "operations", dataProvider: "runtime.timeline", emptyState: "No timeline." },
  { id: "background-jobs", name: "Background Jobs", category: "operations", dataProvider: "runtime.background-jobs", emptyState: "No background jobs." },
  { id: "runtime-resource-usage", name: "Runtime Resource Usage", category: "health", dataProvider: "runtime.resources", emptyState: "Resource data unavailable." },
  { id: "executive-scheduler", name: "Executive Scheduler", category: "operations", dataProvider: "runtime.executive-scheduler", emptyState: "Executive scheduler unavailable." },
  { id: "council-scheduler", name: "Council Scheduler", category: "operations", dataProvider: "runtime.council-scheduler", emptyState: "Council scheduler unavailable." },
  { id: "twin-runtime-status", name: "Twin Runtime", category: "operations", dataProvider: "runtime.twin", emptyState: "Twin runtime unavailable." },
  { id: "simulation-runtime-status", name: "Simulation Runtime", category: "operations", dataProvider: "runtime.simulation", emptyState: "Simulation runtime unavailable." },
  { id: "forecast-runtime-status", name: "Forecast Runtime", category: "operations", dataProvider: "runtime.forecast", emptyState: "Forecast runtime unavailable." },
  { id: "context-runtime-status", name: "Context Runtime", category: "operations", dataProvider: "runtime.context", emptyState: "Context runtime unavailable." },
  { id: "memory-runtime-status", name: "Memory Runtime", category: "operations", dataProvider: "runtime.memory", emptyState: "Memory runtime unavailable." },
  { id: "graph-runtime-status", name: "Graph Runtime", category: "operations", dataProvider: "runtime.graph", emptyState: "Graph runtime unavailable." },
];
