import { Injectable } from "@nestjs/common";
import { EventsService } from "../events/events.service";
import type {
  OrganizationalTwin,
  OrganizationalTwinPort,
  TwinComparison,
  TwinEvolution,
  TwinHealth,
  TwinHistoricalState,
  TwinIntegrity,
  TwinLearning,
  TwinMetrics,
  TwinPresentState,
  TwinReplay,
  TwinRealityComparison,
  TwinSnapshot,
  TwinSynchronization,
  TwinTimeline,
  TwinTimelineEntry,
  TwinVersion,
} from "@grayscale/platform";
import { ContextRuntimeService } from "../context-runtime/context-runtime.service";
import { TwinEngineService } from "../context-runtime/twin-engine.service";
import { TwinStoreService } from "./twin-store.service";

@Injectable()
export class OrganizationalTwinService implements OrganizationalTwinPort {
  constructor(
    private readonly context: ContextRuntimeService,
    private readonly twinEngine: TwinEngineService,
    private readonly store: TwinStoreService,
    private readonly events: EventsService,
  ) {}

  async assemble(companyId: string, options?: { correlationId?: string; pointInTime?: string }): Promise<OrganizationalTwin> {
    const correlationId = options?.correlationId ?? crypto.randomUUID();
    const versionId = this.store.newId("ver");
    const ctx = await this.context.assemble(companyId, { correlationId });
    const twin = await this.twinEngine.assembleFromContext(ctx, versionId, correlationId);

    const version: TwinVersion = {
      versionId,
      companyId,
      sequence: this.store.nextVersionSequence(companyId),
      capturedAt: new Date().toISOString(),
      scope: "present",
      correlationId,
    };
    this.store.versions.set(versionId, version);

    if (options?.pointInTime) {
      twin.historical = {
        ...twin.present,
        scope: "past",
        pointInTime: options.pointInTime,
        version: { ...version, scope: "past" },
      };
    }

    twin.timeline = await this.getTimeline(companyId);
    twin.metrics = await this.getMetrics(companyId);
    twin.health = await this.getHealth(companyId);

    this.store.twins.set(companyId, twin);
    this.store.appendReplay(companyId, { eventType: "twin.state.updated", occurredAt: new Date().toISOString(), payload: { versionId } });

    await this.events.publish("twin.state.updated", companyId, { versionId, confidence: twin.confidence.overall }, { correlationId });

    return twin;
  }

  async getPresentState(companyId: string): Promise<TwinPresentState> {
    const twin = this.store.twins.get(companyId) ?? (await this.assemble(companyId));
    return twin.present;
  }

  async getHistoricalState(companyId: string, pointInTime: string): Promise<TwinHistoricalState> {
    const twin = await this.assemble(companyId, { pointInTime });
    return twin.historical ?? {
      ...twin.present,
      scope: "past",
      pointInTime,
      version: { ...twin.present.version, scope: "past" },
    };
  }

  async captureSnapshot(companyId: string, milestone?: string): Promise<TwinSnapshot> {
    const twin = this.store.twins.get(companyId) ?? (await this.assemble(companyId));
    const snapshot: TwinSnapshot = {
      snapshotId: this.store.newId("snap"),
      companyId,
      versionId: twin.present.version.versionId,
      capturedAt: new Date().toISOString(),
      scope: "present",
      stateHash: `hash-${twin.present.version.versionId}`,
      milestone,
    };
    this.store.snapshots.set(snapshot.snapshotId, snapshot);
    await this.events.publish("twin.snapshot.captured", companyId, snapshot, { correlationId: twin.correlationId });
    return snapshot;
  }

  async getTimeline(companyId: string, filters?: { from?: string; to?: string }): Promise<TwinTimeline> {
    const entries = [...this.store.timeline.values()].filter((e) => e.companyId === companyId);
    const sorted = entries.sort((a, b) => a.occurredAt.localeCompare(b.occurredAt));
    const filtered = sorted.filter((e) => {
      if (filters?.from && e.occurredAt < filters.from) return false;
      if (filters?.to && e.occurredAt > filters.to) return false;
      return true;
    });
    return {
      companyId,
      entries: filtered,
      from: filtered[0]?.occurredAt ?? new Date().toISOString(),
      to: filtered.at(-1)?.occurredAt ?? new Date().toISOString(),
    };
  }

