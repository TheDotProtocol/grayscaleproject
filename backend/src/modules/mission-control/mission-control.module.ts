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
import { CouncilRuntimeModule } from "../council-runtime/council-runtime.module";
import { TwinRuntimeModule } from "../twin-runtime/twin-runtime.module";
import { ExecutiveNetworkModule } from "../executive-network/executive-network.module";
import { OrganizationalEvolutionModule } from "../organizational-evolution/organizational-evolution.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { MissionControlController } from "./mission-control.controller";
import { PlatformRegistryController } from "./platform-registry.controller";
import { FounderExperienceController } from "./founder-experience.controller";
import { MissionControlService } from "./mission-control.service";
import { PlatformRegistryModule } from "./platform-registry.module";
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
import { OrganizationalTimelineService } from "./organizational-timeline.service";
import { ActivityCenterService } from "./activity-center.service";
import { WorkspaceSessionsService } from "./workspace-sessions.service";
import { FounderPreferencesService } from "./founder-preferences.service";
import { NotificationCenterService } from "./notification-center.service";
import { AthenaWidgetDataService } from "./athena-widget-data.service";
import { CouncilWidgetDataService } from "./council-widget-data.service";
import { TwinWidgetDataService } from "./twin-widget-data.service";
import { ExecutiveNetworkWidgetDataService } from "./executive-network-widget-data.service";
import { EvolutionWidgetDataService } from "./evolution-widget-data.service";

@Module({
  imports: [
    PlatformRegistryModule,
    PrismaModule,
    forwardRef(() => EventsModule),
    PulseModule,
    MemoryModule,
    GraphModule,
    forwardRef(() => IntelligenceModule),
    IntegrationPlatformModule,
    TimelineModule,
    BillingModule,
    forwardRef(() => ContextRuntimeModule),
    AthenaModule,
    ExecutiveModule,
    ExecutiveNotebookModule,
    ExecutiveCuriosityModule,
    ExecutiveSkepticModule,
    ExecutiveComplianceModule,
    CouncilRuntimeModule,
    TwinRuntimeModule,
    ExecutiveNetworkModule,
    OrganizationalEvolutionModule,
    NotificationsModule,
    BullModule.registerQueue({ name: PLATFORM_JOBS_QUEUE }),
    forwardRef(() => PlatformOperationsModule),
  ],
  controllers: [MissionControlController, PlatformRegistryController, FounderExperienceController],
  providers: [
    MissionControlService,
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
    OrganizationalTimelineService,
    ActivityCenterService,
    WorkspaceSessionsService,
    FounderPreferencesService,
    NotificationCenterService,
    AthenaWidgetDataService,
    CouncilWidgetDataService,
    TwinWidgetDataService,
    ExecutiveNetworkWidgetDataService,
    EvolutionWidgetDataService,
  ],
  exports: [MissionControlService, PlatformRegistryModule, PlatformHealthService],
})
export class MissionControlModule {}
