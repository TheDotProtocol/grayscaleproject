import type { DomainEvent } from "../events/index.js";
import type { PulseHeartbeat } from "../pulse/index.js";

/**
 * Plugin architecture — every new capability registers hooks instead of coupling to core.
 * WHY: thousands of companies × millions of workflows requires extensibility without rewrites.
 */

export const PLUGIN_HOOKS = {
  /** Fired when Pulse Engine ingests a heartbeat */
  ON_PULSE: "plugin.pulse.received",
  /** Fired for every domain event on the bus (before pulse mapping) */
  ON_DOMAIN_EVENT: "plugin.domain_event.received",
  /** Memory lifecycle */
  ON_MEMORY_CREATED: "plugin.memory.created",
  ON_MEMORY_UPDATED: "plugin.memory.updated",
  /** Agent lifecycle — executives plug in here in Sprint 3+ */
  ON_AGENT_RECOMMENDATION: "plugin.agent.recommendation",
  /** Integration lifecycle */
  ON_INTEGRATION_SYNC: "plugin.integration.sync",
  /** Mission Control subscribes via API; plugins may also react */
  ON_MISSION_CONTROL_UPDATE: "plugin.mission_control.update",
} as const;

export type PluginHook = (typeof PLUGIN_HOOKS)[keyof typeof PLUGIN_HOOKS];

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description?: string;
  hooks: PluginHook[];
  /** Module that registered this plugin (e.g. memory, github, athena) */
  source: string;
}

export type PluginHandler<T = unknown> = (payload: T) => void | Promise<void>;

export interface PluginRegistration {
  manifest: PluginManifest;
  handler: PluginHandler;
}

/** Typed payloads for common hooks */
export interface DomainEventHookPayload {
  event: DomainEvent;
}

export interface PulseHookPayload {
  pulse: PulseHeartbeat;
}
