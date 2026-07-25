import { Injectable } from "@nestjs/common";
import type { ReliabilityPort, ServiceReliabilityProfile } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";
import { PlatformServiceRegistryService } from "../mission-control/platform-service-registry.service";

const DEFAULT_SLA: Record<string, { availability: number; latency: number; errorRate: number; rto: number; rpo: number }> = {
  "event-store": { availability: 99.9, latency: 100, errorRate: 0.001, rto: 5, rpo: 0 },
  "memory-engine": { availability: 99.5, latency: 200, errorRate: 0.005, rto: 15, rpo: 5 },
  "knowledge-graph": { availability: 99.5, latency: 300, errorRate: 0.005, rto: 15, rpo: 5 },
  "strategic-intelligence": { availability: 99.0, latency: 500, errorRate: 0.01, rto: 30, rpo: 15 },
  "integration-platform": { availability: 99.0, latency: 2000, errorRate: 0.02, rto: 60, rpo: 30 },
  "pulse-engine": { availability: 99.5, latency: 100, errorRate: 0.005, rto: 5, rpo: 0 },
  "mission-control": { availability: 99.0, latency: 500, errorRate: 0.01, rto: 15, rpo: 0 },
};

@Injectable()
export class ReliabilityEngineService implements ReliabilityPort {
  constructor(
    private readonly prisma: PrismaService,
    private readonly registry: PlatformServiceRegistryService,
  ) {}

  async computeProfile(serviceId: string, window = "24h"): Promise<ServiceReliabilityProfile> {
    const sla = DEFAULT_SLA[serviceId] ?? { availability: 99.0, latency: 500, errorRate: 0.01, rto: 30, rpo: 15 };
    const since = this.windowStart(window);

    let errorRate = 0;
    let availability = 99.5;

    if (serviceId === "event-store") {
      const total = await this.prisma.domainEvent.count({ where: { createdAt: { gte: since } } });
      const failed = await this.prisma.domainEvent.count({ where: { createdAt: { gte: since }, status: "failed" } });
      errorRate = total > 0 ? failed / total : 0;
      availability = total > 0 ? ((total - failed) / total) * 100 : 99.9;
    }

    const consumed = Math.max(0, ((100 - availability) / (100 - sla.availability)) * 100);
    const profile: ServiceReliabilityProfile = {
      serviceId,
      sla: { availabilityTarget: sla.availability, latencyP95Ms: sla.latency, errorRateMax: sla.errorRate },
      slo: { availability, latencyP95Ms: sla.latency * 0.5, errorRate },
      errorBudget: { total: 100, consumed: Math.min(100, consumed), remaining: Math.max(0, 100 - consumed), burnRate: consumed / 24 },
      recovery: { rtoMinutes: sla.rto, rpoMinutes: sla.rpo },
      window: window as ServiceReliabilityProfile["window"],
      computedAt: new Date().toISOString(),
    };

    await this.prisma.reliabilitySnapshot.create({
      data: { serviceId, profile: profile as object, window },
    });

    return profile;
  }

  async computeAll(window = "24h"): Promise<ServiceReliabilityProfile[]> {
    const services = this.registry.list().filter((s) => s.status === "active");
    return Promise.all(services.map((s) => this.computeProfile(s.id, window)));
  }

  private windowStart(window: string): Date {
    const d = new Date();
    if (window === "1h") d.setHours(d.getHours() - 1);
    else if (window === "7d") d.setDate(d.getDate() - 7);
    else if (window === "30d") d.setDate(d.getDate() - 30);
    else d.setDate(d.getDate() - 1);
    return d;
  }
}
