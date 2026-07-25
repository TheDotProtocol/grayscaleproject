import { Injectable, Logger } from "@nestjs/common";
import type { EventProjector, PlatformEvent } from "@grayscale/platform";
import { ContextCacheService } from "../context-cache.service";

@Injectable()
export class InsightProjector implements EventProjector {
  readonly name = "insight-projector";
  readonly handles = ["organizational-insight.generated"] as const;

  private readonly logger = new Logger(InsightProjector.name);

  constructor(private readonly cache: ContextCacheService) {}

  async project(event: PlatformEvent): Promise<void> {
    this.logger.debug(`Insight projector: ${event.type} for company ${event.companyId}`);
    if (event.companyId) await this.cache.invalidate(event.companyId);
  }
}
