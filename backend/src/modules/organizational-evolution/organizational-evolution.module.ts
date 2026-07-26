import { Module, forwardRef } from "@nestjs/common";
import { EventsModule } from "../events/events.module";
import { ContextRuntimeModule } from "../context-runtime/context-runtime.module";
import { TwinRuntimeModule } from "../twin-runtime/twin-runtime.module";
import { MemoryEvolutionService } from "./memory-evolution.service";
import { OrganizationalLearningEngineService } from "./organizational-learning-engine.service";
import { OrganizationalWisdomEngineService } from "./organizational-wisdom-engine.service";
import { StrategyEvolutionService } from "./strategy-evolution.service";
import { ReflectionEngineService } from "./reflection-engine.service";
import { AutonomyFrameworkService } from "./autonomy-framework.service";
import { IntelligenceGraphService } from "./intelligence-graph.service";
import { EvolutionCertificationService } from "./evolution-certification.service";
import { OrganizationalEvolutionController } from "./organizational-evolution.controller";

@Module({
  imports: [EventsModule, forwardRef(() => ContextRuntimeModule), TwinRuntimeModule],
  controllers: [OrganizationalEvolutionController],
  providers: [
    MemoryEvolutionService,
    OrganizationalLearningEngineService,
    OrganizationalWisdomEngineService,
    StrategyEvolutionService,
    ReflectionEngineService,
    AutonomyFrameworkService,
    IntelligenceGraphService,
    EvolutionCertificationService,
  ],
  exports: [
    MemoryEvolutionService,
    OrganizationalLearningEngineService,
    OrganizationalWisdomEngineService,
    StrategyEvolutionService,
    ReflectionEngineService,
    AutonomyFrameworkService,
    IntelligenceGraphService,
    EvolutionCertificationService,
  ],
})
export class OrganizationalEvolutionModule {}
