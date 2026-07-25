import { Injectable, Logger } from "@nestjs/common";
import type { EventProjector, PlatformEvent } from "@grayscale/platform";
import { ContextCacheService } from "../context-cache.service";

@Injectable()
export class IntentProjector implements EventProjector {
  readonly name = "intent-projector";
  readonly handles = [
    "intent.proposed",
    "intent.approved",
    "intent.updated",
    "intent.snapshot.captured",
  ] as const;

  private readonly logger = new Logger(IntentProjector.name);

  constructor(private readonly cache: ContextCacheService) {}

  async project(event: PlatformEvent): Promise<void> {
    this.logger.debug(`Intent projector: ${event.type} for company ${event.companyId}`);
    if (event.companyId) await this.cache.invalidate(event.companyId);
  }
}
