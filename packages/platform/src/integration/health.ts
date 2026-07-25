import type { ConnectorHealthState, ConnectorProviderId } from "./connector.js";

/** Integration Health Engine — AIP-23 */

export interface IntegrationHealthSnapshot {
  companyId: string;
  providerId: ConnectorProviderId;
  pluginId?: string;
  state: ConnectorHealthState;
  message?: string;
  authStatus: "valid" | "expired" | "missing" | "refresh_needed";
  lastSyncAt?: string;
  nextSyncAt?: string;
  syncDelayMinutes?: number;
  webhookStatus: "active" | "inactive" | "failed";
  recordedAt: string;
}

export interface IntegrationHealthEnginePort {
  record(snapshot: Omit<IntegrationHealthSnapshot, "recordedAt">): Promise<IntegrationHealthSnapshot>;
  getProviderHealth(companyId: string, providerId: ConnectorProviderId): Promise<IntegrationHealthSnapshot | null>;
  getCompanyHealth(companyId: string): Promise<IntegrationHealthSnapshot[]>;
  aggregateSummary(companyId: string): Promise<{
    healthy: number;
    warning: number;
    critical: number;
    states: Record<ConnectorHealthState, number>;
  }>;
}
