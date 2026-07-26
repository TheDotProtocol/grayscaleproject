import { Injectable } from "@nestjs/common";
import type {
  TwinLearning,
  TwinReplayEvent,
  TwinSnapshot,
  TwinTimelineEntry,
  TwinVersion,
  OrganizationalTwin,
  SimulationSession,
  TwinForecast,
} from "@grayscale/platform";

/** In-memory twin state — event-sourced via EventsService (Phase C) */
@Injectable()
export class TwinStoreService {
  readonly versions = new Map<string, TwinVersion>();
  readonly snapshots = new Map<string, TwinSnapshot>();
  readonly timeline = new Map<string, TwinTimelineEntry>();
  readonly replayEvents = new Map<string, TwinReplayEvent[]>();
  readonly twins = new Map<string, OrganizationalTwin>();
  readonly simulations = new Map<string, SimulationSession>();
  readonly forecasts = new Map<string, TwinForecast>();
  readonly learning = new Map<string, TwinLearning>();

  private id(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  newId(prefix: string): string {
    return this.id(prefix);
  }

  appendReplay(companyId: string, event: Omit<TwinReplayEvent, "sequence">): void {
    const events = this.replayEvents.get(companyId) ?? [];
    events.push({ ...event, sequence: events.length + 1 });
    this.replayEvents.set(companyId, events);
  }

  nextVersionSequence(companyId: string): number {
    const existing = [...this.versions.values()].filter((v) => v.companyId === companyId);
    return existing.length + 1;
  }
}
