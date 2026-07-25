import type {
  StrategicIntelligenceContext,
  StrategyAnalysisResult,
  PriorityRankingResult,
} from "../intelligence/context.js";
import type { Recommendation } from "../intelligence/recommendations.js";
import type { CompanyOperatingMode } from "../intelligence/types.js";

export interface StrategyEnginePort {
  buildContext(companyId: string): Promise<StrategicIntelligenceContext>;
  analyze(companyId: string): Promise<StrategyAnalysisResult>;
  prioritize(companyId: string): Promise<PriorityRankingResult>;
  evaluateRules(companyId: string): Promise<Recommendation[]>;
  getOperatingMode(companyId: string): Promise<CompanyOperatingMode>;
}

export type {
  StrategicIntelligenceContext,
  StrategyAnalysisResult,
  PriorityRankingResult,
} from "../intelligence/context.js";
