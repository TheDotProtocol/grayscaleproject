import { Module, forwardRef } from "@nestjs/common";
import { PlatformOperationsModule } from "../platform-operations/platform-operations.module";
import { BullModule } from "@nestjs/bullmq";
import { PrismaModule } from "../../prisma/prisma.module";
import { EventsModule } from "../events/events.module";
import { PulseModule } from "../pulse/pulse.module";
import { MemoryModule } from "../memory/memory.module";
import { GraphModule } from "../graph/graph.module";
import { IntelligenceModule } from "../intelligence/intelligence.module";
import { IntegrationPlatformModule } from "../integration-platform/integration-platform.module";
import { TimelineModule } from "../timeline/timeline.module";
import { BillingModule } from "../billing/billing.module";
import { ContextRuntimeModule } from "../context-runtime/context-runtime.module";
import { AthenaModule } from "../athena/athena.module";
import { ExecutiveModule } from "../executive/executive.module";
import { ExecutiveNotebookModule } from "../executive-notebook/executive-notebook.module";
import { ExecutiveCuriosityModule } from "../executive-curiosity/executive-curiosity.module";
import { ExecutiveSkepticModule } from "../executive-skeptic/executive-skeptic.module";
import { ExecutiveComplianceModule } from "../executive-compliance/executive-compliance.module";
import { MissionControlController } from "./mission-control.controller";
import { PlatformRegistryController } from "./platform-registry.controller";
import { MissionControlService } from "./mission-control.service";
import { PlatformServiceRegistryService } from "./platform-service-registry.service";
import { CapabilityDiscoveryService } from "./capability-discovery.service";
import { PlatformHealthService } from "./platform-health.service";
import { WidgetCatalogService } from "./widget-catalog.service";
import { WidgetDataService } from "./widget-data.service";
import { ActionRegistryService } from "./action-registry.service";
import { ActionDispatcherService, PLATFORM_JOBS_QUEUE } from "./action-dispatcher.service";
import { ActionProcessor } from "./action.processor";
import { ReadinessScoringService } from "./readiness-scoring.service";
import { FounderBriefService } from "./founder-brief.service";
import { OperationalTimelineService } from "./operational-timeline.service";
import { GlobalSearchService } from "./global-search.service";
import { QuickActionsService } from "./quick-actions.service";
import { AthenaWidgetDataService } from "./athena-widget-data.service";

@Module({
  imports: [
    PrismaModule,
    EventsModule,
    PulseModule,
    MemoryModule,
    GraphModule,
    IntelligenceModule,
    IntegrationPlatformModule,
    TimelineModule,
    BillingModule,
    ContextRuntimeModule,
    AthenaModule,
    ExecutiveModule,
    ExecutiveNotebookModule,
    ExecutiveCuriosityModule,
    ExecutiveSkepticModule,
    ExecutiveComplianceModule,
    BullModule.registerQueue({ name: PLATFORM_JOBS_QUEUE }),
    forwardRef(() => PlatformOperationsModule),
  ],
  controllers: [MissionControlController, PlatformRegistryController],
  providers: [
    MissionControlService,
    PlatformServiceRegistryService,
    CapabilityDiscoveryService,
    PlatformHealthService,
    WidgetCatalogService,
    WidgetDataService,
    ActionRegistryService,
    ActionDispatcherService,
    ActionProcessor,
    ReadinessScoringService,
    FounderBriefService,
    OperationalTimelineService,
    GlobalSearchService,
    QuickActionsService,
    AthenaWidgetDataService,
  ],
  exports: [MissionControlService, PlatformServiceRegistryService, PlatformHealthService],
})
export class MissionControlModule {}
