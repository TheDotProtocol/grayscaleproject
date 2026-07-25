import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { ConnectorRegistryService } from "./connector-registry.service";
import { SyncOrchestratorService } from "./sync-orchestrator.service";
import { PluginRuntimeService } from "./plugin-runtime.service";
import { IntegrationHealthService } from "./integration-health.service";
import { IntegrationCostService } from "./integration-cost.service";
import { ConnectorSimulatorService } from "./connector-simulator.service";
import { CredentialVaultService } from "./credential-vault.service";
import { GITHUB_PLUGIN_MANIFEST } from "./github-plugin.manifest";
import { IntegrationsService } from "../integrations/integrations.service";
import type { ConnectorProviderId } from "@grayscale/platform";

@ApiTags("platform")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("companies/:companyId/platform")
export class PlatformIntegrationController {
  constructor(
    private readonly connectors: ConnectorRegistryService,
    private readonly sync: SyncOrchestratorService,
    private readonly plugins: PluginRuntimeService,
    private readonly health: IntegrationHealthService,
    private readonly cost: IntegrationCostService,
    private readonly simulator: ConnectorSimulatorService,
    private readonly vault: CredentialVaultService,
    private readonly integrations: IntegrationsService,
  ) {}

  @Get("connectors/status")
  connectorStatus() {
    return this.connectors.list();
  }

  @Get("integrations/health")
  integrationHealth(@Param("companyId") companyId: string) {
    return this.health.getCompanyHealth(companyId);
  }

  @Get("integrations/health/summary")
  healthSummary(@Param("companyId") companyId: string) {
    return this.health.aggregateSummary(companyId);
  }

  @Get("integrations/:provider/sync-status")
  async syncStatus(@Param("companyId") companyId: string, @Param("provider") provider: string) {
    const integration = await this.integrations.list(companyId);
    const match = integration.find((i) => i.provider === provider);
    const healthSnap = await this.health.getProviderHealth(companyId, provider as ConnectorProviderId);
    return {
      provider,
      connected: !!match,
      lastSyncAt: match?.lastSyncAt,
      health: healthSnap,
    };
  }

  @Get("integrations/:provider/auth-status")
  async authStatus(@Param("companyId") companyId: string, @Param("provider") provider: string) {
    const cred = await this.vault.retrieve(companyId, provider);
    return {
      provider,
      authenticated: !!cred,
      expiresAt: null,
    };
  }

  @Get("plugins/health")
  async pluginHealth(@Param("companyId") companyId: string) {
    const installed = await this.plugins.listInstalled(companyId);
    return Promise.all(
      installed.map(async (p) => ({
        pluginId: p.pluginId,
        state: p.state,
        ...(await this.plugins.healthCheck(companyId, p.pluginId)),
      })),
    );
  }

  @Get("integrations/cost")
  integrationCost(@Param("companyId") companyId: string) {
    return this.cost.getCompanyUsage(companyId);
  }

  @Get("plugins")
  listPlugins(@Param("companyId") companyId: string) {
    return this.plugins.listInstalled(companyId);
  }

  @Post("plugins/github/install")
  installGitHub(@Param("companyId") companyId: string) {
    return this.plugins.install(companyId, GITHUB_PLUGIN_MANIFEST);
  }

  @Post("integrations/github/connect")
  connectGitHub(
    @Param("companyId") companyId: string,
    @Body() body: { accessToken: string; owner: string; repo: string },
  ) {
    return this.integrations.connectGitHub(companyId, body);
  }

  @Post("integrations/:provider/sync")
  triggerSync(
    @Param("companyId") companyId: string,
    @Param("provider") provider: string,
  ) {
    return this.sync.enqueueSync(companyId, provider as ConnectorProviderId);
  }

  @Post("integrations/:provider/sync/inline")
  syncInline(
    @Param("companyId") companyId: string,
    @Param("provider") provider: string,
  ) {
    return this.sync.runSync(companyId, provider as ConnectorProviderId);
  }

  @Delete("integrations/:provider")
  disconnect(
    @Param("companyId") companyId: string,
    @Param("provider") provider: string,
  ) {
    return this.integrations.disconnect(companyId, provider);
  }

  @Get("simulator/:provider/fixtures")
  listFixtures(@Param("provider") provider: string) {
    return this.simulator.listFixtures(provider as ConnectorProviderId);
  }

  @Post("simulator/:provider/replay/:fixtureId")
  replayFixture(
    @Param("companyId") companyId: string,
    @Param("provider") provider: string,
    @Param("fixtureId") fixtureId: string,
  ) {
    return this.simulator.replayWebhook(companyId, provider as ConnectorProviderId, fixtureId);
  }
}
