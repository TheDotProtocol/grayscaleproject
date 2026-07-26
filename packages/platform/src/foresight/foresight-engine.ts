/** Organizational Foresight Engine — contracts (Sprint 3 Phase D) */

export const FORESIGHT_ENGINE_VERSION = "1.0.0";

export interface ForesightMetricDetail {
  value: number;
  reason: string;
  confidence: number;
  evidence: string[];
  trend: "rising" | "stable" | "falling" | "emerging";
  history: Array<{ recordedAt: string; value: number }>;
}

export interface WeakSignalDetection extends ForesightMetricDetail {
  signalIds: string[];
  domains: string[];
}

export interface TrendEmergence extends ForesightMetricDetail {
  trendLabel: string;
  domains: string[];
}

export interface StrategicDrift extends ForesightMetricDetail {
  declaredThemes: string[];
  emergingThemes: string[];
  driftScore: number;
}

export interface OpportunityWindow extends ForesightMetricDetail {
  windowLabel: string;
  estimatedDays: number;
}

export interface CompetitiveMovement extends ForesightMetricDetail {
  indicators: string[];
}

export interface CapabilityEvolution extends ForesightMetricDetail {
  domains: string[];
}

export interface FounderBlindSpot extends ForesightMetricDetail {
  blindSpotAreas: string[];
}

export interface MarketPattern extends ForesightMetricDetail {
  patternLabel: string;
}

export interface OrganizationalMomentum extends ForesightMetricDetail {
  direction: "accelerating" | "stable" | "decelerating";
}

export interface ChangeVelocity extends ForesightMetricDetail {
  rate: number;
  periodDays: number;
}

export interface EarlyWarningIndicator {
  id: string;
  label: string;
  severity: "low" | "moderate" | "high";
  evidence: string[];
  detectedAt: string;
}

export interface ForesightConfidence {
  overall: number;
  evidenceWeight: number;
  signalCoverage: number;
}

export interface OrganizationalForesight {
  companyId: string;
  assembledAt: string;
  version: string;
  weakSignals: WeakSignalDetection;
  trendEmergence: TrendEmergence;
  strategicDrift: StrategicDrift;
  opportunityWindows: OpportunityWindow[];
  competitiveMovement: CompetitiveMovement;
  capabilityEvolution: CapabilityEvolution;
  founderBlindSpots: FounderBlindSpot;
  marketPatterns: MarketPattern[];
  organizationalMomentum: OrganizationalMomentum;
  changeVelocity: ChangeVelocity;
  earlyWarnings: EarlyWarningIndicator[];
  confidence: ForesightConfidence;
}

export interface OrganizationalForesightPort {
  assemble(companyId: string): Promise<OrganizationalForesight>;
}
