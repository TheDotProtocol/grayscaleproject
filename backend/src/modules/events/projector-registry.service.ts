import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import {
  type PlatformEvent,
  type EventProjector,
  type ProjectorResult,
  type ReplayOptions,
  type ReplayResult,
} from "@grayscale/platform";
import { PulseProjector } from "./projectors/pulse.projector";
import { PluginsProjector } from "./projectors/plugins.projector";
import { MemoryIndexProjector } from "../memory/memory-index.projector";
import { GraphProjector } from "../graph/graph-projector.service";
import { StrategicGraphProjector } from "../intelligence/strategic-graph.projector";
import { IntentProjector } from "../context-runtime/projectors/intent.projector";
import { SnapshotProjector } from "../context-runtime/projectors/snapshot.projector";
import { SignalProjector } from "../context-runtime/projectors/signal.projector";
import { InsightProjector } from "../context-runtime/projectors/insight.projector";

@Injectable()
export class ProjectorRegistryService implements OnModuleInit {
  private readonly logger = new Logger(ProjectorRegistryService.name);
  private readonly projectors: EventProjector[] = [];

  constructor(
    private readonly pulseProjector: PulseProjector,
    private readonly pluginsProjector: PluginsProjector,
    private readonly memoryIndexProjector: MemoryIndexProjector,
    private readonly graphProjector: GraphProjector,
    private readonly strategicGraphProjector: StrategicGraphProjector,
    private readonly intentProjector: IntentProjector,
    private readonly snapshotProjector: SnapshotProjector,
    private readonly signalProjector: SignalProjector,
    private readonly insightProjector: InsightProjector,
  ) {}

  onModuleInit(): void {
    this.register(this.pulseProjector);
    this.register(this.pluginsProjector);
    this.register(this.memoryIndexProjector);
    this.register(this.graphProjector);
    this.register(this.strategicGraphProjector);
    this.register(this.intentProjector);
    this.register(this.snapshotProjector);
    this.register(this.signalProjector);
    this.register(this.insightProjector);
    this.logger.log(`Registered ${this.projectors.length} event projectors`);
  }

  register(projector: EventProjector): void {
    this.projectors.push(projector);
  }

  async project(event: PlatformEvent): Promise<ProjectorResult[]> {
    const matching = this.projectors.filter(
      (p) => p.handles.length === 0 || p.handles.includes(event.type),
    );

    const results: ProjectorResult[] = [];

    for (const projector of matching) {
      const start = Date.now();
      try {
        await projector.project(event);
        results.push({
          projector: projector.name,
          success: true,
          durationMs: Date.now() - start,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        results.push({
          projector: projector.name,
          success: false,
          error: message,
          durationMs: Date.now() - start,
        });
        throw err;
      }
    }

    return results;
  }

  async replay(
    events: PlatformEvent[],
    options: ReplayOptions,
  ): Promise<ReplayResult> {
    const projectorResults: ProjectorResult[] = [];

    for (const event of events) {
      if (options.dryRun) continue;

      const results = await this.project(event);
      projectorResults.push(...results);
    }

    return {
      eventsReplayed: options.dryRun ? 0 : events.length,
      projectorResults,
    };
  }
}
