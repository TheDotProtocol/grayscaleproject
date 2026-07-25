/** Reserved Mission Control widgets — Sprint 2 Phase A.1 (ADR-014)
 *  Contracts only — implementations deferred to Phase A.2+
 */

import type { MissionControlWidgetDefinition } from "./widgets.js";

export const EXECUTIVE_DISCOVERY_WIDGET_IDS = [
  "identity-profile",
  "executive-cognitive-profile",
  "executive-trust",
  "discovery-progress",
  "recommendation-readiness",
  "executive-experience",
  "executive-council",
  "recommendation-trace",
  "confidence-timeline",
  "learning-progress",
] as const;

export type ExecutiveDiscoveryWidgetId = (typeof EXECUTIVE_DISCOVERY_WIDGET_IDS)[number];

/** Stub definitions — registered for catalog discovery; data providers not implemented in A.1 */
export const RESERVED_EXECUTIVE_WIDGETS: Pick<
  MissionControlWidgetDefinition,
  "id" | "name" | "category" | "dataProvider" | "emptyState"
>[] = [
  {
    id: "identity-profile",
    name: "Identity Profile",
    category: "intelligence",
    dataProvider: "identity-engine.profile",
    emptyState: "Operator identity not configured.",
  },
  {
    id: "executive-cognitive-profile",
    name: "Executive Cognitive Profile",
    category: "intelligence",
    dataProvider: "cognitive-model.profile",
    emptyState: "No evidence-derived cognitive profile yet.",
  },
  {
    id: "executive-trust",
    name: "Executive Trust",
    category: "intelligence",
    dataProvider: "trust-engine.metrics",
    emptyState: "Trust metrics unavailable.",
  },
  {
    id: "discovery-progress",
    name: "Discovery Progress",
    category: "intelligence",
    dataProvider: "discovery-engine.snapshot",
    emptyState: "Discovery not started.",
  },
  {
    id: "recommendation-readiness",
    name: "Recommendation Readiness",
    category: "intelligence",
    dataProvider: "discovery-engine.eligibility",
    emptyState: "Eligibility not evaluated.",
  },
  {
    id: "executive-experience",
    name: "Executive Experience",
    category: "intelligence",
    dataProvider: "experience-memory.summary",
    emptyState: "No lessons learned recorded.",
  },
  {
    id: "executive-council",
    name: "Executive Council",
    category: "intelligence",
    dataProvider: "executive-council.feed",
    emptyState: "No council activity.",
  },
  {
    id: "recommendation-trace",
    name: "Recommendation Trace",
    category: "intelligence",
    dataProvider: "recommendation-lifecycle.trace",
    emptyState: "No recommendation trace available.",
  },
  {
    id: "confidence-timeline",
    name: "Confidence Timeline",
    category: "intelligence",
    dataProvider: "trust-engine.confidence-history",
    emptyState: "No confidence history.",
  },
  {
    id: "learning-progress",
    name: "Learning Progress",
    category: "intelligence",
    dataProvider: "cognitive-model.learning-progress",
    emptyState: "No ECM evidence growth yet.",
  },
];
