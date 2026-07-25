import { Injectable } from "@nestjs/common";
import type { ConnectorSimulatorPort, SimulatedWebhook, ConnectorProviderId, RawProviderPayload } from "@grayscale/platform";
import { NormalizationService } from "./normalization.service";
import { SyncOrchestratorService } from "./sync-orchestrator.service";

/** AIP-25 Connector Simulator */
@Injectable()
export class ConnectorSimulatorService implements ConnectorSimulatorPort {
  private readonly fixtures: SimulatedWebhook[] = [
    {
      id: "github-push",
      providerId: "github",
      name: "GitHub Push Event",
      headers: { "x-github-event": "push" },
      body: {
        sha: "simulated-sha-001",
        commit: {
          message: "Simulated commit for testing",
          author: { date: new Date().toISOString() },
        },
        html_url: "https://github.com/example/repo/commit/simulated-sha-001",
      },
      description: "Simulated GitHub push webhook",
    },
  ];

  constructor(
    private readonly normalization: NormalizationService,
    private readonly sync: SyncOrchestratorService,
  ) {}

  listFixtures(providerId: ConnectorProviderId): SimulatedWebhook[] {
    return this.fixtures.filter((f) => f.providerId === providerId);
  }

  async replayWebhook(companyId: string, providerId: ConnectorProviderId, fixtureId: string): Promise<RawProviderPayload[]> {
    const fixture = this.fixtures.find((f) => f.id === fixtureId && f.providerId === providerId);
    if (!fixture) return [];

    const payload: RawProviderPayload = {
      providerId,
      resourceType: "commits",
      sourceId: (fixture.body as { sha: string }).sha,
      sourceUrl: (fixture.body as { html_url: string }).html_url,
      fetchedAt: new Date().toISOString(),
      payload: fixture.body,
      payloadHash: `sim:${fixtureId}`,
    };

    await this.sync.processPayloads(companyId, providerId, [payload]);
    return [payload];
  }

  async injectEvent(companyId: string, providerId: ConnectorProviderId, payload: RawProviderPayload): Promise<void> {
    void providerId;
    await this.sync.processPayloads(companyId, payload.providerId, [payload]);
  }
}
