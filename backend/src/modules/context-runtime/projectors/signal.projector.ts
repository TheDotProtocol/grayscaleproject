import { Injectable, Logger } from "@nestjs/common";
import type { EventProjector, PlatformEvent } from "@grayscale/platform";
import { ContextCacheService } from "../context-cache.service";
import { OrganizationalInsightEngineService } from "../organizational-insight-engine.service";

@Injectable()
export class SignalProjector implements EventProjector {
  readonly name = "signal-projector";
  readonly handles = ["organizational-signal.emitted", "organizational-signal.consumed"] as const;

  private readonly logger = new Logger(SignalProjector.name);

  constructor(private readonly cache: ContextCacheService) {}

  async project(event: PlatformEvent): Promise<void> {
    this.logger.debug(`Signal projector: ${event.type} for company ${event.companyId}`);
    if (event.companyId) {
      await this.cache.invalidate(event.companyId);
    }
  }
}
