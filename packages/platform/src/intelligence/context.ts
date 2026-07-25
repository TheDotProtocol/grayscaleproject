import type { GraphSummary } from "../graph/ports.js";
import type { MemoryRecord } from "../memory/types.js";
import type { PlatformEvent } from "../events/envelope.js";
import type {
  Goal,
  Objective,
} from "./goals.js";
import type {
  Recommendation,
  Decision,
  RiskAssessment,
  Opportunity,
} from "./recommendations.js";
import type {
  PriorityScore,
  CompanyOperatingMode,
  DecisionPolicy,
  StrategicConstraint,
  ScenarioPlan,
} from "./types.js";

export interface DependencyReport {
  companyId: string;
  generatedAt: string;
  blockedProjects: BlockedEntity[];
  blockedTasks: BlockedEntity[];
  crossProjectDependencies: DependencyChain[];
  summary: { totalBlockers: number; criticalPathLength: number };
}

export interface BlockedEntity {
  entityType: string;
  entityId: string;
  displayName: string;
  blockedBy: { type: string; id: string; relationship: string }[];
}

export interface DependencyChain {
  rootId: string;
  chain: { nodeId: string; nodeType: string; relationship: string }[];
  depth: number;
}

export interface CompanyReadiness {
  score: number;
  factors: { name: string; score: number; weight: number }[];
}

export interface StrategicIntelligenceContext {
  companyId: string;
  operatingMode: CompanyOperatingMode;
  goals: Goal[];
  objectives: Objective[];
  openRecommendations: Recommendation[];
  pendingDecisions: Decision[];
  topRisks: RiskAssessment[];
  topOpportunities: Opportunity[];
  dependencyReport: DependencyReport;
  priorityMatrix: PriorityScore[];
  policies: DecisionPolicy[];
  constraints: StrategicConstraint[];
  scenarios: ScenarioPlan[];
  companyReadiness: CompanyReadiness;
  graphSummary?: GraphSummary;
  memoryHighlights?: MemoryRecord[];
  recentEvents?: PlatformEvent[];
  engineContributions: Record<string, unknown>;
  assembledAt: string;
}

export interface StrategyAnalysisResult {
  companyId: string;
  risks: RiskAssessment[];
  opportunities: Opportunity[];
  dependencyReport: DependencyReport;
  analyzedAt: string;
}

export interface PriorityRankingResult {
  companyId: string;
  scores: PriorityScore[];
  rankedAt: string;
}
