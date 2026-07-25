import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConnectorRegistry } from "@grayscale/connector-core";
import { githubConnector } from "@grayscale/connector-github";
import type { ConnectorRegistryPort, ConnectorProviderId } from "@grayscale/platform";

@Injectable()
export class ConnectorRegistryService implements ConnectorRegistryPort, OnModuleInit {
  private readonly registry = new ConnectorRegistry();

  onModuleInit(): void {
    this.registry.register(githubConnector);
    // Stub connectors registered via registerStubs()
    this.registerStubConnectors();
  }

  register(connector: import("@grayscale/platform").ConnectorPort): void {
    this.registry.register(connector);
  }

  get(providerId: ConnectorProviderId) {
    return this.registry.get(providerId);
  }

  list() {
    return this.registry.list();
  }

  private registerStubConnectors(): void {
    const stubs: ConnectorProviderId[] = [
      "gitlab", "cursor", "replit", "google", "microsoft", "apple",
      "figma", "canva", "slack", "discord", "stripe", "vultr",
      "cloudflare", "asktrabaajo", "taucore", "dotprotocol",
    ];

    for (const id of stubs) {
      this.registry.register({
        providerId: id,
        displayName: id.charAt(0).toUpperCase() + id.slice(1),
        version: "0.0.0-stub",
        supportedAuth: ["oauth2"],
        supportedResources: [],
        authenticate: async () => ({ success: false, error: "Stub connector — not implemented" }),
        refreshAuth: async () => ({ success: false, error: "Stub" }),
        revokeAuth: async () => {},
        healthCheck: async () => ({
          providerId: id,
          state: "maintenance",
          message: "Connector stub — awaiting implementation",
          lastCheckedAt: new Date().toISOString(),
        }),
        fetchResources: async () => [],
        handleWebhook: async () => ({ payloads: [], verified: false }),
      });
    }
  }
}
