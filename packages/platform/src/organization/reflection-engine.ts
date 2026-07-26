/** Organizational Reflection Engine — observations only, never recommendations (Sprint 4) */

import type { EngineEvidenceRef, VersionedEngineRecord } from "./common.js";

export const REFLECTION_CATEGORIES = [
  "failed_assumptions",
  "forecast_inaccuracy",
  "executive_performance",
  "confidence_calibration",
  "attention_drift",
  "recurring_bottlenecks",
  "organizational_debt",
  "ignored_opportunities",
] as const;

export type ReflectionCategory = (typeof REFLECTION_CATEGORIES)[number];

export interface ReflectionObservation extends VersionedEngineRecord {
  category: ReflectionCategory;
  observation: string;
  evidence: EngineEvidenceRef[];
  confidence: number;
  periodStart: string;
  periodEnd: string;
  correlationId: string;
}

export interface ReflectionMetrics {
  companyId: string;
  totalObservations: number;
  byCategory: Record<string, number>;
  averageConfidence: number;
  computedAt: string;
}

export interface OrganizationalReflectionPort {
  readonly engineId: "organizational-reflection";
  reflect(input: Omit<ReflectionObservation, "id" | "version" | "createdAt" | "updatedAt">): Promise<ReflectionObservation>;
  list(companyId: string, filters?: { category?: ReflectionCategory }): Promise<ReflectionObservation[]>;
  getMetrics(companyId: string): Promise<ReflectionMetrics>;
  runPeriodicReflection(companyId: string): Promise<ReflectionObservation[]>;
}
