import { Inject, Injectable, forwardRef } from "@nestjs/common";
import type { ForecastContextSnapshot } from "@grayscale/platform";
import { FORECAST_ENGINE_VERSION } from "@grayscale/platform";
import { ForecastIntelligenceService } from "../twin-runtime/forecast-intelligence.service";

/** Assembles forecast context for CompanyContext — no duplicate storage */
@Injectable()
export class ForecastContextService {
  constructor(
    @Inject(forwardRef(() => ForecastIntelligenceService))
    private readonly forecast: ForecastIntelligenceService,
  ) {}

  async assemble(companyId: string): Promise<ForecastContextSnapshot> {
    const latestForecasts = await this.forecast.list(companyId);
    const aggregateConfidence =
      latestForecasts.length > 0
        ? latestForecasts.reduce((s, f) => s + f.confidence.overall, 0) / latestForecasts.length
        : 0;

    return {
      companyId,
      assembledAt: new Date().toISOString(),
      version: FORECAST_ENGINE_VERSION,
      latestForecasts: latestForecasts.slice(0, 5),
      aggregateConfidence,
      hypothesisCount: latestForecasts.filter((f) => f.status === "published").length,
    };
  }
}
