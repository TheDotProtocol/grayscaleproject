import { Injectable, Logger } from "@nestjs/common";
import {
  PLUGIN_HOOKS,
  type PluginHandler,
  type PluginManifest,
  type PluginRegistration,
} from "@grayscale/shared";

/**
 * Plugin registry — capabilities register hooks without coupling to core modules.
 * Sprint 1: in-process registry. Future: dynamic plugin loading from packages/plugins.
 */
@Injectable()
export class PluginsService {
  private readonly logger = new Logger(PluginsService.name);
  private readonly handlers = new Map<string, PluginHandler[]>();
  private readonly manifests: PluginManifest[] = [];

  register(registration: PluginRegistration): void {
    const { manifest, handler } = registration;
    this.manifests.push(manifest);

    for (const hook of manifest.hooks) {
      const list = this.handlers.get(hook) ?? [];
      list.push(handler);
      this.handlers.set(hook, list);
    }

    this.logger.log(`Registered plugin "${manifest.id}" on ${manifest.hooks.length} hook(s)`);
  }

  list(): PluginManifest[] {
    return [...this.manifests];
  }

  async dispatch(hook: string, payload: unknown): Promise<void> {
    const handlers = this.handlers.get(hook) ?? [];
    for (const handler of handlers) {
      try {
        await handler(payload);
      } catch (err) {
        this.logger.error(`Plugin hook ${hook} failed`, err);
      }
    }
  }

  /** Built-in: log pulse for observability (Mission Control reads from DB, not this) */
  registerCorePlugins(): void {
    this.register({
      manifest: {
        id: "core.pulse-logger",
        name: "Pulse Logger",
        version: "1.0.0",
        hooks: [PLUGIN_HOOKS.ON_PULSE],
        source: "core",
      },
      handler: (payload) => {
        const p = payload as { pulse?: { type?: string; title?: string } };
        this.logger.debug(`Pulse: ${p.pulse?.type} — ${p.pulse?.title}`);
      },
    });
  }
}
