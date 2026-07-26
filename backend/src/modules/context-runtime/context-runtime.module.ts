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
import { IntentProjector } from "./projectors/intent.projector";
import { SnapshotProjector } from "./projectors/snapshot.projector";
import { SignalProjector } from "./projectors/signal.projector";
import { InsightProjector } from "./projectors/insight.projector";
import { OrganizationalEvolutionModule } from "../organizational-evolution/organizational-evolution.module";
import { CouncilRuntimeModule } from "../council-runtime/council-runtime.module";

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
  ],
})
export class ContextRuntimeModule {}
