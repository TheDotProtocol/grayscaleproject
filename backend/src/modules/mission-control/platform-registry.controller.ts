import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { PlatformServiceRegistryService } from "./platform-service-registry.service";
import { CapabilityDiscoveryService } from "./capability-discovery.service";
import { PlatformHealthService } from "./platform-health.service";

@ApiTags("platform")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("platform")
export class PlatformRegistryController {
  constructor(
    private readonly registry: PlatformServiceRegistryService,
    private readonly capabilities: CapabilityDiscoveryService,
    private readonly health: PlatformHealthService,
  ) {}

  @Get("registry")
  getRegistry() {
    return {
      services: this.registry.list(),
      registeredAt: new Date().toISOString(),
    };
  }

  @Get("capabilities")
  getCapabilities(@Query("category") category?: string, @Query("q") q?: string) {
    return this.capabilities.list({ category: category as never, q });
  }

  @Get("health")
  async getGlobalHealth() {
    const services = this.registry.list().filter((s) => s.status === "active");
    const reports = await Promise.all(
      services.map((s) => this.health.probeService(s.id)),
    );
    const score =
      reports.length === 0
        ? 0
        : Math.round(
            reports.reduce((sum, r) => sum + r.availability * 100, 0) / reports.length,
          );
    return { score, services: reports, computedAt: new Date().toISOString() };
  }
}
