import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { PlatformServiceRegistryPort, PlatformServiceRegistration } from "@grayscale/platform";
import { PLATFORM_SERVICES } from "./registrations/platform-services";

@Injectable()
export class PlatformServiceRegistryService implements PlatformServiceRegistryPort, OnModuleInit {
  private readonly services = new Map<string, PlatformServiceRegistration>();

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const executivesEnabled = this.config.get("EXECUTIVES_ENABLED") === "true";
    for (const svc of PLATFORM_SERVICES) {
      let status: PlatformServiceRegistration["status"] = "active";
      let statusReason: string | undefined;
      if (svc.id === "executive-runtime" && !executivesEnabled) {
        status = "disabled";
        statusReason = "EXECUTIVES_ENABLED=false";
      }
      this.register({ ...svc, status, statusReason });
    }
  }

  register(service: PlatformServiceRegistration): void {
    this.services.set(service.id, service);
  }

  unregister(serviceId: string): void {
    this.services.delete(serviceId);
  }

  list(): PlatformServiceRegistration[] {
    return [...this.services.values()];
  }

  get(serviceId: string): PlatformServiceRegistration | undefined {
    return this.services.get(serviceId);
  }
}
