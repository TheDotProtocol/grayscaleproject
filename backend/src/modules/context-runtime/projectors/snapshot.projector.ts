import { Injectable, Logger } from "@nestjs/common";
import type { EventProjector, PlatformEvent } from "@grayscale/platform";
import { ContextCacheService } from "../context-cache.service";

@Injectable()
export class SnapshotProjector implements EventProjector {
  readonly name = "snapshot-projector";
  readonly handles = [
    "temporal.snapshot.captured",
    "organizational-snapshot.captured",
  ] as const;

  private readonly logger = new Logger(SnapshotProjector.name);

  constructor(private readonly cache: ContextCacheService) {}

  async project(event: PlatformEvent): Promise<void> {
    this.logger.debug(`Snapshot projector: ${event.type} for company ${event.companyId}`);
    if (event.companyId) await this.cache.invalidate(event.companyId);
  }
}
