import type { TradeOffAnalysis, ConfidenceSource } from "./types.js";

export type RecommendationSource =
  | "system"
  | "plugin"
  | "founder"
  | "executive"
  | "rule";

export type RecommendationStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "amended"
  | "implemented"
  | "superseded";

export type ConfidenceBand = "verified" | "high" | "medium" | "low" | "unknown";

export type RiskCategory =
  | "technical"
  | "financial"
  | "operational"
  | "security"
  | "legal"
  | "delivery"
  | "reputation";

export type OpportunityCategory =
  | "cost_saving"
  | "revenue"
  | "automation"
  | "growth"
  | "technical_improvement"
  | "operational_improvement";

export interface RecommendationEvidence {
  id: string;
  type: "memory" | "event" | "graph" | "metric" | "document";
  refId: string;
  summary: string;
  weight: number;
}

export interface RecommendationAlternative {
  id: string;
  title: string;
  summary: string;
  tradeoffs: string;
  estimatedCostCents?: number;
}

export interface Recommendation {
  id: string;
  companyId: string;
  title: string;
  summary: string;
  reasoning: string;
  evidence: RecommendationEvidence[];
  alternatives: RecommendationAlternative[];
  confidenceSources: ConfidenceSource[];
  tradeOff: TradeOffAnalysis;
  dependencies: string[];
  riskAssessmentIds: string[];
  estimatedCostCents?: number;
  engineeringCost?: number;
  estimatedRoi?: string;
  confidence: number;
  confidenceBand: ConfidenceBand;
  priorityScoreId?: string;
  department?: string;
  source: RecommendationSource;
  sourceRef?: string;
  requiresApproval: boolean;
  status: RecommendationStatus;
  expectedOutcome?: string;
  expectedTimeline?: string;
  rollbackStrategy?: string;
  graphNodeId?: string;
  memoryRecordIds: string[];
  scenarioIds: string[];
  policyViolations: string[];
  constraintViolations: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type DecisionStatus =
  | "proposed"
  | "approved"
  | "implemented"
  | "reviewed"
  | "reversed";

export type ImplementationState =
  | "not_started"
  | "in_progress"
  | "completed"
  | "failed";

export interface DecisionOutcome {
  summary: string;
  success: boolean;
  measuredAt: string;
  metrics?: Record<string, unknown>;
}

export interface Decision {
  id: string;
  companyId: string;
  recommendationId?: string;
  title: string;
  status: DecisionStatus;
  alternativesConsidered: RecommendationAlternative[];
  decisionMakerId: string;
  decisionDate: string;
  reasoning: string;
  evidence: RecommendationEvidence[];
  implementationState: ImplementationState;
  outcome?: DecisionOutcome;
  reviewDate?: string;
  graphNodeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RiskAssessment {
  id: string;
  companyId: string;
  category: RiskCategory;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  likelihood: number;
  impact: number;
  score: number;
  mitigation?: string;
  linkedEntityType?: string;
  linkedEntityId?: string;
  graphNodeId?: string;
  source: string;
  createdAt: string;
}

export interface Opportunity {
  id: string;
  companyId: string;
  category: OpportunityCategory;
  title: string;
  description: string;
  estimatedValueCents?: number;
  confidence: number;
  linkedRecommendationId?: string;
  status: "identified" | "evaluating" | "pursuing" | "captured" | "dismissed";
  graphNodeId?: string;
  source: string;
  createdAt: string;
}

export interface CreateRecommendationInput {
  companyId: string;
  title: string;
  summary: string;
  reasoning: string;
  evidence?: RecommendationEvidence[];
  alternatives?: RecommendationAlternative[];
  confidenceSources?: ConfidenceSource[];
  tradeOff?: Partial<TradeOffAnalysis>;
  confidence?: number;
  department?: string;
  source: RecommendationSource;
  sourceRef?: string;
  requiresApproval?: boolean;
  estimatedCostCents?: number;
  estimatedRoi?: string;
  expectedOutcome?: string;
  rollbackStrategy?: string;
  createdBy: string;
}

export interface RecommendationAuditEntry {
  id: string;
  recommendationId: string;
  action: string;
  actorId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}
