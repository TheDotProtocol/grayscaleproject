/** Reserved Mission Control widgets — Sprint 2 Phase A.2 (ADR-015–022) */

import type { MissionControlWidgetDefinition } from "./widgets.js";

export const ORGANIZATIONAL_INTELLIGENCE_WIDGET_IDS = [
  "organizational-dna",
  "founder-dna",
  "organization-emotion",
  "founder-emotion",
  "organizational-cognitive-profile",
  "learning-timeline",
  "wisdom-library",
  "culture-health",
  "reputation",
  "adaptation-index",
] as const;

export type OrganizationalIntelligenceWidgetId = (typeof ORGANIZATIONAL_INTELLIGENCE_WIDGET_IDS)[number];

export const RESERVED_ORGANIZATIONAL_WIDGETS: Pick<
  MissionControlWidgetDefinition,
  "id" | "name" | "category" | "dataProvider" | "emptyState"
>[] = [
  {
    id: "organizational-dna",
    name: "Organizational DNA",
    category: "intelligence",
    dataProvider: "organizational-dna.summary",
    emptyState: "Organizational DNA not defined.",
  },
  {
    id: "founder-dna",
    name: "Founder DNA",
    category: "intelligence",
    dataProvider: "founder-dna.profile",
    emptyState: "Founder DNA not yet observed.",
  },
  {
    id: "organization-emotion",
    name: "Organization Emotion",
    category: "intelligence",
    dataProvider: "organizational-emotion.snapshot",
    emptyState: "No organizational emotional observations.",
  },
  {
    id: "founder-emotion",
    name: "Founder Emotion",
    category: "intelligence",
    dataProvider: "organizational-emotion.founder",
    emptyState: "No founder emotional observations.",
  },
  {
    id: "organizational-cognitive-profile",
    name: "Organizational Cognitive Profile",
    category: "intelligence",
    dataProvider: "organizational-cognitive.profile",
    emptyState: "Organizational cognitive profile not established.",
  },
  {
    id: "learning-timeline",
    name: "Learning Timeline",
    category: "intelligence",
    dataProvider: "organizational-learning.timeline",
    emptyState: "No lessons captured yet.",
  },
  {
    id: "wisdom-library",
    name: "Wisdom Library",
    category: "intelligence",
    dataProvider: "organizational-wisdom.library",
    emptyState: "No approved wisdom principles.",
  },
  {
    id: "culture-health",
    name: "Culture Health",
    category: "intelligence",
    dataProvider: "organizational-culture.snapshot",
    emptyState: "Culture metrics unavailable.",
  },
  {
    id: "reputation",
    name: "Reputation",
    category: "intelligence",
    dataProvider: "organizational-reputation.snapshot",
    emptyState: "No reputation signals recorded.",
  },
  {
    id: "adaptation-index",
    name: "Adaptation Index",
    category: "intelligence",
    dataProvider: "organizational-adaptation.index",
    emptyState: "Adaptation metrics unavailable.",
  },
];
