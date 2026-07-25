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
  ) {}

  onModuleInit(): void {
    this.register(this.pulseProjector);
    this.register(this.pluginsProjector);
    this.register(this.memoryIndexProjector);
    this.register(this.graphProjector);
    this.register(this.strategicGraphProjector);
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
