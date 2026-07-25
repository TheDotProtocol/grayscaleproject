/** Reliability Framework — AIP-33 */

export interface ServiceSla {
  availabilityTarget: number;
  latencyP95Ms: number;
  errorRateMax: number;
}

export interface ServiceSlo {
  availability: number;
  latencyP95Ms: number;
  errorRate: number;
}

export interface ErrorBudget {
  total: number;
  consumed: number;
  remaining: number;
  burnRate: number;
}

export interface RecoveryTargets {
  rtoMinutes: number;
  rpoMinutes: number;
  lastRecoveryAt?: string;
}

export interface ServiceReliabilityProfile {
  serviceId: string;
  sla: ServiceSla;
  slo: ServiceSlo;
  errorBudget: ErrorBudget;
  recovery: RecoveryTargets;
  window: "1h" | "24h" | "7d" | "30d";
  computedAt: string;
}

export interface ReliabilityPort {
  computeProfile(serviceId: string, window?: string): Promise<ServiceReliabilityProfile>;
  computeAll(window?: string): Promise<ServiceReliabilityProfile[]>;
}
