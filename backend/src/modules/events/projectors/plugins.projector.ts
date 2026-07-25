import { Injectable } from "@nestjs/common";
import type { EventProjector, PlatformEvent } from "@grayscale/platform";
import { PLUGIN_HOOKS } from "@grayscale/shared";
import { PluginsService } from "../../plugins/plugins.service";

/** Dispatches domain events to registered plugin hooks */
@Injectable()
export class PluginsProjector implements EventProjector {
  readonly name = "plugins";
  readonly handles = [] as const;

  constructor(private readonly plugins: PluginsService) {}

  async project(event: PlatformEvent): Promise<void> {
    await this.plugins.dispatch(PLUGIN_HOOKS.ON_DOMAIN_EVENT, { event });
  }
}
