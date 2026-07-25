/** Company Readiness Framework — AIP-31 */

export const READINESS_DIMENSIONS = [
  "engineering",
  "operations",
  "finance",
  "security",
  "marketing",
  "growth",
  "infrastructure",
  "hiring",
  "product",
  "legal",
  "platform",
  "customer_success",
  "ai_readiness",
  "innovation",
] as const;

export type ReadinessDimensionId = (typeof READINESS_DIMENSIONS)[number];

export const READINESS_STATUSES = ["ready", "developing", "at_risk", "unknown"] as const;
export type ReadinessStatus = (typeof READINESS_STATUSES)[number];

export interface ReadinessSignal {
  id: string;
  label: string;
  value: number | string | boolean;
  weight: number;
}

export interface ReadinessDimension {
  id: ReadinessDimensionId;
  name: string;
  score: number;
  status: ReadinessStatus;
  signals: ReadinessSignal[];
}

export interface CompanyReadinessSnapshot {
  companyId: string;
  overallScore: number;
  dimensions: ReadinessDimension[];
  dataCompleteness: number;
  computedAt: string;
}

export interface ReadinessScoringPort {
  compute(companyId: string): Promise<CompanyReadinessSnapshot>;
}
