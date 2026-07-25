import { Module, forwardRef } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { IntelligenceModule } from "../intelligence/intelligence.module";
import { GraphModule } from "../graph/graph.module";
import { MemoryIndexModule } from "../memory/memory-index.module";
import { PulseModule } from "../pulse/pulse.module";
import { PluginsModule } from "../plugins/plugins.module";
import { EventsModule } from "../events/events.module";
import { CompanyContextService } from "./company-context.service";
import { CapabilityRegistryService } from "./capability-registry.service";
import { PermissionService } from "./permission.service";
import { ExecutiveAuditService } from "./executive-audit.service";
import { ExecutiveBusService } from "./executive-bus.service";
import { ExecutiveInboxService } from "./executive-inbox.service";
import { ExecutiveLifecycleService } from "./executive-lifecycle.service";
import { ExecutiveRuntimeService } from "./executive-runtime.service";
import { ExecutiveController } from "./executive.controller";

@Module({
  imports: [
    PrismaModule,
    IntelligenceModule,
    GraphModule,
    MemoryIndexModule,
    PulseModule,
    PluginsModule,
    forwardRef(() => EventsModule),
  ],
  controllers: [ExecutiveController],
  providers: [
    CompanyContextService,
    CapabilityRegistryService,
    PermissionService,
    ExecutiveAuditService,
    ExecutiveBusService,
    ExecutiveInboxService,
    ExecutiveLifecycleService,
    ExecutiveRuntimeService,
  ],
  exports: [
    CompanyContextService,
    ExecutiveRuntimeService,
    ExecutiveBusService,
    ExecutiveAuditService,
  ],
})
export class ExecutiveModule {}
