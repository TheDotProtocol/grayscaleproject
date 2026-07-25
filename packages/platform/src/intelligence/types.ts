/** Intelligence engine registration — AIP-10 dynamic discovery */

export const INTELLIGENCE_ENGINE_IDS = [
  "goals",
  "objectives",
  "priority",
  "recommendations",
  "decisions",
  "risks",
  "opportunities",
  "dependencies",
] as const;

export type IntelligenceEngineId = (typeof INTELLIGENCE_ENGINE_IDS)[number];

/** Provider-agnostic intelligence engine contract */
export interface IntelligenceEngine {
  readonly id: string;
  readonly name: string;
  readonly version: number;
  /** Contribution to StrategicIntelligenceContext assembly */
  contribute(companyId: string): Promise<IntelligenceEngineContribution>;
}

export interface IntelligenceEngineContribution {
  engineId: string;
  data: Record<string, unknown>;
  computedAt: string;
}

export interface IntelligenceEngineRegistry {
  register(engine: IntelligenceEngine): void;
  unregister(engineId: string): void;
  list(): IntelligenceEngine[];
  get(engineId: string): IntelligenceEngine | undefined;
}

export const COMPANY_OPERATING_MODES = [
  "startup",
  "growth",
  "enterprise",
  "emergency",
  "cash_conservation",
  "launch",
  "recovery",
  "stealth",
] as const;

export type CompanyOperatingMode = (typeof COMPANY_OPERATING_MODES)[number];

export interface CompanyOperatingModeConfig {
  companyId: string;
  mode: CompanyOperatingMode;
  effectiveFrom: string;
  metadata?: Record<string, unknown>;
}

export interface DecisionPolicy {
  id: string;
  companyId: string;
  name: string;
  category: PolicyCategory;
  rules: PolicyRule[];
  isActive: boolean;
  createdAt: string;
}

export type PolicyCategory =
  | "approval"
  | "security"
  | "financial"
  | "release"
  | "hiring"
  | "legal";

export interface PolicyRule {
  id: string;
  condition: string;
  action: string;
  severity: "info" | "warning" | "blocking";
}

export interface StrategicConstraint {
  id: string;
  companyId: string;
  type: ConstraintType;
  limit: number;
  unit: string;
  currentUsage: number;
  isHard: boolean;
}

export type ConstraintType =
  | "budget"
  | "cash_runway"
  | "founder_availability"
  | "engineering_capacity"
  | "infrastructure"
  | "legal"
  | "time"
  | "market_deadline";

export interface ScenarioPlan {
  id: string;
  companyId: string;
  name: string;
  case: "best" | "expected" | "worst";
  assumptions: Record<string, unknown>;
  outcomes: Record<string, unknown>;
  linkedRecommendationIds: string[];
}

export interface TradeOffAnalysis {
  benefits: string[];
  costs: string[];
  opportunityCost?: string;
  hiddenCost?: string;
  longTermImpact?: string;
}

export interface ConfidenceSource {
  type:
    | "historical_performance"
    | "graph_evidence"
    | "memory_reference"
    | "rule_evaluation"
    | "market_intelligence"
    | "founder_preference";
  refId?: string;
  summary: string;
  weight: number;
}

export interface PriorityWeights {
  businessValue: number;
  founderPriority: number;
  revenueImpact: number;
  risk: number;
  dependency: number;
  timeSensitivity: number;
  engineeringCost: number;
}

export type PriorityConfigScope = "company" | "department" | "executive" | "founder";

export interface PriorityConfig {
  id: string;
  companyId: string;
  scope: PriorityConfigScope;
  scopeRef?: string;
  weights: PriorityWeights;
  operatingMode?: CompanyOperatingMode;
  createdBy: string;
  createdAt: string;
}

export interface PriorityReasoning {
  summary: string;
  factors: { name: string; value: number; weight: number; contribution: number }[];
  configScope: PriorityConfigScope;
  configId: string;
}

export interface PriorityScore {
  id: string;
  companyId: string;
  entityType: string;
  entityId: string;
  score: number;
  rank?: number;
  reasoning: PriorityReasoning;
  computedAt: string;
}

export interface PriorityInput {
  entityType: string;
  entityId: string;
  businessValue: number;
  founderPriority: number;
  revenueImpact: number;
  riskScore: number;
  dependencyBlockers: number;
  timeSensitivity: number;
  engineeringCost: number;
}

export * from "./goals.js";
export * from "./recommendations.js";
export * from "./learning.js";
