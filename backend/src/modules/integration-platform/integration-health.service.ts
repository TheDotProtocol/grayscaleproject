import { Injectable } from "@nestjs/common";
import type { IntegrationHealthEnginePort, IntegrationHealthSnapshot, ConnectorHealthState, ConnectorProviderId } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";

/** AIP-23 Integration Health Engine */
@Injectable()
export class IntegrationHealthService implements IntegrationHealthEnginePort {
  constructor(private readonly prisma: PrismaService) {}

  async record(snapshot: Omit<IntegrationHealthSnapshot, "recordedAt">): Promise<IntegrationHealthSnapshot> {
    const row = await this.prisma.integrationHealthSnapshot.create({
      data: {
        companyId: snapshot.companyId,
        provider: snapshot.providerId,
        pluginId: snapshot.pluginId,
        state: snapshot.state,
        message: snapshot.message,
        authStatus: snapshot.authStatus,
        lastSyncAt: snapshot.lastSyncAt ? new Date(snapshot.lastSyncAt) : undefined,
        webhookStatus: snapshot.webhookStatus,
      },
    });
    return this.rowToSnapshot(row);
  }

  async getProviderHealth(companyId: string, providerId: ConnectorProviderId) {
    const row = await this.prisma.integrationHealthSnapshot.findFirst({
      where: { companyId, provider: providerId },
      orderBy: { recordedAt: "desc" },
    });
    return row ? this.rowToSnapshot(row) : null;
  }

  async getCompanyHealth(companyId: string) {
    const providers = await this.prisma.integrationHealthSnapshot.findMany({
      where: { companyId },
      orderBy: { recordedAt: "desc" },
      distinct: ["provider"],
    });
    return providers.map((r) => this.rowToSnapshot(r));
  }

  async aggregateSummary(companyId: string) {
    const snapshots = await this.getCompanyHealth(companyId);
    const states = {} as Record<ConnectorHealthState, number>;
    let healthy = 0;
    let warning = 0;
    let critical = 0;

    for (const s of snapshots) {
      states[s.state] = (states[s.state] ?? 0) + 1;
      if (s.state === "healthy") healthy++;
      else if (s.state === "warning" || s.state === "sync_delayed") warning++;
      else critical++;
    }

    return { healthy, warning, critical, states };
  }

  private rowToSnapshot(row: {
    companyId: string;
    provider: string;
    pluginId: string | null;
    state: string;
    message: string | null;
    authStatus: string;
    lastSyncAt: Date | null;
    webhookStatus: string;
    recordedAt: Date;
  }): IntegrationHealthSnapshot {
    return {
      companyId: row.companyId,
      providerId: row.provider as ConnectorProviderId,
      pluginId: row.pluginId ?? undefined,
      state: row.state as ConnectorHealthState,
      message: row.message ?? undefined,
      authStatus: row.authStatus as IntegrationHealthSnapshot["authStatus"],
      lastSyncAt: row.lastSyncAt?.toISOString(),
      webhookStatus: row.webhookStatus as IntegrationHealthSnapshot["webhookStatus"],
      recordedAt: row.recordedAt.toISOString(),
    };
  }
}