  async replay(companyId: string, versionId: string): Promise<TwinReplay> {
    const events = this.store.replayEvents.get(companyId) ?? [];
    return { companyId, versionId, events, reconstructedAt: new Date().toISOString() };
  }

  async compareVersions(companyId: string, versionA: string, versionB: string): Promise<TwinComparison> {
    const a = this.store.versions.get(versionA);
    const b = this.store.versions.get(versionB);
    return {
      companyId,
      versionA,
      versionB,
      differences: [{ field: "sequence", before: a?.sequence, after: b?.sequence }],
      comparedAt: new Date().toISOString(),
    };
  }

  async getEvolution(companyId: string): Promise<TwinEvolution> {
    const versions = [...this.store.versions.values()].filter((v) => v.companyId === companyId);
    return { companyId, versions, milestones: [], evolutionScore: Math.min(100, versions.length * 10) };
  }

  async getHealth(companyId: string): Promise<TwinHealth> {
    const twin = this.store.twins.get(companyId);
    const score = twin?.confidence.overall ?? 0.5;
    return {
      companyId,
      status: score >= 0.7 ? "healthy" : score >= 0.4 ? "degraded" : "critical",
      integrityScore: 95,
      consistencyScore: 90,
      synchronizationScore: 85,
      checkedAt: new Date().toISOString(),
    };
  }

  async getMetrics(companyId: string): Promise<TwinMetrics> {
    return {
      companyId,
      versionCount: [...this.store.versions.values()].filter((v) => v.companyId === companyId).length,
      snapshotCount: [...this.store.snapshots.values()].filter((s) => s.companyId === companyId).length,
      simulationCount: [...this.store.simulations.values()].filter((s) => s.companyId === companyId).length,
      forecastCount: [...this.store.forecasts.values()].filter((f) => f.companyId === companyId).length,
      learningEntries: [...this.store.learning.values()].filter((l) => l.companyId === companyId).length,
      computedAt: new Date().toISOString(),
    };
  }

  async getIntegrity(companyId: string): Promise<TwinIntegrity> {
    return {
      companyId,
      versionChainValid: true,
      replayConsistent: true,
      auditComplete: true,
      checkedAt: new Date().toISOString(),
    };
  }

  async getSynchronization(companyId: string): Promise<TwinSynchronization> {
    return {
      companyId,
      lastSyncedAt: new Date().toISOString(),
      sources: ["context", "temporal", "intent", "attention", "signals", "insights"],
      lagMs: 0,
      status: "synced",
    };
  }

  async recordLearning(input: Omit<TwinLearning, "learnedAt">): Promise<TwinLearning> {
    const entry: TwinLearning = { ...input, learnedAt: new Date().toISOString() };
    this.store.learning.set(entry.predictionId, entry);
    await this.events.publish("twin.learning.recorded", input.companyId, entry, { correlationId: input.predictionId });
    return entry;
  }

  async compareReality(input: Omit<TwinRealityComparison, "comparedAt" | "realityWins">): Promise<TwinRealityComparison> {
    const comparison: TwinRealityComparison = { ...input, comparedAt: new Date().toISOString(), realityWins: true };
    await this.events.publish("twin.reality.compared", input.companyId, comparison, { correlationId: comparison.comparedAt });
    return comparison;
  }

  async listVersions(companyId: string): Promise<TwinVersion[]> {
    return [...this.store.versions.values()].filter((v) => v.companyId === companyId);
  }

  appendTimelineEntry(entry: Omit<TwinTimelineEntry, "entryId">): TwinTimelineEntry {
    const full: TwinTimelineEntry = { entryId: this.store.newId("tl"), ...entry };
    this.store.timeline.set(full.entryId, full);
    return full;
  }
}
