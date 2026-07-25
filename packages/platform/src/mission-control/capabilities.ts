/** Capability Discovery — AIP-28 */

export const CAPABILITY_CATEGORIES = [
  "memory",
  "graph",
  "intelligence",
  "integration",
  "plugin",
  "executive",
  "billing",
  "timeline",
  "notification",
  "operations",
  "search",
] as const;

export type CapabilityCategory = (typeof CAPABILITY_CATEGORIES)[number];

export interface PlatformCapability {
  id: string;
  name: string;
  category: CapabilityCategory;
  serviceId: string;
  route?: string;
  permissions?: string[];
  description?: string;
  searchable: boolean;
  keywords?: string[];
}

export interface CapabilityDiscoveryPort {
  register(capability: PlatformCapability): void;
  list(filters?: { category?: CapabilityCategory; q?: string }): PlatformCapability[];
  search(q: string): PlatformCapability[];
  get(capabilityId: string): PlatformCapability | undefined;
}
