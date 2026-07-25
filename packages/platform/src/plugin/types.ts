/** Plugin Manifest v2 — AIP-16 */

import type { PlatformEventType } from "../events/catalog.js";

export const PLUGIN_HOOKS_V2 = [
  "plugin.pulse.received",
  "plugin.domain_event.received",
  "plugin.memory.created",
  "plugin.memory.updated",
  "plugin.agent.recommendation",
  "plugin.integration.sync",
  "plugin.mission_control.update",
] as const;

export type PluginHookName = (typeof PLUGIN_HOOKS_V2)[number];

export const PLUGIN_CATEGORIES = [
  "development",
  "communication",
  "finance",
  "design",
  "productivity",
  "infrastructure",
  "first_party",
] as const;

export type PluginCategory = (typeof PLUGIN_CATEGORIES)[number];

export const SECURITY_CLASSIFICATIONS = ["standard", "elevated", "first_party"] as const;
export type SecurityClassification = (typeof SECURITY_CLASSIFICATIONS)[number];

export interface PluginPermission {
  action: "read" | "write" | "publish" | "sync" | "admin";
  resource: string;
  scope?: string;
}

export interface PluginCommand {
  id: string;
  name: string;
  description?: string;
  permission: string;
  async: boolean;
}

export interface PluginEventDeclaration {
  type: string;
  description?: string;
}

export interface PluginDependency {
  pluginId?: string;
  connectorId?: string;
  minVersion?: string;
}

export interface UIExtensionSlot {
  slot: string;
  label: string;
  component?: string;
}

export interface ResourceLimits {
  maxStorageBytes: number;
  maxApiCallsPerHour: number;
  maxSyncFrequencyMinutes: number;
}

export interface PluginManifestV2 {
  id: string;
  name: string;
  version: string;
  minPlatformVersion: string;
  description?: string;
  author?: string;
  homepage?: string;
  category: PluginCategory;
  securityClassification: SecurityClassification;

  capabilities: string[];
  permissions: PluginPermission[];
  eventsPublished: PluginEventDeclaration[];
  eventsConsumed: PlatformEventType[];
  commands: PluginCommand[];
  requiredConnectors: string[];
  settingsSchema: Record<string, unknown>;
  uiExtensions?: UIExtensionSlot[];
  dependencies?: PluginDependency[];
  resourceLimits: ResourceLimits;

  hooks: PluginHookName[];
  connectorId?: string;
}

export const PLUGIN_LIFECYCLE_STATES = [
  "registered",
  "installing",
  "installed",
  "configuring",
  "active",
  "syncing",
  "degraded",
  "deactivated",
  "failed",
  "uninstalling",
  "uninstalled",
] as const;

export type PluginLifecycleState = (typeof PLUGIN_LIFECYCLE_STATES)[number];

export interface InstalledPlugin {
  id: string;
  companyId: string;
  pluginId: string;
  version: string;
  state: PluginLifecycleState;
  config: Record<string, unknown>;
  permissions: PluginPermission[];
  sandboxPolicy: PluginSandboxPolicy;
  installedAt: string;
  updatedAt: string;
}

export const SANDBOX_APIS = [
  "memory.read",
  "memory.write",
  "graph.read",
  "events.publish",
  "integration.sync",
  "integration.read",
  "settings.read",
  "settings.write",
  "storage.get",
  "storage.set",
] as const;

export type SandboxApi = (typeof SANDBOX_APIS)[number];

export interface PluginSandboxPolicy {
  pluginId: string;
  companyId: string;
  allowedApis: SandboxApi[];
  allowedEvents: string[];
  allowedSubscriptions: string[];
  allowedExecutives: string[];
  allowedStorage: { maxBytes: number; ttlSeconds: number };
  allowedPermissions: string[];
  networkPolicy: "none" | "provider_only" | "allowlist";
  networkAllowlist?: string[];
}

export interface PluginRuntimePort {
  install(companyId: string, manifest: PluginManifestV2): Promise<InstalledPlugin>;
  uninstall(companyId: string, pluginId: string): Promise<void>;
  activate(companyId: string, pluginId: string): Promise<InstalledPlugin>;
  deactivate(companyId: string, pluginId: string): Promise<InstalledPlugin>;
  getInstalled(companyId: string, pluginId: string): Promise<InstalledPlugin | null>;
  listInstalled(companyId: string): Promise<InstalledPlugin[]>;
  healthCheck(companyId: string, pluginId: string): Promise<{ healthy: boolean; issues: string[] }>;
}

export interface SandboxGatePort {
  check(pluginId: string, companyId: string, api: SandboxApi): Promise<{ allowed: boolean; reason: string }>;
}
