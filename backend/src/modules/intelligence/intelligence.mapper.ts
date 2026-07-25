import type {
  Goal,
  Objective,
  Recommendation,
  Decision,
  RiskAssessment,
  Opportunity,
  PriorityScore,
  PriorityWeights,
  TradeOffAnalysis,
  ConfidenceSource,
  RecommendationEvidence,
} from "@grayscale/platform";

const DEFAULT_WEIGHTS: PriorityWeights = {
  businessValue: 0.25,
  founderPriority: 0.2,
  revenueImpact: 0.2,
  risk: 0.15,
  dependency: 0.05,
  timeSensitivity: 0.1,
  engineeringCost: 0.05,
};

export function defaultWeights(): PriorityWeights {
  return { ...DEFAULT_WEIGHTS };
}

export function computePriorityScore(
  input: {
    businessValue: number;
    founderPriority: number;
    revenueImpact: number;
    riskScore: number;
    dependencyBlockers: number;
    timeSensitivity: number;
    engineeringCost: number;
  },
  weights: PriorityWeights,
): { score: number; factors: PriorityScore["reasoning"]["factors"] } {
  const factors = [
    { name: "businessValue", value: input.businessValue, weight: weights.businessValue, contribution: input.businessValue * weights.businessValue },
    { name: "founderPriority", value: input.founderPriority, weight: weights.founderPriority, contribution: input.founderPriority * weights.founderPriority },
    { name: "revenueImpact", value: input.revenueImpact, weight: weights.revenueImpact, contribution: input.revenueImpact * weights.revenueImpact },
    { name: "timeSensitivity", value: input.timeSensitivity, weight: weights.timeSensitivity, contribution: input.timeSensitivity * weights.timeSensitivity },
  ];

  const positive = factors.reduce((s, f) => s + f.contribution, 0);
  const riskPenalty = 1 - input.riskScore * weights.risk;
  const depPenalty = 1 / (1 + input.dependencyBlockers * weights.dependency);
  const costPenalty = 1 - input.engineeringCost * weights.engineeringCost;
  const score = Math.round(positive * riskPenalty * depPenalty * costPenalty * 100);

  return { score: Math.max(0, Math.min(100, score)), factors };
}

export function confidenceBand(confidence: number): Recommendation["confidenceBand"] {
  if (confidence >= 0.9) return "verified";
  if (confidence >= 0.75) return "high";
  if (confidence >= 0.5) return "medium";
  if (confidence >= 0.25) return "low";
  return "unknown";
}

export function defaultTradeOff(): TradeOffAnalysis {
  return { benefits: [], costs: [], opportunityCost: undefined, hiddenCost: undefined, longTermImpact: undefined };
}

export function rowToGoal(row: {
  id: string; companyId: string; scope: string; department: string | null;
  title: string; description: string | null; successCriteria: unknown;
  priorityWeight: number; status: string; health: string; progress: number;
  ownerId: string | null; deadline: Date | null; graphNodeId: string | null;
  metadata: unknown; createdAt: Date; updatedAt: Date;
}): Goal {
  return {
    id: row.id, companyId: row.companyId, scope: row.scope as Goal["scope"],
    department: row.department ?? undefined, title: row.title,
    description: row.description ?? undefined,
    successCriteria: (row.successCriteria as Goal["successCriteria"]) ?? [],
    priorityWeight: row.priorityWeight, status: row.status as Goal["status"],
    health: row.health as Goal["health"], progress: row.progress,
    ownerId: row.ownerId ?? undefined, deadline: row.deadline?.toISOString(),
    graphNodeId: row.graphNodeId ?? undefined,
    metadata: (row.metadata ?? {}) as Record<string, unknown>,
    createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString(),
  };
}

export function rowToRecommendation(row: {
  id: string; companyId: string; title: string; summary: string; reasoning: string;
  evidence: unknown; alternatives: unknown; confidenceSources: unknown;
  tradeOff: unknown; dependencies: string[]; riskAssessmentIds: string[];
  estimatedCostCents: number | null; engineeringCost: number | null;
  estimatedRoi: string | null; confidence: number; confidenceBand: string;
  priorityScoreId: string | null; department: string | null; source: string;
  sourceRef: string | null; requiresApproval: boolean; status: string;
  expectedOutcome: string | null; expectedTimeline: string | null;
  rollbackStrategy: string | null; graphNodeId: string | null;
  memoryRecordIds: string[]; scenarioIds: string[];
  policyViolations: string[]; constraintViolations: string[];
  createdBy: string; createdAt: Date; updatedAt: Date;
}): Recommendation {
  return {
    id: row.id, companyId: row.companyId, title: row.title, summary: row.summary,
    reasoning: row.reasoning,
    evidence: (row.evidence as RecommendationEvidence[]) ?? [],
    alternatives: (row.alternatives as Recommendation["alternatives"]) ?? [],
    confidenceSources: (row.confidenceSources as ConfidenceSource[]) ?? [],
    tradeOff: (row.tradeOff as TradeOffAnalysis) ?? defaultTradeOff(),
    dependencies: row.dependencies, riskAssessmentIds: row.riskAssessmentIds,
    estimatedCostCents: row.estimatedCostCents ?? undefined,
    engineeringCost: row.engineeringCost ?? undefined,
    estimatedRoi: row.estimatedRoi ?? undefined, confidence: row.confidence,
    confidenceBand: row.confidenceBand as Recommendation["confidenceBand"],
    priorityScoreId: row.priorityScoreId ?? undefined,
    department: row.department ?? undefined,
    source: row.source as Recommendation["source"],
    sourceRef: row.sourceRef ?? undefined, requiresApproval: row.requiresApproval,
    status: row.status as Recommendation["status"],
    expectedOutcome: row.expectedOutcome ?? undefined,
    expectedTimeline: row.expectedTimeline ?? undefined,
    rollbackStrategy: row.rollbackStrategy ?? undefined,
    graphNodeId: row.graphNodeId ?? undefined,
    memoryRecordIds: row.memoryRecordIds, scenarioIds: row.scenarioIds,
    policyViolations: row.policyViolations,
    constraintViolations: row.constraintViolations,
    createdBy: row.createdBy,
    createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString(),
  };
}

