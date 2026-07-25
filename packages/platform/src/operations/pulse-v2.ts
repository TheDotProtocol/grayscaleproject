/** Pulse Engine v2 — multi-domain pulse */

export const PULSE_DOMAINS = [
  "engineering",
  "business",
  "financial",
  "operational",
  "infrastructure",
  "security",
  "innovation",
  "founder",
] as const;

export type PulseDomain = (typeof PULSE_DOMAINS)[number];

export interface DomainPulseHealth {
  domain: PulseDomain;
  score: number;
  status: "healthy" | "attention" | "critical";
  eventCount24h: number;
  lastEventAt?: string;
}

export interface PlatformPulseAggregate {
  overallScore: number;
  status: "healthy" | "attention" | "critical";
  domains: DomainPulseHealth[];
  computedAt: string;
}

export interface PulseV2Port {
  aggregateDomains(companyId: string): Promise<PlatformPulseAggregate>;
}
