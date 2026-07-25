import { describe, it, expect } from "vitest";
import { ConnectorRegistry } from "./connector-base.js";

describe("ConnectorRegistry", () => {
  it("registers and lists connectors", () => {
    const registry = new ConnectorRegistry();
    registry.register({
      providerId: "github",
      displayName: "GitHub",
      version: "1.0.0",
      supportedAuth: ["pat"],
      supportedResources: ["commits"],
      authenticate: async () => ({ success: true }),
      refreshAuth: async () => ({ success: false }),
      revokeAuth: async () => {},
      healthCheck: async () => ({
        providerId: "github",
        state: "healthy",
        lastCheckedAt: new Date().toISOString(),
      }),
      fetchResources: async () => [],
      handleWebhook: async () => ({ payloads: [], verified: false }),
    });

    expect(registry.list()).toHaveLength(1);
    expect(registry.get("github")?.displayName).toBe("GitHub");
  });
});