export function rowToDecision(row: {
  id: string; companyId: string; recommendationId: string | null; title: string;
  status: string; alternativesConsidered: unknown; decisionMakerId: string;
  decisionDate: Date; reasoning: string; evidence: unknown;
  implementationState: string; outcome: unknown; reviewDate: Date | null;
  graphNodeId: string | null; createdAt: Date; updatedAt: Date;
}): Decision {
  return {
    id: row.id, companyId: row.companyId,
    recommendationId: row.recommendationId ?? undefined,
    title: row.title, status: row.status as Decision["status"],
    alternativesConsidered: (row.alternativesConsidered as Decision["alternativesConsidered"]) ?? [],
    decisionMakerId: row.decisionMakerId,
    decisionDate: row.decisionDate.toISOString(), reasoning: row.reasoning,
    evidence: (row.evidence as RecommendationEvidence[]) ?? [],
    implementationState: row.implementationState as Decision["implementationState"],
    outcome: row.outcome as Decision["outcome"] | undefined,
    reviewDate: row.reviewDate?.toISOString(),
    graphNodeId: row.graphNodeId ?? undefined,
    createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString(),
  };
}

export function rowToRisk(row: {
  id: string; companyId: string; category: string; title: string;
  description: string; severity: string; likelihood: number; impact: number;
  score: number; mitigation: string | null; linkedEntityType: string | null;
  linkedEntityId: string | null; graphNodeId: string | null; source: string;
  createdAt: Date;
}): RiskAssessment {
  return {
    id: row.id, companyId: row.companyId,
    category: row.category as RiskAssessment["category"],
    title: row.title, description: row.description,
    severity: row.severity as RiskAssessment["severity"],
    likelihood: row.likelihood, impact: row.impact, score: row.score,
    mitigation: row.mitigation ?? undefined,
    linkedEntityType: row.linkedEntityType ?? undefined,
    linkedEntityId: row.linkedEntityId ?? undefined,
    graphNodeId: row.graphNodeId ?? undefined,
    source: row.source, createdAt: row.createdAt.toISOString(),
  };
}

export function rowToOpportunity(row: {
  id: string; companyId: string; category: string; title: string;
  description: string; estimatedValueCents: number | null; confidence: number;
  linkedRecommendationId: string | null; status: string; graphNodeId: string | null;
  source: string; createdAt: Date;
}): Opportunity {
  return {
    id: row.id, companyId: row.companyId,
    category: row.category as Opportunity["category"],
    title: row.title, description: row.description,
    estimatedValueCents: row.estimatedValueCents ?? undefined,
    confidence: row.confidence,
    linkedRecommendationId: row.linkedRecommendationId ?? undefined,
    status: row.status as Opportunity["status"],
    graphNodeId: row.graphNodeId ?? undefined,
    source: row.source, createdAt: row.createdAt.toISOString(),
  };
}

export function rowToObjective(row: {
  id: string; companyId: string; goalId: string; title: string;
  description: string | null; status: string; completion: number;
  deadline: Date | null; ownerId: string | null;
  dependencyObjectiveIds: string[]; linkedProjectIds: string[];
  graphNodeId: string | null; metadata: unknown;
  createdAt: Date; updatedAt: Date;
}): Objective {
  return {
    id: row.id, companyId: row.companyId, goalId: row.goalId,
    title: row.title, description: row.description ?? undefined,
    status: row.status as Objective["status"], completion: row.completion,
    deadline: row.deadline?.toISOString(), ownerId: row.ownerId ?? undefined,
    dependencyObjectiveIds: row.dependencyObjectiveIds,
    linkedProjectIds: row.linkedProjectIds,
    graphNodeId: row.graphNodeId ?? undefined,
    metadata: (row.metadata ?? {}) as Record<string, unknown>,
    createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString(),
  };
}
