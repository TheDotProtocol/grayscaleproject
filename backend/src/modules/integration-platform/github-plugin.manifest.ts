import { PLUGIN_HOOKS } from "@grayscale/shared";
import type { PluginManifestV2 } from "@grayscale/platform";

export const GITHUB_PLUGIN_MANIFEST: PluginManifestV2 = {
  id: "io.grayscale.github",
  name: "GitHub Integration",
  version: "1.0.0",
  minPlatformVersion: "1.5.0",
  description: "Sync GitHub commits into platform memory and graph",
  author: "Project Grayscale",
  category: "development",
  securityClassification: "first_party",
  capabilities: ["SyncGitHub", "ReadCommits"],
  permissions: [
    { action: "sync", resource: "integration" },
    { action: "write", resource: "memory" },
    { action: "publish", resource: "events" },
  ],
  eventsPublished: [
    { type: "git.commit.received", description: "Git commit normalized" },
    { type: "integration.sync.completed", description: "Sync finished" },
  ],
  eventsConsumed: ["integration.connected"],
  commands: [
    { id: "sync-now", name: "Sync Now", permission: "sync:integration", async: true },
  ],
  requiredConnectors: ["github"],
  settingsSchema: {
    type: "object",
    properties: {
      owner: { type: "string" },
      repo: { type: "string" },
    },
    required: ["owner", "repo"],
  },
  resourceLimits: {
    maxStorageBytes: 1_048_576,
    maxApiCallsPerHour: 100,
    maxSyncFrequencyMinutes: 15,
  },
  hooks: [PLUGIN_HOOKS.ON_INTEGRATION_SYNC],
  connectorId: "github",
};
