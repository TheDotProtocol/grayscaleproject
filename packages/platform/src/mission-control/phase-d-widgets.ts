/** Mission Control — Phase D Foresight & Forecast widget contracts */

import type { MissionControlWidgetDefinition } from "./widgets.js";

export const PHASE_D_MC_WIDGET_IDS = [
  "organizational-foresight",
  "forecast-dashboard",
  "scenario-library-extended",
  "scenario-comparison",
  "decision-economy",
  "organizational-alignment",
  "organizational-antifragility",
  "strategic-drift",
  "weak-signals-foresight",
  "opportunity-radar",
  "future-timeline",
  "forecast-confidence",
] as const;

export const PHASE_D_WIDGET_DEFINITIONS: Pick<
  MissionControlWidgetDefinition,
  "id" | "name" | "category" | "dataProvider" | "emptyState"
>[] = [
  { id: "organizational-foresight", name: "Organizational Foresight", category: "intelligence", dataProvider: "foresight.overview", emptyState: "Foresight unavailable." },
  { id: "scenario-library-extended", name: "Scenario Library", category: "intelligence", dataProvider: "scenario.planning", emptyState: "No scenarios planned." },
  { id: "scenario-comparison", name: "Scenario Comparison", category: "intelligence", dataProvider: "scenario.comparison", emptyState: "No comparisons." },
  { id: "decision-economy", name: "Decision Economy", category: "intelligence", dataProvider: "decision-economy.overview", emptyState: "Decision economy unavailable." },
  { id: "organizational-alignment", name: "Alignment", category: "intelligence", dataProvider: "alignment.overview", emptyState: "Alignment unavailable." },
  { id: "organizational-antifragility", name: "Antifragility", category: "health", dataProvider: "antifragility.overview", emptyState: "Antifragility unavailable." },
  { id: "strategic-drift", name: "Strategic Drift", category: "intelligence", dataProvider: "foresight.strategic-drift", emptyState: "No drift data." },
  { id: "weak-signals-foresight", name: "Weak Signals", category: "intelligence", dataProvider: "foresight.weak-signals", emptyState: "No weak signals." },
  { id: "opportunity-radar", name: "Opportunity Radar", category: "intelligence", dataProvider: "foresight.opportunities", emptyState: "No opportunities detected." },
  { id: "future-timeline", name: "Future Timeline", category: "operations", dataProvider: "forecast.timeline", emptyState: "No future timeline." },
  { id: "forecast-confidence", name: "Forecast Confidence", category: "intelligence", dataProvider: "forecast.confidence", emptyState: "Confidence unavailable." },
];
