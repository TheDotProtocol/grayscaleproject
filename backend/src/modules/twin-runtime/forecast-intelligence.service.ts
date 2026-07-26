import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { EventsService } from "../events/events.service";
import type { ForecastExplanation, ForecastIntelligencePort, TwinForecast } from "@grayscale/platform";
import { TwinStoreService } from "./twin-store.service";
import { OrganizationalTwinService } from "./organizational-twin.service";

@Injectable()
export class ForecastIntelligenceService implements ForecastIntelligencePort {
  constructor(
    private readonly store: TwinStoreService,
    @Inject(forwardRef(() => OrganizationalTwinService))
    private readonly twin: OrganizationalTwinService,
    private readonly events: EventsService,
  ) {}

  async generate(input: {
    companyId: string;
    twinVersionId: string;
    horizonDays: number;
    correlationId?: string;
  }): Promise<TwinForecast> {
    const correlationId = input.correlationId ?? crypto.randomUUID();
    const twin = this.store.twins.get(input.companyId) ?? (await this.twin.assemble(input.companyId, { correlationId }));
    const forecastId = this.store.newId("fcst");

    const forecast: TwinForecast = {
      forecastId,
      companyId: input.companyId,
      twinVersionId: input.twinVersionId,
      horizonDays: input.horizonDays,
      status: "published",
      confidence: {
        overall: twin.confidence.overall * 0.85,
        evidence: twin.confidence.evidence,
        temporal: twin.confidence.temporal,
        signal: twin.signalView.signalCount > 0 ? 0.7 : 0.4,
      },
      explanation: {
        forecastId,
        summary: `${input.horizonDays}-day organizational forecast — hypothesis only`,
        assumptions: [
          { id: "a1", label: "Current operating mode persists", confidence: 0.7 },
          { id: "a2", label: "No major external shocks", confidence: 0.6 },
        ],
        evidence: twin.evidence.map((e) => ({ evidenceId: e.evidenceId, source: e.source, summary: e.summary, weight: 0.5 })),
        alternatives: [
          { alternativeId: "alt1", label: "Accelerated growth", probability: 0.25, outcome: "Higher resource demand" },
          { alternativeId: "alt2", label: "Conservative path", probability: 0.35, outcome: "Stable operations" },
        ],
        dependencies: [
          { id: "dep-twin", label: "Living Organizational Twin", source: "twin", required: true },
          { id: "dep-temporal", label: "Temporal Intelligence", source: "temporal", required: true },
        ],
        unknowns: ["Market timing", "Regulatory shifts"],
        isHypothesis: true,
        overwritesReality: false,
      },
      projectedMetrics: {
        goalCompletion: twin.strategyView.activeGoals,
        riskExposure: twin.strategyView.criticalRisks,
        attentionSaturation: twin.attention ? 0.5 : 0.3,
      },
      generatedAt: new Date().toISOString(),
    };

    this.store.forecasts.set(forecastId, forecast);
    await this.events.publish("forecast.generated", input.companyId, { forecastId }, { correlationId });
    return forecast;
  }

  async validate(forecastId: string, actual: Record<string, unknown>): Promise<{ valid: boolean; variance: number }> {
    const forecast = this.store.forecasts.get(forecastId);
    if (!forecast) throw new Error("Forecast not found");
    const predicted = forecast.projectedMetrics.goalCompletion ?? 0;
    const actualVal = typeof actual.goalCompletion === "number" ? actual.goalCompletion : 0;
    const variance = Math.abs(predicted - actualVal);
    forecast.status = variance < 2 ? "validated" : "invalidated";
    this.store.forecasts.set(forecastId, forecast);
    return { valid: variance < 2, variance };
  }

  async supersede(forecastId: string, reason: string): Promise<TwinForecast> {
    const old = this.store.forecasts.get(forecastId);
    if (!old) throw new Error("Forecast not found");
    old.status = "superseded";
    const next = await this.generate({
      companyId: old.companyId,
      twinVersionId: old.twinVersionId,
      horizonDays: old.horizonDays,
    });
    old.supersededBy = next.forecastId;
    this.store.forecasts.set(forecastId, old);
    await this.events.publish("forecast.superseded", old.companyId, { reason, nextId: next.forecastId }, { correlationId: forecastId });
    return next;
  }

  async list(companyId: string): Promise<TwinForecast[]> {
    return [...this.store.forecasts.values()].filter((f) => f.companyId === companyId);
  }

  async explain(forecastId: string): Promise<ForecastExplanation> {
    const forecast = this.store.forecasts.get(forecastId);
    if (!forecast) throw new Error("Forecast not found");
    return forecast.explanation;
  }
}
