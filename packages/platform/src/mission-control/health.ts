/** Platform Health Framework — AIP-27 */

export const SERVICE_HEALTH_STATES = [
  "healthy",
  "degraded",
  "unhealthy",
  "unknown",
] as const;

export type ServiceHealthState = (typeof SERVICE_HEALTH_STATES)[number];

export interface ServiceHealthReport {
  serviceId: string;
  health: ServiceHealthState;
  availability: number;
  readiness: boolean;
  latencyMs: number;
  errorRate: number;
  warningCount: number;
  coverage?: number;
  costCents?: number;
  lastSuccessfulRun?: string;
  lastFailure?: string;
  uptime: number;
  warnings: string[];
  errors: string[];
  checkedAt: string;
}

export interface PlatformHealthSnapshot {
  companyId: string;
  score: number;
  status: "healthy" | "attention" | "critical";
  services: ServiceHealthReport[];
  breakdown: {
    availability: number;
    integration: number;
    pulse: number;
    readiness: number;
    errorDensity: number;
  };
  computedAt: string;
}

export interface PlatformHealthPort {
  probeService(serviceId: string, companyId?: string): Promise<ServiceHealthReport>;
  computePlatformHealth(companyId: string): Promise<PlatformHealthSnapshot>;
}
