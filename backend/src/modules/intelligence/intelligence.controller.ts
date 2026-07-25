import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import type {
  CreateGoalInput,
  CreateObjectiveInput,
  CreateRecommendationInput,
  PriorityConfigScope,
  PriorityWeights,
  CompanyOperatingMode,
  PolicyCategory,
  PolicyRule,
  ConstraintType,
} from "@grayscale/platform";
import { StrategyEngineService } from "./strategy-engine.service";
import { GoalEngineService } from "./goal-engine.service";
import { ObjectiveEngineService } from "./objective-engine.service";
import { RecommendationEngineService } from "./recommendation-engine.service";
import { DecisionEngineService } from "./decision-engine.service";
import { PriorityEngineService } from "./priority-engine.service";
import { OperatingModeService } from "./operating-mode.service";
import { PolicyService } from "./policy.service";
import { ConstraintService } from "./constraint.service";
import { ScenarioService } from "./scenario.service";
import { IntelligenceEngineRegistryService } from "./engine-registry.service";

@ApiTags("intelligence")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("companies/:companyId/intelligence")
export class IntelligenceController {
  constructor(
    private readonly strategy: StrategyEngineService,
    private readonly goals: GoalEngineService,
    private readonly objectives: ObjectiveEngineService,
    private readonly recommendations: RecommendationEngineService,
    private readonly decisions: DecisionEngineService,
    private readonly priority: PriorityEngineService,
    private readonly operatingMode: OperatingModeService,
    private readonly policies: PolicyService,
    private readonly constraints: ConstraintService,
    private readonly scenarios: ScenarioService,
    private readonly registry: IntelligenceEngineRegistryService,
  ) {}

  @Get("summary")
  getSummary(@Param("companyId") companyId: string) {
    return this.strategy.buildContext(companyId);
  }

  @Get("engines")
  listEngines() {
    return this.registry.list().map((e) => ({
      id: e.id,
      name: e.name,
      version: e.version,
    }));
  }

  @Get("analysis")
  analyze(@Param("companyId") companyId: string) {
    return this.strategy.analyze(companyId);
  }

  @Get("priorities")
  prioritize(@Param("companyId") companyId: string) {
    return this.strategy.prioritize(companyId);
  }

  @Post("evaluate-rules")
  evaluateRules(@Param("companyId") companyId: string) {
    return this.strategy.evaluateRules(companyId);
  }

  @Get("operating-mode")
  getOperatingMode(@Param("companyId") companyId: string) {
    return this.operatingMode.getActiveMode(companyId);
  }

  @Post("operating-mode")
  setOperatingMode(
    @Param("companyId") companyId: string,
    @Body() body: { mode: CompanyOperatingMode; metadata?: Record<string, unknown> },
  ) {
    return this.operatingMode.setMode(companyId, body.mode, body.metadata);
  }

  @Get("goals")
  listGoals(@Param("companyId") companyId: string) {
    return this.goals.listActive(companyId);
  }

  @Post("goals")
  createGoal(@Param("companyId") companyId: string, @Body() body: Omit<CreateGoalInput, "companyId">) {
    return this.goals.create({ ...body, companyId });
  }

  @Get("objectives")
  listObjectives(@Param("companyId") companyId: string) {
    return this.objectives.listByCompany(companyId);
  }

  @Post("objectives")
  createObjective(
    @Param("companyId") companyId: string,
    @Body() body: Omit<CreateObjectiveInput, "companyId">,
  ) {
    return this.objectives.create({ ...body, companyId });
  }

  @Get("recommendations")
  listRecommendations(@Param("companyId") companyId: string) {
    return this.recommendations.listOpen(companyId);
  }

  @Get("recommendations/:id")
  getRecommendation(@Param("companyId") companyId: string, @Param("id") id: string) {
    return this.recommendations.getById(companyId, id);
  }

  @Post("recommendations")
  createRecommendation(
    @Param("companyId") companyId: string,
    @Body() body: Omit<CreateRecommendationInput, "companyId">,
  ) {
    return this.recommendations.create({ ...body, companyId });
  }

  @Post("recommendations/:id/status")
  updateRecommendationStatus(
    @Param("companyId") companyId: string,
    @Param("id") id: string,
    @Body() body: { status: string; actorId: string },
  ) {
    return this.recommendations.updateStatus(
      companyId,
      id,
      body.status as never,
      body.actorId,
    );
  }

  @Post("decisions")
  recordDecision(
    @Param("companyId") companyId: string,
    @Body()
    body: {
      recommendationId?: string;
      title: string;
      decisionMakerId: string;
      reasoning: string;
    },
  ) {
    return this.decisions.record({ companyId, ...body });
  }

  @Post("priority-config")
  upsertPriorityConfig(
    @Param("companyId") companyId: string,
    @Body()
    body: {
      scope: PriorityConfigScope;
      weights: PriorityWeights;
      createdBy: string;
      scopeRef?: string;
      operatingMode?: CompanyOperatingMode;
    },
  ) {
    return this.priority.upsertConfig(
      companyId,
      body.scope,
      body.weights,
      body.createdBy,
      body.scopeRef,
      body.operatingMode,
    );
  }

  @Get("policies")
  listPolicies(@Param("companyId") companyId: string) {
    return this.policies.listActive(companyId);
  }

  @Post("policies")
  createPolicy(
    @Param("companyId") companyId: string,
    @Body() body: { name: string; category: PolicyCategory; rules: PolicyRule[] },
  ) {
    return this.policies.create(companyId, body.name, body.category, body.rules);
  }

  @Get("constraints")
  listConstraints(@Param("companyId") companyId: string) {
    return this.constraints.list(companyId);
  }

  @Post("constraints")
  upsertConstraint(
    @Param("companyId") companyId: string,
    @Body() body: { type: ConstraintType; limit: number; unit: string; isHard?: boolean },
  ) {
    return this.constraints.upsert(companyId, body.type, body.limit, body.unit, body.isHard);
  }

  @Get("scenarios")
  listScenarios(@Param("companyId") companyId: string) {
    return this.scenarios.list(companyId);
  }

  @Post("scenarios")
  createScenario(
    @Param("companyId") companyId: string,
    @Body()
    body: {
      name: string;
      case: "best" | "expected" | "worst";
      assumptions?: Record<string, unknown>;
      outcomes?: Record<string, unknown>;
    },
  ) {
    return this.scenarios.create({ companyId, ...body });
  }
}
