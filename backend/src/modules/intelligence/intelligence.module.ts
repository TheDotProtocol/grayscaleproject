import { Module, forwardRef } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { GraphModule } from "../graph/graph.module";
import { EventsModule } from "../events/events.module";
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
import { StrategyEngineService } from "./strategy-engine.service";
import { StrategicGraphProjector } from "./strategic-graph.projector";
import { IntelligenceController } from "./intelligence.controller";

@Module({
  imports: [PrismaModule, GraphModule, forwardRef(() => EventsModule)],
  controllers: [IntelligenceController],
  providers: [
    IntelligenceEngineRegistryService,
    GoalEngineService,
    ObjectiveEngineService,
    PriorityEngineService,
    RecommendationEngineService,
    DecisionEngineService,
    RiskEngineService,
    OpportunityEngineService,
    DependencyAnalyzerService,
    OperatingModeService,
    PolicyService,
    ConstraintService,
    ScenarioService,
    RuleEvaluatorService,
    StrategyEngineService,
    StrategicGraphProjector,
  ],
  exports: [
    StrategyEngineService,
    RecommendationEngineService,
    GoalEngineService,
    ScenarioService,
    PolicyService,
    StrategicGraphProjector,
    IntelligenceEngineRegistryService,
  ],
})
export class IntelligenceModule {}
