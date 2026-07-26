import { Injectable } from "@nestjs/common";
import { MemoryEvolutionService } from "../organizational-evolution/memory-evolution.service";
import { OrganizationalLearningEngineService } from "../organizational-evolution/organizational-learning-engine.service";
import { OrganizationalWisdomEngineService } from "../organizational-evolution/organizational-wisdom-engine.service";
import { StrategyEvolutionService } from "../organizational-evolution/strategy-evolution.service";
import { ReflectionEngineService } from "../organizational-evolution/reflection-engine.service";
import { AutonomyFrameworkService } from "../organizational-evolution/autonomy-framework.service";
import { IntelligenceGraphService } from "../organizational-evolution/intelligence-graph.service";
import { EvolutionCertificationService } from "../organizational-evolution/evolution-certification.service";
import { OrganizationalTwinService } from "../twin-runtime/organizational-twin.service";
import { ForecastIntelligenceService } from "../twin-runtime/forecast-intelligence.service";
import { SimulationSessionService } from "../twin-runtime/simulation-session.service";

@Injectable()
export class EvolutionWidgetDataService {
  constructor(
    private readonly memoryEvolution: MemoryEvolutionService,
    private readonly learning: OrganizationalLearningEngineService,
    private readonly wisdom: OrganizationalWisdomEngineService,
    private readonly strategyEvolution: StrategyEvolutionService,
    private readonly reflection: ReflectionEngineService,
    private readonly autonomy: AutonomyFrameworkService,
    private readonly graph: IntelligenceGraphService,
    private readonly certification: EvolutionCertificationService,
    private readonly twin: OrganizationalTwinService,
    private readonly forecast: ForecastIntelligenceService,
    private readonly simulation: SimulationSessionService,
  ) {}

  getOverview(companyId: string) {
    return Promise.all([
      this.memoryEvolution.getTimeline(companyId, 5),
      this.learning.getHealth(companyId),
      this.wisdom.getGrowth(companyId),
      this.reflection.getMetrics(companyId),
    ]).then(([evolution, learning, wisdom, reflection]) => ({ evolution, learning, wisdom, reflection }));
  }

  getLearningTimeline(companyId: string) {
    return this.learning.getTimeline(companyId);
  }

  getWisdomTimeline(companyId: string) {
    return this.wisdom.getHistory(companyId);
  }

  getReflection(companyId: string) {
    return this.reflection.list(companyId);
  }

  getRealityVsLearning(companyId: string) {
    return this.twin.getEvolution(companyId).then((evolution) => ({
      realityPreserved: true,
      learningLayers: evolution.versions.length,
      message: "Reality supersedes all learning hypotheses",
    }));
  }

  getForecastAccuracy(companyId: string) {
    return this.forecast.list(companyId).then((forecasts) => ({
      total: forecasts.length,
      validated: forecasts.filter((f) => f.status === "validated").length,
      accuracyNote: "Forecasts are hypotheses — reality always wins",
    }));
  }

  getSimulationAccuracy(companyId: string) {
    return this.simulation.getHistory(companyId).then((sessions) => ({
      total: sessions.length,
      isolated: true,
      accuracyNote: "Simulations never become history",
    }));
  }

  getAutonomyStatus(companyId: string) {
    return this.autonomy.listPolicies(companyId);
  }

  getMaturity(companyId: string) {
    return Promise.all([this.learning.getHealth(companyId), this.wisdom.getGrowth(companyId), this.reflection.getMetrics(companyId)]).then(
      ([learning, wisdom, reflection]) => ({
        maturityScore: Math.round((learning.healthScore + wisdom.growthScore + reflection.totalObservations * 5) / 3),
        learning,
        wisdom,
        reflection,
      }),
    );
  }

  getIntelligence(companyId: string) {
    return this.graph.assemble(companyId);
  }

  getInstitutionalKnowledge(companyId: string) {
    return Promise.all([this.wisdom.listApproved(companyId), this.memoryEvolution.getLayers(companyId, { stage: "institutional_principle" })]).then(
      ([wisdom, principles]) => ({ wisdom, principles }),
    );
  }

  getHistory(companyId: string) {
    return this.memoryEvolution.getTimeline(companyId);
  }

  getLearningHealth(companyId: string) {
    return this.learning.getHealth(companyId);
  }

  getWisdomGrowth(companyId: string) {
    return this.wisdom.getGrowth(companyId);
  }

  getReflectionMetrics(companyId: string) {
    return this.reflection.getMetrics(companyId);
  }

  getAutonomyReadiness(companyId: string) {
    return this.autonomy.getReadiness(companyId);
  }
}
