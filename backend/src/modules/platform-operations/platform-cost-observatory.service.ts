import { Injectable } from "@nestjs/common";
import type { PlatformCostPort, PlatformCostBreakdown, CostLine } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";
@Injectable()
export class PlatformCostObservatoryService implements PlatformCostPort {
  constructor(private readonly prisma: PrismaService) {}

  async compute(period?: string): Promise<PlatformCostBreakdown> {
    const p = period ?? new Date().toISOString().slice(0, 7);
    const eventCount = await this.prisma.domainEvent.count();
    const memoryCount = await this.prisma.memoryRecord.count();
    const jobCount = await this.prisma.platformJob.count();
    const agentRuns = await this.prisma.agentRun.count();

    const line = (units: number, cents: number): CostLine => ({
      usageUnits: units,
      estimatedCents: cents,
      unit: "units",
      trend: "stable",
    });

    const connectorSnapshots = await this.prisma.integrationCostSnapshot.findMany({ where: { period: p } });
    const connectorCents = connectorSnapshots.reduce((s, c) => s + c.estimatedCostCents, 0);

    const categories = {
      database: line(memoryCount + eventCount, Math.round((memoryCount + eventCount) * 0.001)),
      queues: line(jobCount, jobCount * 2),
      workers: line(jobCount, jobCount * 5),
      storage: line(eventCount, Math.round(eventCount * 0.0005)),
      bandwidth: line(0, 0),
      aiUsage: line(agentRuns, agentRuns * 10),
      connectors: line(connectorSnapshots.length, connectorCents),
      plugins: line(await this.prisma.installedPlugin.count(), 0),
      infrastructure: line(1, 1200),
    };

    const total = Object.values(categories).reduce((s, c) => s + c.estimatedCents, 0);
    const breakdown: PlatformCostBreakdown = {
      period: p,
      categories,
      totalEstimatedCents: total,
      computedAt: new Date().toISOString(),
    };

    await this.prisma.platformInfraCostSnapshot.upsert({
      where: { period: p },
      create: { period: p, breakdown: categories as object, totalEstimatedCents: total },
      update: { breakdown: categories as object, totalEstimatedCents: total },
    });

    return breakdown;
  }
}
