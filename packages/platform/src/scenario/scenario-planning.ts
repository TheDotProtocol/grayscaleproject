/** Scenario Planning — deterministic contracts (Sprint 3 Phase D) */

export const SCENARIO_PLANNING_VERSION = "1.0.0";

export type ScenarioPlanningCaseType =
  | "best_case"
  | "worst_case"
  | "expected_case"
  | "competitive_attack"
  | "founder_absence"
  | "economic_downturn"
  | "rapid_growth"
  | "hiring_expansion"
  | "funding"
  | "product_launch"
  | "market_shift"
  | "black_swan";

export interface ScenarioPlanningCase {
  caseId: string;
  type: ScenarioPlanningCaseType;
  label: string;
  description: string;
  assumptions: string[];
  constraints: string[];
  projectedMetrics: Record<string, number>;
  confidence: number;
  evidence: string[];
}

export interface ScenarioComparison {
  baselineCaseId: string;
  comparedCaseId: string;
  deltas: Record<string, number>;
  preferred: string;
}

export interface ScenarioPlanningSnapshot {
  companyId: string;
  assembledAt: string;
  version: string;
  twinVersionId?: string;
  cases: ScenarioPlanningCase[];
  comparisons: ScenarioComparison[];
  inheritedSources: string[];
}

export interface ScenarioPlanningPort {
  plan(companyId: string, options?: { twinVersionId?: string }): Promise<ScenarioPlanningSnapshot>;
  compare(companyId: string, caseA: string, caseB: string): Promise<ScenarioComparison>;
  listCaseTypes(): ScenarioPlanningCaseType[];
}
