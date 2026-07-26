/** Mission Control — Attention Budget widget contracts (Sprint 4 Phase C) */

import type { MissionControlWidgetDefinition } from "../mission-control/widgets.js";

export const ATTENTION_BUDGET_WIDGET_IDS = [
  "organization-attention-budget",
  "executive-attention-allocation",
  "attention-debt",
  "context-switching",
  "focus-heatmap",
  "strategic-attention",
  "operational-attention",
  "innovation-attention",
  "founder-attention",
  "attention-capacity",
  "attention-recovery",
  "attention-trends",
  "executive-attention-consumers",
  "attention-explainability",
] as const;

export const ATTENTION_BUDGET_WIDGET_DEFINITIONS: Pick<
  MissionControlWidgetDefinition,
  "id" | "name" | "category" | "dataProvider" | "emptyState"
>[] = [
  { id: "organization-attention-budget", name: "Organization Attention Budget", category: "intelligence", dataProvider: "attention-budget.overview", emptyState: "Attention budget unavailable." },
  { id: "executive-attention-allocation", name: "Executive Attention Allocation", category: "intelligence", dataProvider: "attention-budget.allocation", emptyState: "No allocation data." },
  { id: "attention-debt", name: "Attention Debt", category: "health", dataProvider: "attention-budget.debt", emptyState: "No debt data." },
  { id: "context-switching", name: "Context Switching", category: "health", dataProvider: "attention-budget.context-switching", emptyState: "No context switching data." },
  { id: "focus-heatmap", name: "Focus Heatmap", category: "intelligence", dataProvider: "attention-budget.focus-heatmap", emptyState: "No focus data." },
  { id: "strategic-attention", name: "Strategic Attention", category: "intelligence", dataProvider: "attention-budget.strategic", emptyState: "No strategic attention data." },
  { id: "operational-attention", name: "Operational Attention", category: "intelligence", dataProvider: "attention-budget.operational", emptyState: "No operational attention data." },
  { id: "innovation-attention", name: "Innovation Attention", category: "intelligence", dataProvider: "attention-budget.innovation", emptyState: "No innovation attention data." },
  { id: "founder-attention", name: "Founder Attention", category: "intelligence", dataProvider: "attention-budget.founder", emptyState: "No founder attention data." },
  { id: "attention-capacity", name: "Attention Capacity", category: "health", dataProvider: "attention-budget.capacity", emptyState: "Capacity unavailable." },
  { id: "attention-recovery", name: "Attention Recovery", category: "health", dataProvider: "attention-budget.recovery", emptyState: "Recovery data unavailable." },
  { id: "attention-trends", name: "Attention Trends", category: "intelligence", dataProvider: "attention-budget.trends", emptyState: "No trend data." },
  { id: "executive-attention-consumers", name: "Executive Attention Consumers", category: "intelligence", dataProvider: "attention-budget.consumers", emptyState: "No consumer data." },
  { id: "attention-explainability", name: "Attention Explainability", category: "operations", dataProvider: "attention-budget.explainability", emptyState: "No explainability records." },
];
