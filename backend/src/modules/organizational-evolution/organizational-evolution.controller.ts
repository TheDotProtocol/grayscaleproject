import { Controller, Get, Param, Post, Body, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { MemoryEvolutionService } from "./memory-evolution.service";
import { OrganizationalLearningEngineService } from "./organizational-learning-engine.service";
import { OrganizationalWisdomEngineService } from "./organizational-wisdom-engine.service";
import { StrategyEvolutionService } from "./strategy-evolution.service";
import { ReflectionEngineService } from "./reflection-engine.service";
import { AutonomyFrameworkService } from "./autonomy-framework.service";
import { IntelligenceGraphService } from "./intelligence-graph.service";
import { EvolutionCertificationService } from "./evolution-certification.service";

@ApiTags("organizational-evolution")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("companies/:companyId/organizational-evolution")
export class OrganizationalEvolutionController {
  constructor(
    private readonly memoryEvolution: MemoryEvolutionService,
    private readonly learning: OrganizationalLearningEngineService,
    private readonly wisdom: OrganizationalWisdomEngineService,
    private readonly strategyEvolution: StrategyEvolutionService,
    private readonly reflection: ReflectionEngineService,
    private readonly autonomy: AutonomyFrameworkService,
    private readonly graph: IntelligenceGraphService,
    private readonly certification: EvolutionCertificationService,
  ) {}

  @Get("overview")
  overview(@Param("companyId") companyId: string) {
    return Promise.all([
      this.memoryEvolution.getTimeline(companyId, 10),
      this.learning.getTimeline(companyId, 10),
      this.wisdom.getHistory(companyId),
      this.strategyEvolution.list(companyId),
      this.reflection.getMetrics(companyId),
      this.autonomy.getReadiness(companyId),
      this.graph.assemble(companyId),
    ]).then(([memoryEvolution, learning, wisdom, strategyProposals, reflection, autonomy, graph]) => ({
      companyId,
      memoryEvolution,
      learning,
      wisdom,
      strategyProposals,
      reflection,
      autonomy,
      graph,
      assembledAt: new Date().toISOString(),
    }));
  }

  @Get("memory-evolution")
  memoryEvolutionTimeline(@Param("companyId") companyId: string) {
    return this.memoryEvolution.getTimeline(companyId);
  }

  @Post("memory-evolution")
  createMemoryEvolutionLayer(@Param("companyId") companyId: string, @Body() body: Record<string, unknown>) {
    return this.memoryEvolution.evolve({ companyId, ...body } as never);
  }

  @Get("learning")
  learningTimeline(@Param("companyId") companyId: string) {
    return this.learning.getTimeline(companyId);
  }

  @Post("learning")
  recordLearning(@Param("companyId") companyId: string, @Body() body: Record<string, unknown>) {
    return this.learning.record({ companyId, recordedAt: new Date().toISOString(), recordedBy: "organization", ...body } as never);
  }

  @Post("learning/:id/validate")
  validateLearning(@Param("id") id: string) {
    return this.learning.validate(id);
  }

  @Get("wisdom")
  wisdomHistory(@Param("companyId") companyId: string) {
    return this.wisdom.getHistory(companyId);
  }

  @Get("wisdom/approved")
  approvedWisdom(@Param("companyId") companyId: string) {
    return this.wisdom.listApproved(companyId);
  }

  @Post("wisdom/propose")
  proposeWisdom(@Param("companyId") companyId: string, @Body() body: Record<string, unknown>) {
    return this.wisdom.propose({ companyId, ...body } as never);
  }

  @Get("strategy-evolution")
  strategyProposals(@Param("companyId") companyId: string) {
    return this.strategyEvolution.list(companyId);
  }

  @Post("strategy-evolution")
  proposeStrategyEvolution(@Param("companyId") companyId: string, @Body() body: Record<string, unknown>) {
    return this.strategyEvolution.propose({ companyId, correlationId: crypto.randomUUID(), ...body } as never);
  }

  @Get("reflection")
  reflections(@Param("companyId") companyId: string) {
    return this.reflection.list(companyId);
  }

  @Post("reflection/run")
  runReflection(@Param("companyId") companyId: string) {
    return this.reflection.runPeriodicReflection(companyId);
  }

  @Get("reflection/metrics")
  reflectionMetrics(@Param("companyId") companyId: string) {
    return this.reflection.getMetrics(companyId);
  }

  @Get("autonomy")
  autonomyPolicies(@Param("companyId") companyId: string) {
    return this.autonomy.listPolicies(companyId);
  }

  @Get("autonomy/readiness")
  autonomyReadiness(@Param("companyId") companyId: string) {
    return this.autonomy.getReadiness(companyId);
  }

  @Get("intelligence-graph")
  intelligenceGraph(@Param("companyId") companyId: string) {
    return this.graph.assemble(companyId);
  }

  @Get("certify")
  certify(@Param("companyId") companyId: string) {
    return this.certification.certify(companyId);
  }
}
