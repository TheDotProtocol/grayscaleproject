import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { PLUGIN_HOOKS } from "@grayscale/shared";
import { PrismaService } from "../../prisma/prisma.service";
import { EventsService } from "../events/events.service";
import { PluginsService } from "../plugins/plugins.service";
import { ConnectorRegistryService } from "./connector-registry.service";
import { CredentialVaultService } from "./credential-vault.service";
import { NormalizationService } from "./normalization.service";
import { IdempotencyService } from "./idempotency.service";
import { IntegrationHealthService } from "./integration-health.service";
import { IntegrationCostService } from "./integration-cost.service";
import type { ConnectorProviderId, RawProviderPayload, ConnectionContext } from "@grayscale/platform";

export const SYNC_QUEUE = "integration-sync";

@Injectable()
export class SyncOrchestratorService {
  private readonly logger = new Logger(SyncOrchestratorService.name);

  constructor(
    @InjectQueue(SYNC_QUEUE) private readonly queue: Queue,
    private readonly prisma: PrismaService,
    private readonly events: EventsService,
    private readonly plugins: PluginsService,
    private readonly connectors: ConnectorRegistryService,
    private readonly vault: CredentialVaultService,
    private readonly normalization: NormalizationService,
    private readonly idempotency: IdempotencyService,
    private readonly health: IntegrationHealthService,
    private readonly cost: IntegrationCostService,
  ) {}

  async enqueueSync(companyId: string, provider: ConnectorProviderId, pluginId = `io.grayscale.${provider}`) {
    const job = await this.queue.add(
      "sync",
      { companyId, provider, pluginId },
      { removeOnComplete: 100, attempts: 3, backoff: { type: "exponential", delay: 2000 } },
    );

    await this.prisma.pluginSyncJob.create({
      data: { companyId, pluginId, provider, status: "pending" },
    });

    return { jobId: job.id, status: "queued" };
  }

  async runSync(companyId: string, provider: ConnectorProviderId): Promise<{ imported: number; skipped: number }> {
    const connector = this.connectors.get(provider);
    if (!connector) throw new NotFoundException(`Connector not found: ${provider}`);

    const integration = await this.prisma.integration.findUnique({
      where: { companyId_provider: { companyId, provider } },
    });
    if (!integration) throw new NotFoundException("Integration not connected");

    const secrets = await this.vault.retrieve(companyId, provider);
    const accessToken =
      (secrets?.accessToken as string) ?? integration.accessToken ?? undefined;

    const ctx: ConnectionContext = {
      companyId,
      providerId: provider,
      credentials: { accessToken },
      config: (integration.config ?? {}) as Record<string, unknown>,
    };

    const health = await connector.healthCheck(ctx);
    await this.health.record({
      companyId,
      providerId: provider,
      state: health.state,
      message: health.message,
      authStatus: health.state === "authentication_failed" ? "expired" : "valid",
      webhookStatus: "inactive",
    });

    if (health.state === "authentication_failed" || health.state === "configuration_error") {
      throw new Error(health.message ?? "Connector unhealthy");
    }

    const payloads = await connector.fetchResources(ctx, { resourceType: "commits", limit: 10 });
    await this.cost.recordUsage({ companyId, providerId: provider, apiRequests: 1 });

    return this.processPayloads(companyId, provider, payloads);
  }

  async processPayloads(companyId: string, provider: ConnectorProviderId, payloads: RawProviderPayload[]) {
    let imported = 0;
    let skipped = 0;

    for (const raw of payloads) {
      const result = this.normalization.normalize(raw, companyId);

      if (await this.idempotency.isEntityDuplicate(companyId, result.entity.idempotencyKey)) {
        skipped++;
        continue;
      }

      const { isDuplicate } = await this.idempotency.checkAndSet(companyId, result.entity.idempotencyKey);
      if (isDuplicate) {
        skipped++;
        continue;
      }

      const record = await this.prisma.normalizedEntityRecord.create({
        data: {
          companyId,
          entityType: result.entity.entityType,
          sourceProvider: result.entity.sourceProvider,
          sourceId: result.entity.sourceId,
          payloadHash: result.entity.rawPayloadHash,
          idempotencyKey: result.entity.idempotencyKey,
          displayName: result.entity.displayName,
          summary: result.entity.summary,
          occurredAt: new Date(result.entity.occurredAt),
          metadata: result.entity.metadata as object,
        },
      });

      await this.events.publish(result.platformEventType, companyId, {
        ...result.platformEventPayload,
        normalizedEntityId: record.id,
      }, { source: "integration-platform" });

      imported++;
    }

    await this.prisma.integration.updateMany({
      where: { companyId, provider },
      data: { lastSyncAt: new Date() },
    });

    await this.events.publish("integration.sync.completed", companyId, {
      provider,
      imported,
      skipped,
    }, { source: "integration-platform" });

    await this.plugins.dispatch(PLUGIN_HOOKS.ON_INTEGRATION_SYNC, { companyId, provider, imported, skipped });

    await this.health.record({
      companyId,
      providerId: provider,
      state: "healthy",
      authStatus: "valid",
      lastSyncAt: new Date().toISOString(),
      webhookStatus: "inactive",
    });

    this.logger.log(`Sync ${provider} company=${companyId} imported=${imported} skipped=${skipped}`);
    return { imported, skipped };
  }
}
