import { Module, forwardRef } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { PrismaModule } from "../../prisma/prisma.module";
import { EventsModule } from "../events/events.module";
import { PluginsModule } from "../plugins/plugins.module";
import { IntegrationsModule } from "../integrations/integrations.module";
import { CredentialVaultService } from "./credential-vault.service";
import { ConnectorRegistryService } from "./connector-registry.service";
import { NormalizationService } from "./normalization.service";
import { IdempotencyService } from "./idempotency.service";
import { IntegrationHealthService } from "./integration-health.service";
import { IntegrationCostService } from "./integration-cost.service";
import { SandboxGateService } from "./sandbox-gate.service";
import { SyncOrchestratorService, SYNC_QUEUE } from "./sync-orchestrator.service";
import { SyncProcessor } from "./sync.processor";
import { PluginRuntimeService } from "./plugin-runtime.service";
import { ConnectorSimulatorService } from "./connector-simulator.service";
import { PlatformIntegrationController } from "./platform-integration.controller";
import { CredentialMigrationService } from "./credential-migration.service";

@Module({
  imports: [
    PrismaModule,
    PluginsModule,
    IntegrationsModule,
    forwardRef(() => EventsModule),
    BullModule.registerQueue({ name: SYNC_QUEUE }),
  ],
  controllers: [PlatformIntegrationController],
  providers: [
    ConnectorRegistryService,
    NormalizationService,
    IdempotencyService,
    IntegrationHealthService,
    IntegrationCostService,
    SandboxGateService,
    SyncOrchestratorService,
    SyncProcessor,
    PluginRuntimeService,
    ConnectorSimulatorService,
    CredentialMigrationService,
  ],
  exports: [
    ConnectorRegistryService,
    SyncOrchestratorService,
    PluginRuntimeService,
    IntegrationHealthService,
    IntegrationCostService,
  ],
})
export class IntegrationPlatformModule {}
