import { Module, forwardRef } from "@nestjs/common";
import { ContextRuntimeModule } from "../context-runtime/context-runtime.module";
import { EventsModule } from "../events/events.module";
import { RuntimeStoreService } from "./runtime-store.service";
import { RuntimeSchedulerService } from "./runtime-scheduler.service";
import { RuntimeHeartbeatService } from "./runtime-heartbeat.service";
import { RuntimeExplainabilityService } from "./runtime-explainability.service";
import { RuntimeResourceManagerService } from "./runtime-resource-manager.service";
import { RuntimeCoordinatorService } from "./runtime-coordinator.service";
import { RuntimeCertificationService } from "./runtime-certification.service";
import { RuntimeContextService } from "./runtime-context.service";
import { RuntimeController } from "./runtime.controller";

@Module({
  imports: [forwardRef(() => ContextRuntimeModule), forwardRef(() => EventsModule)],
  controllers: [RuntimeController],
  providers: [
    RuntimeStoreService,
    RuntimeSchedulerService,
    RuntimeHeartbeatService,
    RuntimeExplainabilityService,
    RuntimeResourceManagerService,
    RuntimeCoordinatorService,
    RuntimeCertificationService,
    RuntimeContextService,
  ],
  exports: [RuntimeCoordinatorService, RuntimeContextService, RuntimeCertificationService, RuntimeHeartbeatService, RuntimeSchedulerService],
})
export class OrganizationalRuntimeModule {}
