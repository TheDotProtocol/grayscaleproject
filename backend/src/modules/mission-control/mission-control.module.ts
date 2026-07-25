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
  ],
  exports: [MissionControlService, PlatformServiceRegistryService, PlatformHealthService],
})
export class MissionControlModule {}
