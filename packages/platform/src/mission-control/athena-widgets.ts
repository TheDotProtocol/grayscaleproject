/** Athena Mission Control widget stubs — Sprint 2 completion */

import type { MissionControlWidgetDefinition } from "./widgets.js";

export const ATHENA_MC_WIDGET_IDS = [
  "athena-status",
  "athena-discovery-progress",
  "athena-trust-score",
  "athena-certification-progress",
  "athena-notebook-activity",
  "athena-curiosity-investigations",
  "athena-skeptic-challenges",
  "athena-executive-health",
  "athena-explainability",
  "athena-recommendation-lifecycle",
  "athena-constitution-compliance",
  "athena-automation-readiness",
  "athena-founder-overrides",
] as const;

export type AthenaMcWidgetId = (typeof ATHENA_MC_WIDGET_IDS)[number];

export const RESERVED_ATHENA_MC_WIDGETS: Pick<
  MissionControlWidgetDefinition,
  "id" | "name" | "category" | "dataProvider" | "emptyState"
>[] = [
  { id: "athena-status", name: "Athena Status", category: "intelligence", dataProvider: "athena.status", emptyState: "Athena not initialized." },
  { id: "athena-discovery-progress", name: "Discovery Progress", category: "intelligence", dataProvider: "athena.discovery", emptyState: "Discovery not started." },
  { id: "athena-trust-score", name: "Trust Score", category: "intelligence", dataProvider: "athena.trust", emptyState: "Trust metrics unavailable." },
  { id: "athena-certification-progress", name: "Certification Progress", category: "intelligence", dataProvider: "athena.certification", emptyState: "Certification not run." },
  { id: "athena-notebook-activity", name: "Notebook Activity", category: "intelligence", dataProvider: "athena.notebook", emptyState: "No notebook entries." },
  { id: "athena-curiosity-investigations", name: "Curiosity Investigations", category: "intelligence", dataProvider: "athena.curiosity", emptyState: "No investigations." },
  { id: "athena-skeptic-challenges", name: "Skeptic Challenges", category: "intelligence", dataProvider: "athena.skeptic", emptyState: "No skeptic passes." },
  { id: "athena-executive-health", name: "Executive Health", category: "health", dataProvider: "athena.health", emptyState: "Health unavailable." },
  { id: "athena-explainability", name: "Explainability", category: "intelligence", dataProvider: "athena.explainability", emptyState: "No recommendation traces." },
  { id: "athena-recommendation-lifecycle", name: "Recommendation Lifecycle", category: "intelligence", dataProvider: "athena.lifecycle", emptyState: "No recommendations." },
  { id: "athena-constitution-compliance", name: "Constitution Compliance", category: "intelligence", dataProvider: "athena.constitution", emptyState: "Compliance not evaluated." },
  { id: "athena-automation-readiness", name: "Automation Readiness", category: "intelligence", dataProvider: "athena.automation", emptyState: "Automation not configured." },
  { id: "athena-founder-overrides", name: "Founder Overrides", category: "intelligence", dataProvider: "athena.overrides", emptyState: "No overrides recorded." },
];
