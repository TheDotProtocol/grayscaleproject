/** Organizational Insight Engine — explainable observations, NOT recommendations (ADR-027) */

import type { EngineEvidenceRef } from "../organization/common.js";
import type { OrganizationalSignalType } from "../signals/signal-bus.js";

export const INSIGHT_CATEGORIES = [
  "throughput",
  "momentum",
  "culture",
  "financial",
  "strategic",
  "operational",
  "founder",
  "learning",
  "intent",
  "adaptation",
] as const;

export type InsightCategory = (typeof INSIGHT_CATEGORIES)[number];

export interface OrganizationalInsight {
  id: string;
  companyId: string;
  category: InsightCategory;
  observation: string;
  magnitude?: number;
  period?: string;
  evidence: EngineEvidenceRef[];
  derivedFromSignalIds: string[];
  derivedFromSignalTypes?: OrganizationalSignalType[];
  confidence: number;
  generatedAt: string;
  /** Observations only — never recommendations */
  isRecommendation: false;
}

export interface OrganizationalInsightSnapshot {
  companyId: string;
  assembledAt: string;
  insights: OrganizationalInsight[];
}

export interface OrganizationalInsightEnginePort {
  readonly engineId: "organizational-insight";
  generateFromSignals(companyId: string, signalIds: string[]): Promise<OrganizationalInsight[]>;
  getSnapshot(companyId: string): Promise<OrganizationalInsightSnapshot>;
  record(input: Omit<OrganizationalInsight, "id" | "generatedAt" | "isRecommendation">): Promise<OrganizationalInsight>;
}

export function assertInsightNotRecommendation(insight: OrganizationalInsight): boolean {
  return insight.isRecommendation === false;
}
