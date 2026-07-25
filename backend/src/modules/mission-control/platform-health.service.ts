import { Injectable } from "@nestjs/common";
import type { PlatformHealthPort, PlatformHealthSnapshot, ServiceHealthReport } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";
import { PulseEngineService } from "../pulse/pulse-engine.service";
import { IntegrationHealthService } from "../integration-platform/integration-health.service";
import { PlatformServiceRegistryService } from "./platform-service-registry.service";

@Injectable()
export class PlatformHealthService implements PlatformHealthPort {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pulse: PulseEngineService,
    private readonly integrationHealth: IntegrationHealthService,
    private readonly registry: PlatformServiceRegistryService,
  ) {}

  async probeService(serviceId: string, companyId?: string): Promise<ServiceHealthReport> {
    const start = Date.now();
    const svc = this.registry.get(serviceId);
    const warnings: string[] = [];
    const errors: string[] = [];

    if (!svc) {
      return this.report(serviceId, "unknown", start, { errors: ["Service not registered"] });
    }

    if (svc.status === "disabled") {
      return this.report(serviceId, "unknown", start, {
        warnings: [svc.statusReason ?? "Service disabled"],
        readiness: false,
      });
    }

    try {
      switch (serviceId) {
        case "pulse-engine": {
          if (!companyId) break;
          const h = await this.pulse.getHealth(companyId);
          return this.report(serviceId, h.status === "healthy" ? "healthy" : h.status === "attention" ? "degraded" : "unhealthy", start, {
            availability: h.score / 100,
            warningCount: h.counts.warning,
            errors: h.counts.critical > 0 ? [`${h.counts.critical} critical pulses`] : [],
          });
        }
        case "integration-platform": {
          if (!companyId) break;
          const summary = await this.integrationHealth.aggregateSummary(companyId);
          const health = summary.critical > 0 ? "unhealthy" : summary.warning > 0 ? "degraded" : "healthy";
          return this.report(serviceId, health, start, {
            warningCount: summary.warning,
            errors: summary.critical > 0 ? [`${summary.critical} critical integrations`] : [],
          });
        }
        case "memory-engine": {
          if (!companyId) break;
          const count = await this.prisma.memoryRecord.count({ where: { companyId } });
          warnings.push(count === 0 ? "No memory records indexed" : "");
          break;
        }
        case "event-store": {
          if (!companyId) break;
          const count = await this.prisma.domainEvent.count({ where: { companyId } });
          const failed = await this.prisma.domainEvent.count({ where: { companyId, status: "failed" } });
          if (failed > 0) errors.push(`${failed} failed events`);
          warnings.push(count === 0 ? "No domain events" : "");
          break;
        }
        default:
          break;
      }
    } catch (e) {
      errors.push(e instanceof Error ? e.message : "Health probe failed");
      return this.report(serviceId, "unhealthy", start, { errors });
    }

    return this.report(serviceId, errors.length ? "degraded" : "healthy", start, { warnings: warnings.filter(Boolean), errors });
  }

  async computePlatformHealth(companyId: string): Promise<PlatformHealthSnapshot> {
    const services = this.registry.list().filter((s) => s.status === "active");
    const reports = await Promise.all(
      services.map((s) => this.probeService(s.id, companyId)),
    );

    const [pulseHealth, integrationSummary] = await Promise.all([
      this.pulse.getHealth(companyId),
      this.integrationHealth.aggregateSummary(companyId),
    ]);

    const availability =
      reports.length === 0
        ? 0
        : reports.reduce((sum, r) => sum + r.availability, 0) / reports.length;

    const errorDensity =
      reports.reduce((sum, r) => sum + r.errors.length + r.errorRate, 0) /
      Math.max(reports.length, 1);

    const readinessScore = reports.filter((r) => r.readiness).length / Math.max(reports.length, 1);

    const score = Math.round(
      availability * 40 +
        (integrationSummary.healthy / Math.max(integrationSummary.healthy + integrationSummary.critical + integrationSummary.warning, 1)) * 20 +
        (pulseHealth.score / 100) * 15 +
        readinessScore * 100 * 0.15 +
        Math.max(0, 1 - errorDensity / 10) * 10,
    );

    const status: PlatformHealthSnapshot["status"] =
      score >= 75 ? "healthy" : score >= 50 ? "attention" : "critical";

    const snapshot: PlatformHealthSnapshot = {
      companyId,
      score: Math.max(0, Math.min(100, score)),
      status,
      services: reports,
      breakdown: {
        availability: Math.round(availability * 100),
        integration: integrationSummary.healthy,
        pulse: pulseHealth.score,
        readiness: Math.round(readinessScore * 100),
        errorDensity: Math.round(errorDensity * 10) / 10,
      },
      computedAt: new Date().toISOString(),
    };

    await this.prisma.platformHealthSnapshot.create({
      data: {
        companyId,
        score: snapshot.score,
        status: snapshot.status,
        breakdown: snapshot.breakdown as object,
        services: reports as unknown as object,
      },
    });

    return snapshot;
  }

  private report(
    serviceId: string,
    health: ServiceHealthReport["health"],
    start: number,
    opts: Partial<ServiceHealthReport> = {},
  ): ServiceHealthReport {
    return {
      serviceId,
      health,
      availability: opts.availability ?? (health === "healthy" ? 1 : health === "degraded" ? 0.7 : 0.3),
      readiness: opts.readiness ?? health !== "unknown",
      latencyMs: Date.now() - start,
      errorRate: opts.errorRate ?? 0,
      warningCount: opts.warningCount ?? (opts.warnings?.length ?? 0),
      coverage: opts.coverage,
      costCents: opts.costCents,
      lastSuccessfulRun: opts.lastSuccessfulRun,
      lastFailure: opts.lastFailure,
      uptime: opts.uptime ?? 1,
      warnings: opts.warnings ?? [],
      errors: opts.errors ?? [],
      checkedAt: new Date().toISOString(),
    };
  }
}
