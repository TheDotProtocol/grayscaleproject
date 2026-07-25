/** Platform Service Registry — AIP-26 */

export const PLATFORM_SERVICE_STATUSES = ["active", "degraded", "disabled"] as const;
export type PlatformServiceStatus = (typeof PLATFORM_SERVICE_STATUSES)[number];

export interface ServiceRoute {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  description?: string;
}

export interface PlatformServiceRegistration {
  id: string;
  name: string;
  version: string;
  apiVersion: string;
  description: string;
  owner: string;
  module: string;
  status: PlatformServiceStatus;
  statusReason?: string;
  capabilities: string[];
  dependencies: string[];
  routes: ServiceRoute[];
  documentation: string;
}

export interface PlatformServiceRegistryPort {
  register(service: PlatformServiceRegistration): void;
  unregister(serviceId: string): void;
  list(): PlatformServiceRegistration[];
  get(serviceId: string): PlatformServiceRegistration | undefined;
}
