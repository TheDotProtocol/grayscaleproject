/** Forecast Intelligence — contracts (Sprint 3 Phase D, ADR-041) */

export const FORECAST_ENGINE_VERSION = "1.1.0";

export type ForecastStatus = "draft" | "published" | "superseded" | "validated" | "invalidated";

export interface ForecastAssumption {
  id: string;
  label: string;
  confidence: number;
}

export interface ForecastEvidence {
  evidenceId: string;
  source: string;
  summary: string;
  weight: number;
}

export interface ForecastAlternative {
  alternativeId: string;
  label: string;
  probability: number;
  outcome: string;
}

export interface ForecastDependency {
  id: string;
  label: string;
  source: "twin" | "foresight" | "alignment" | "decision-economy" | "antifragility" | "temporal" | "simulation";
  required: boolean;
}

export interface ForecastConfidence {
  overall: number;
  evidence: number;
  temporal: number;
  signal: number;
  foresight?: number;
  alignment?: number;
}

export interface ForecastExplanation {
  forecastId: string;
  summary: string;
  assumptions: ForecastAssumption[];
  evidence: ForecastEvidence[];
  alternatives: ForecastAlternative[];
  dependencies: ForecastDependency[];
  unknowns: string[];
  isHypothesis: true;
  overwritesReality: false;
}

/** TwinForecast — constitutional forecast attached to twin */
export interface TwinForecast {
  forecastId: string;
  companyId: string;
  twinVersionId: string;
  horizonDays: number;
  status: ForecastStatus;
  confidence: ForecastConfidence;
  explanation: ForecastExplanation;
  projectedMetrics: Record<string, number>;
  generatedAt: string;
  supersededBy?: string;
}

export interface ForecastContextSnapshot {
  companyId: string;
  assembledAt: string;
  version: string;
  latestForecasts: TwinForecast[];
  aggregateConfidence: number;
  hypothesisCount: number;
}

export interface ForecastIntelligencePort {
  generate(input: {
    companyId: string;
    twinVersionId: string;
    horizonDays: number;
    correlationId?: string;
  }): Promise<TwinForecast>;
  validate(forecastId: string, actual: Record<string, unknown>): Promise<{ valid: boolean; variance: number }>;
  supersede(forecastId: string, reason: string): Promise<TwinForecast>;
  list(companyId: string): Promise<TwinForecast[]>;
  explain(forecastId: string): Promise<ForecastExplanation>;
}

export interface ForecastContextPort {
  assemble(companyId: string): Promise<ForecastContextSnapshot>;
}
