export type {
  PluginManifestV2,
  PluginPermission,
  PluginCommand,
  PluginCategory,
  PluginLifecycleState,
  PluginSandboxPolicy,
  SandboxApi,
  SecurityClassification,
} from "@grayscale/platform";

export { PLUGIN_HOOKS_V2, PLUGIN_CATEGORIES, SANDBOX_APIS } from "@grayscale/platform";

import type { PluginManifestV2 } from "@grayscale/platform";

/** Validates and returns a manifest v2 definition for plugin authors. */
export function defineManifest(manifest: PluginManifestV2): PluginManifestV2 {
  if (!manifest.id || !manifest.version || !manifest.minPlatformVersion) {
    throw new Error("Plugin manifest requires id, version, and minPlatformVersion");
  }
  if (!manifest.requiredConnectors?.length && manifest.connectorId) {
    manifest.requiredConnectors = [manifest.connectorId];
  }
  return manifest;
}
