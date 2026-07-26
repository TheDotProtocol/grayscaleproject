import { Injectable } from "@nestjs/common";
import type {
  OrganizationalIntelligenceAssemblerPort,
  OrganizationalIntelligenceContext,
} from "@grayscale/platform";
import { MemoryEvolutionService } from "../organizational-evolution/memory-evolution.service";
import { OrganizationalLearningEngineService } from "../organizational-evolution/organizational-learning-engine.service";
import { OrganizationalWisdomEngineService } from "../organizational-evolution/organizational-wisdom-engine.service";
import { StrategyEvolutionService } from "../organizational-evolution/strategy-evolution.service";
import { ReflectionEngineService } from "../organizational-evolution/reflection-engine.service";
import { AutonomyFrameworkService } from "../organizational-evolution/autonomy-framework.service";

@Injectable()
export class OrganizationalIntelligenceAssemblerService implements OrganizationalIntelligenceAssemblerPort {
  constructor(
    private readonly memoryEvolution: MemoryEvolutionService,
    private readonly learning: OrganizationalLearningEngineService,
    private readonly wisdom: OrganizationalWisdomEngineService,
    private readonly strategyEvolution: StrategyEvolutionService,
    private readonly reflection: ReflectionEngineService,
    private readonly autonomy: AutonomyFrameworkService,
  ) {}

  async assemble(companyId: string, _options?: { founderUserId?: string }): Promise<OrganizationalIntelligenceContext> {
    const [recentLearnings, approvedWisdom, memoryIntegrity, learningHealth, wisdomGrowth, reflectionMetrics, strategyProposals, autonomyReadiness] =
      await Promise.all([
        this.learning.list(companyId, { limit: 10 }),
        this.wisdom.listApproved(companyId),
        this.memoryEvolution.getIntegrity(companyId),
        Promise.resolve(this.learning.getHealth(companyId)),
        Promise.resolve(this.wisdom.getGrowth(companyId)),
        this.reflection.getMetrics(companyId),
        this.strategyEvolution.list(companyId),
        this.autonomy.getReadiness(companyId),
      ]);

    return {
      companyId,
      assembledAt: new Date().toISOString(),
      recentLearnings,
      approvedWisdom,
      memoryEvolutionLayerCount: memoryIntegrity.layerCount,
      learningHealthScore: learningHealth.healthScore,
      wisdomGrowthScore: wisdomGrowth.growthScore,
      reflectionObservationCount: reflectionMetrics.totalObservations,
      strategyEvolutionProposals: strategyProposals.length,
      autonomyReadinessScore: autonomyReadiness.complianceScore,
      institutionalKnowledgeCount: approvedWisdom.length + memoryIntegrity.layerCount,
      maturityScore: Math.round((learningHealth.healthScore + wisdomGrowth.growthScore) / 2),
    };
  }
}
