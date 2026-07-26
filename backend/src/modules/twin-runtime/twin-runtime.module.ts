import { Module, forwardRef } from "@nestjs/common";
import { EventsModule } from "../events/events.module";
import { ContextRuntimeModule } from "../context-runtime/context-runtime.module";
import { TwinStoreService } from "./twin-store.service";
import { OrganizationalTwinService } from "./organizational-twin.service";
import { SimulationSessionService } from "./simulation-session.service";
import { ForecastIntelligenceService } from "./forecast-intelligence.service";
import { TwinCertificationService } from "./twin-certification.service";
import { TwinRuntimeController } from "./twin-runtime.controller";

@Module({
  imports: [EventsModule, forwardRef(() => ContextRuntimeModule)],
  controllers: [TwinRuntimeController],
  providers: [
    TwinStoreService,
    OrganizationalTwinService,
    SimulationSessionService,
    ForecastIntelligenceService,
    TwinCertificationService,
  ],
  exports: [OrganizationalTwinService, SimulationSessionService, ForecastIntelligenceService, TwinCertificationService, TwinStoreService],
})
export class TwinRuntimeModule {}
