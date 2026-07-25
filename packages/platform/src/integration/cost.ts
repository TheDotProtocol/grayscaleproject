/** Integration Cost Monitor — AIP-24 */

export interface IntegrationCostSnapshot {
  companyId: string;
  providerId: string;
  period: string;
  apiRequests: number;
  rateLimitHits: number;
  monthlyUsageUnits: number;
  estimatedCostCents: number;
  bandwidthBytes: number;
  storageBytes: number;
  recordedAt: string;
}

export interface IntegrationCostMonitorPort {
  recordUsage(input: {
    companyId: string;
    providerId: string;
    apiRequests?: number;
    rateLimitHits?: number;
    bandwidthBytes?: number;
    storageBytes?: number;
    estimatedCostCents?: number;
  }): Promise<IntegrationCostSnapshot>;
  getUsage(companyId: string, providerId: string, period?: string): Promise<IntegrationCostSnapshot | null>;
  getCompanyUsage(companyId: string, period?: string): Promise<IntegrationCostSnapshot[]>;
}
