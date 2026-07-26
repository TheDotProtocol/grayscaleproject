import { Injectable } from "@nestjs/common";
import type { SignalCorrelationSnapshot } from "@grayscale/platform";
import { SIGNAL_CORRELATION_VERSION } from "@grayscale/platform";
import { OrganizationalSignalBusService } from "./organizational-signal-bus.service";

/** Deterministic signal correlation — contracts only, no LLM logic */
@Injectable()
export class SignalCorrelationService {
  constructor(private readonly signals: OrganizationalSignalBusService) {}

  async correlate(companyId: string): Promise<SignalCorrelationSnapshot> {
    const snapshot = await this.signals.getSnapshot(companyId);
    const active = snapshot.activeSignals;

    const criticalSignals = active.filter((s) => s.magnitude >= 0.7);
    const weakSignals = active.filter((s) => s.magnitude < 0.3);
    const emergingSignals = active.filter((s) => !s.consumed && s.magnitude >= 0.3 && s.magnitude < 0.7);

    const domains = [...new Set(active.map((s) => s.sourceEngineId))];
    const correlations = domains.length > 1
      ? [{
          id: `corr-${companyId}`,
          companyId,
          signalIds: active.slice(0, 5).map((s) => s.id),
          correlationScore: 0.6,
          crossDomain: true,
          domains,
          detectedAt: new Date().toISOString(),
        }]
      : [];

    return {
      companyId,
      assembledAt: new Date().toISOString(),
      version: SIGNAL_CORRELATION_VERSION,
      clusters: [],
      cascades: [],
      correlations,
      priorities: active.map((s, i) => ({
        signalId: s.id,
        rank: i + 1,
        urgency: s.magnitude,
        importance: s.magnitude,
        freshness: 1,
      })),
      weakSignals,
      emergingSignals,
      criticalSignals,
      blindSpots: active.length === 0 ? ["no_active_signals"] : [],
    };
  }
}
