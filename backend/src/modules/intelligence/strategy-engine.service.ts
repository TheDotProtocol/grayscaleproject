import { Injectable, OnModuleInit } from "@nestjs/common";
import type {
  StrategyEnginePort,
  StrategicIntelligenceContext,
  StrategyAnalysisResult,
  PriorityRankingResult,
  Recommendation,
  CompanyReadiness,
} from "@grayscale/platform";
import { GraphSummaryService } from "../graph/graph-summary.service";
import { IntelligenceEngineRegistryService } from "./engine-registry.service";
import { GoalEngineService } from "./goal-engine.service";
import { ObjectiveEngineService } from "./objective-engine.service";
import { PriorityEngineService } from "./priority-engine.service";
import { RecommendationEngineService } from "./recommendation-engine.service";
import { DecisionEngineService } from "./decision-engine.service";
import { RiskEngineService } from "./risk-engine.service";
import { OpportunityEngineService } from "./opportunity-engine.service";
import { DependencyAnalyzerService } from "./dependency-analyzer.service";
import { OperatingModeService } from "./operating-mode.service";
import { PolicyService } from "./policy.service";
import { ConstraintService } from "./constraint.service";
import { ScenarioService } from "./scenario.service";
import { RuleEvaluatorService } from "./rule-evaluator.service";

@Injectable()
export class StrategyEngineService implements StrategyEnginePort, OnModuleInit {
  constructor(
    private readonly registry: IntelligenceEngineRegistryService,
    private readonly goals: GoalEngineService,
    private readonly objectives: ObjectiveEngineService,
    private readonly priority: PriorityEngineService,
    private readonly recommendations: RecommendationEngineService,
    private readonly decisions: DecisionEngineService,
    private readonly risks: RiskEngineService,
    private readonly opportunities: OpportunityEngineService,
    private readonly dependencies: DependencyAnalyzerService,
    private readonly operatingMode: OperatingModeService,
    private readonly policies: PolicyService,
    private readonly constraints: ConstraintService,
    private readonly scenarios: ScenarioService,
    private readonly ruleEvaluator: RuleEvaluatorService,
    private readonly graphSummary: GraphSummaryService,
  ) {}

  /** AIP-10: dynamic engine registration — no hardcoded orchestrator list */
  onModuleInit(): void {
    for (const engine of [
      this.goals,
      this.objectives,
      this.priority,
      this.recommendations,
      this.decisions,
      this.risks,
      this.opportunities,
      this.dependencies,
    ]) {
      this.registry.register(engine);
    }
  }

  async getOperatingMode(companyId: string) {
    return this.operatingMode.getActiveMode(companyId);
  }

  async buildContext(companyId: string): Promise<StrategicIntelligenceContext> {
    const engines = this.registry.list();
    const contributions = await Promise.all(
      engines.map((e) => e.contribute(companyId)),
    );

    const engineContributions: Record<string, unknown> = {};
    for (const c of contributions) {
      engineContributions[c.engineId] = c.data;
    }

    const [
      operatingMode,
      goals,
      objectives,
      openRecommendations,
      pendingDecisions,
      topRisks,
      topOpportunities,
      dependencyReport,
      priorityMatrix,
      policies,
      constraints,
      scenarios,
      graphSummary,
    ] = await Promise.all([
      this.operatingMode.getActiveMode(companyId),
      this.goals.listActive(companyId),
      this.objectives.listByCompany(companyId),
      this.recommendations.listOpen(companyId),
      this.decisions.listPending(companyId),
      this.risks.listTop(companyId),
      this.opportunities.listTop(companyId),
      this.dependencies.analyze(companyId),
      this.priority.rankRecommendations(companyId).then((r) => r.scores),
      this.policies.listActive(companyId),
      this.constraints.list(companyId),
      this.scenarios.list(companyId),
      this.graphSummary.getSummary(companyId),
    ]);

    return {
      companyId,
      operatingMode,
      goals,
      objectives,
      openRecommendations,
      pendingDecisions,
      topRisks,
      topOpportunities,
      dependencyReport,
      priorityMatrix,
      policies,
      constraints,
      scenarios,
      companyReadiness: this.computeReadiness({
        goals,
        topRisks,
        dependencyReport,
        graphSummary,
      }),
      graphSummary,
      engineContributions,
      assembledAt: new Date().toISOString(),
    };
  }

  async analyze(companyId: string): Promise<StrategyAnalysisResult> {
    const [topRisks, topOpportunities, dependencyReport] = await Promise.all([
      this.risks.listTop(companyId),
      this.opportunities.listTop(companyId),
      this.dependencies.analyze(companyId),
    ]);

    return {
      companyId,
      risks: topRisks,
      opportunities: topOpportunities,
      dependencyReport,
      analyzedAt: new Date().toISOString(),
    };
  }

  async prioritize(companyId: string): Promise<PriorityRankingResult> {
    return this.priority.rankRecommendations(companyId);
  }

  async evaluateRules(companyId: string): Promise<Recommendation[]> {
    return this.ruleEvaluator.evaluate(companyId);
  }

  private computeReadiness(input: {
    goals: { health: string; progress: number }[];
    topRisks: { score: number }[];
    dependencyReport: { summary: { totalBlockers: number } };
    graphSummary: { knowledgeCoverage: number };
  }): CompanyReadiness {
    const goalScore =
      input.goals.length === 0
        ? 0.5
        : input.goals.reduce((s, g) => s + g.progress, 0) / input.goals.length;
    const riskScore =
      input.topRisks.length === 0
        ? 0.8
        : 1 - Math.min(1, input.topRisks.reduce((s, r) => s + r.score, 0) / input.topRisks.length);
    const depScore =
      input.dependencyReport.summary.totalBlockers === 0 ? 1 : 0.6;
    const graphScore = input.graphSummary.knowledgeCoverage;

    const factors = [
      { name: "goals", score: goalScore, weight: 0.3 },
      { name: "risk", score: riskScore, weight: 0.25 },
      { name: "dependencies", score: depScore, weight: 0.2 },
      { name: "knowledge", score: graphScore, weight: 0.25 },
    ];

    const score = Math.round(
      factors.reduce((s, f) => s + f.score * f.weight, 0) * 100,
    );

    return { score, factors };
  }
}
