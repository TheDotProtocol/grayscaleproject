import { Injectable } from "@nestjs/common";
import type { EventProjector, PlatformEvent } from "@grayscale/platform";
import { PulseEngineService } from "../../pulse/pulse-engine.service";

/** Projects domain events into the Pulse Engine */
@Injectable()
export class PulseProjector implements EventProjector {
  readonly name = "pulse";
  readonly handles = [] as const;

  constructor(private readonly pulse: PulseEngineService) {}

  async project(event: PlatformEvent): Promise<void> {
    await this.pulse.ingestFromDomainEvent(event);
  }
}
