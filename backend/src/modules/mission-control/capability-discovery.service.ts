import { Injectable, OnModuleInit } from "@nestjs/common";
import type {
  CapabilityDiscoveryPort,
  PlatformCapability,
  CapabilityCategory,
} from "@grayscale/platform";
import { PLATFORM_CAPABILITIES } from "./registrations/platform-services";

@Injectable()
export class CapabilityDiscoveryService implements CapabilityDiscoveryPort, OnModuleInit {
  private readonly capabilities = new Map<string, PlatformCapability>();

  onModuleInit() {
    for (const cap of PLATFORM_CAPABILITIES) {
      this.register(cap);
    }
  }

  register(capability: PlatformCapability): void {
    this.capabilities.set(capability.id, capability);
  }

  list(filters?: { category?: CapabilityCategory; q?: string }): PlatformCapability[] {
    let results = [...this.capabilities.values()];
    if (filters?.category) {
      results = results.filter((c) => c.category === filters.category);
    }
    if (filters?.q) {
      return this.search(filters.q).filter((c) =>
        !filters.category || c.category === filters.category,
      );
    }
    return results;
  }

  search(q: string): PlatformCapability[] {
    const needle = q.toLowerCase();
    return [...this.capabilities.values()].filter(
      (c) =>
        c.searchable &&
        (c.id.toLowerCase().includes(needle) ||
          c.name.toLowerCase().includes(needle) ||
          c.description?.toLowerCase().includes(needle) ||
          c.keywords?.some((k) => k.includes(needle))),
    );
  }

  get(capabilityId: string): PlatformCapability | undefined {
    return this.capabilities.get(capabilityId);
  }
}
