import { Module, forwardRef } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { IntelligenceModule } from "../intelligence/intelligence.module";
import { GraphModule } from "../graph/graph.module";
import { MemoryIndexModule } from "../memory/memory-index.module";
import { PulseModule } from "../pulse/pulse.module";
import { PluginsModule } from "../plugins/plugins.module";
import { EventsModule } from "../events/events.module";
import { PlatformOperationsModule } from "../platform-operations/platform-operations.module";
import { ContextCacheService } from "./context-cache.service";
import { ContextRuntimeService } from "./context-runtime.service";
import { CompanyContextAssemblerService } from "./company-context-assembler.service";
import { OrganizationalIntelligenceAssemblerService } from "./organizational-intelligence-assembler.service";
import { IntentEngineService } from "./intent-engine.service";
import { TemporalEngineService } from "./temporal-engine.service";
import { OrganizationalSignalBusService } from "./organizational-signal-bus.service";
import { OrganizationalInsightEngineService } from "./organizational-insight-engine.service";
import { AttentionEngineService } from "./attention-engine.service";
import { TwinEngineService } from "./twin-engine.service";
import { SignalCorrelationService } from "./signal-correlation.service";
import { HomeostasisEngineService } from "./homeostasis-engine.service";
import { ForesightEngineService } from "./foresight-engine.service";
import { AntifragilityEngineService } from "./antifragility-engine.service";
import { DecisionEconomyEngineService } from "./decision-economy-engine.service";
import { AlignmentEngineService } from "./alignment-engine.service";
import { ScenarioPlanningService } from "./scenario-planning.service";
import { ForecastContextService } from "./forecast-context.service";
import { IntentProjector } from "./projectors/intent.projector";
import { SnapshotProjector } from "./projectors/snapshot.projector";
import { SignalProjector } from "./projectors/signal.projector";
import { InsightProjector } from "./projectors/insight.projector";
import { OrganizationalEvolutionModule } from "../organizational-evolution/organizational-evolution.module";
import { CouncilRuntimeModule } from "../council-runtime/council-runtime.module";
import { TwinRuntimeModule } from "../twin-runtime/twin-runtime.module";
import { OrganizationalRuntimeModule } from "../runtime/runtime.module";
import { AttentionBudgetModule } from "../attention-budget/attention-budget.module";

@Module({
  imports: [
    PrismaModule,
    IntelligenceModule,
    GraphModule,
    MemoryIndexModule,
    PulseModule,
    PluginsModule,
    forwardRef(() => PlatformOperationsModule),
    forwardRef(() => EventsModule),
    forwardRef(() => OrganizationalEvolutionModule),
    forwardRef(() => CouncilRuntimeModule),
    forwardRef(() => TwinRuntimeModule),
    forwardRef(() => OrganizationalRuntimeModule),
    forwardRef(() => AttentionBudgetModule),
  ],
  providers: [
    ContextCacheService,
    ContextRuntimeService,
    CompanyContextAssemblerService,
    OrganizationalIntelligenceAssemblerService,
    IntentEngineService,
    TemporalEngineService,
    OrganizationalSignalBusService,
    OrganizationalInsightEngineService,
    IntentProjector,
    SnapshotProjector,
    SignalProjector,
    InsightProjector,
    AttentionEngineService,
    TwinEngineService,
    SignalCorrelationService,
    HomeostasisEngineService,
    ForesightEngineService,
    AntifragilityEngineService,
    DecisionEconomyEngineService,
    AlignmentEngineService,
    ScenarioPlanningService,
    ForecastContextService,
  ],
  exports: [
    ContextRuntimeService,
    CompanyContextAssemblerService,
    ContextCacheService,
    IntentEngineService,
    TemporalEngineService,
    OrganizationalSignalBusService,
    OrganizationalInsightEngineService,
    IntentProjector,
    SnapshotProjector,
    SignalProjector,
    InsightProjector,
    AttentionEngineService,
    TwinEngineService,
    SignalCorrelationService,
    HomeostasisEngineService,
    ForesightEngineService,
    AntifragilityEngineService,
    DecisionEconomyEngineService,
    AlignmentEngineService,
    ScenarioPlanningService,
    ForecastContextService,
  ],
})
export class ContextRuntimeModule {}
