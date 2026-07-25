import type { RawProviderPayload, ConnectorProviderId } from "./connector.js";

/** Connector Simulator — AIP-25 deterministic testing */

export interface SimulatedWebhook {
  id: string;
  providerId: ConnectorProviderId;
  name: string;
  headers: Record<string, string>;
  body: unknown;
  description?: string;
}

export interface ConnectorSimulatorPort {
  listFixtures(providerId: ConnectorProviderId): SimulatedWebhook[];
  replayWebhook(companyId: string, providerId: ConnectorProviderId, fixtureId: string): Promise<RawProviderPayload[]>;
  injectEvent(companyId: string, providerId: ConnectorProviderId, payload: RawProviderPayload): Promise<void>;
}
