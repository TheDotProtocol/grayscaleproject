import { Injectable } from "@nestjs/common";
import type { IntegrationCostMonitorPort, IntegrationCostSnapshot } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";

/** AIP-24 Integration Cost Monitor */
@Injectable()
export class IntegrationCostService implements IntegrationCostMonitorPort {
  constructor(private readonly prisma: PrismaService) {}

  private currentPeriod(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }

  async recordUsage(input: {
    companyId: string;
    providerId: string;
    apiRequests?: number;
    rateLimitHits?: number;
    bandwidthBytes?: number;
    storageBytes?: number;
    estimatedCostCents?: number;
  }): Promise<IntegrationCostSnapshot> {
    const period = this.currentPeriod();
    const existing = await this.prisma.integrationCostSnapshot.findUnique({
      where: {
        companyId_provider_period: {
          companyId: input.companyId,
          provider: input.providerId,
          period,
        },
      },
    });

    const row = await this.prisma.integrationCostSnapshot.upsert({
      where: {
        companyId_provider_period: {
          companyId: input.companyId,
          provider: input.providerId,
          period,
        },
      },
      create: {
        companyId: input.companyId,
        provider: input.providerId,
        period,
        apiRequests: input.apiRequests ?? 0,
        rateLimitHits: input.rateLimitHits ?? 0,
        bandwidthBytes: BigInt(input.bandwidthBytes ?? 0),
        storageBytes: BigInt(input.storageBytes ?? 0),
        estimatedCostCents: input.estimatedCostCents ?? 0,
      },
      update: {
        apiRequests: (existing?.apiRequests ?? 0) + (input.apiRequests ?? 0),
        rateLimitHits: (existing?.rateLimitHits ?? 0) + (input.rateLimitHits ?? 0),
        bandwidthBytes: BigInt(Number(existing?.bandwidthBytes ?? 0) + (input.bandwidthBytes ?? 0)),
        storageBytes: BigInt(Number(existing?.storageBytes ?? 0) + (input.storageBytes ?? 0)),
        estimatedCostCents: (existing?.estimatedCostCents ?? 0) + (input.estimatedCostCents ?? 0),
      },
    });

    return {
      companyId: row.companyId,
      providerId: row.provider,
      period: row.period,
      apiRequests: row.apiRequests,
      rateLimitHits: row.rateLimitHits,
      monthlyUsageUnits: row.monthlyUsageUnits,
      estimatedCostCents: row.estimatedCostCents,
      bandwidthBytes: Number(row.bandwidthBytes),
      storageBytes: Number(row.storageBytes),
      recordedAt: row.recordedAt.toISOString(),
    };
  }

  async getUsage(companyId: string, providerId: string, period?: string) {
    const row = await this.prisma.integrationCostSnapshot.findUnique({
      where: {
        companyId_provider_period: {
          companyId,
          provider: providerId,
          period: period ?? this.currentPeriod(),
        },
      },
    });
    return row ? this.toSnapshot(row) : null;
  }

  async getCompanyUsage(companyId: string, period?: string) {
    const rows = await this.prisma.integrationCostSnapshot.findMany({
      where: { companyId, period: period ?? this.currentPeriod() },
    });
    return rows.map((r) => this.toSnapshot(r));
  }

  private toSnapshot(row: {
    companyId: string;
    provider: string;
    period: string;
    apiRequests: number;
    rateLimitHits: number;
    monthlyUsageUnits: number;
    estimatedCostCents: number;
    bandwidthBytes: bigint;
    storageBytes: bigint;
    recordedAt: Date;
  }): IntegrationCostSnapshot {
    return {
      companyId: row.companyId,
      providerId: row.provider,
      period: row.period,
      apiRequests: row.apiRequests,
      rateLimitHits: row.rateLimitHits,
      monthlyUsageUnits: row.monthlyUsageUnits,
      estimatedCostCents: row.estimatedCostCents,
      bandwidthBytes: Number(row.bandwidthBytes),
      storageBytes: Number(row.storageBytes),
      recordedAt: row.recordedAt.toISOString(),
    };
  }
}
