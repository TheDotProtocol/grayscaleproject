import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CredentialVaultService } from "./credential-vault.service";

/** Migrates legacy plaintext integration tokens into the encrypted vault (AIP-17). */
@Injectable()
export class CredentialMigrationService implements OnModuleInit {
  private readonly logger = new Logger(CredentialMigrationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly vault: CredentialVaultService,
  ) {}

  async onModuleInit() {
    await this.migratePlaintextTokens();
  }

  async migratePlaintextTokens(): Promise<number> {
    const integrations = await this.prisma.integration.findMany({
      where: { accessToken: { not: null } },
    });

    let migrated = 0;
    for (const integration of integrations) {
      if (!integration.accessToken) continue;

      const existing = await this.vault.retrieve(integration.companyId, integration.provider);
      if (!existing) {
        await this.vault.store(integration.companyId, integration.provider, {
          accessToken: integration.accessToken,
        });
      }

      await this.prisma.integration.update({
        where: { id: integration.id },
        data: { accessToken: null },
      });

      migrated++;
      this.logger.log(
        `Migrated plaintext token for ${integration.provider} company=${integration.companyId}`,
      );
    }

    return migrated;
  }
}
