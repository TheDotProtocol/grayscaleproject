import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { EventsService } from "../events/events.service";
import { CredentialVaultService } from "../integration-platform/credential-vault.service";

@Injectable()
export class IntegrationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventsService,
    private readonly vault: CredentialVaultService,
  ) {}

  list(companyId: string) {
    return this.prisma.integration.findMany({
      where: { companyId },
      select: {
        id: true,
        provider: true,
        status: true,
        config: true,
        lastSyncAt: true,
        createdAt: true,
      },
    });
  }

  async connectGitHub(
    companyId: string,
    data: { accessToken: string; owner: string; repo: string },
  ) {
    await this.vault.store(companyId, "github", {
      accessToken: data.accessToken,
    });

    const integration = await this.prisma.integration.upsert({
      where: { companyId_provider: { companyId, provider: "github" } },
      create: {
        companyId,
        provider: "github",
        config: { owner: data.owner, repo: data.repo },
        status: "connected",
      },
      update: {
        config: { owner: data.owner, repo: data.repo },
        status: "connected",
        accessToken: null,
      },
    });

    await this.events.publish("integration.connected", companyId, {
      provider: "github",
      integrationId: integration.id,
    }, { source: "integrations" });

    return {
      id: integration.id,
      provider: integration.provider,
      status: integration.status,
      config: integration.config,
      lastSyncAt: integration.lastSyncAt,
      createdAt: integration.createdAt,
    };
  }

  async disconnect(companyId: string, provider: string) {
    const integration = await this.prisma.integration.findUnique({
      where: { companyId_provider: { companyId, provider } },
    });
    if (!integration) throw new NotFoundException("Integration not found");

    await this.vault.revoke(companyId, provider);
    await this.prisma.integration.delete({ where: { id: integration.id } });

    await this.events.publish("integration.sync.failed", companyId, {
      provider,
      reason: "disconnected",
    }, { source: "integrations" });

    return { disconnected: true };
  }
}
