/** Platform Cost Observatory — AIP-37 */

export interface CostLine {
  estimatedCents: number;
  usageUnits: number;
  unit: string;
  trend: "stable" | "increasing" | "decreasing";
}

export interface PlatformCostBreakdown {
  period: string;
  categories: {
    database: CostLine;
    queues: CostLine;
    workers: CostLine;
    storage: CostLine;
    bandwidth: CostLine;
    aiUsage: CostLine;
    connectors: CostLine;
    plugins: CostLine;
    infrastructure: CostLine;
  };
  totalEstimatedCents: number;
  computedAt: string;
}

export interface PlatformCostPort {
  compute(period?: string): Promise<PlatformCostBreakdown>;
}
