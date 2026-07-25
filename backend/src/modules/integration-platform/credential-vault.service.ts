import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { CredentialVaultPort, EncryptedCredential, CredentialAuditEntry } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";

const ALGORITHM = "aes-256-gcm";

@Injectable()
export class CredentialVaultService implements CredentialVaultPort {
  private readonly logger = new Logger(CredentialVaultService.name);
  private readonly key: Buffer;
  private readonly keyVersion: number;

  constructor(
    private readonly prisma: PrismaService,
    config: ConfigService,
  ) {
    const secret = config.get<string>("INTEGRATION_ENCRYPTION_KEY") ?? "dev-integration-key-change-in-prod";
    this.keyVersion = parseInt(config.get("INTEGRATION_ENCRYPTION_KEY_VERSION") ?? "1", 10);
    this.key = scryptSync(secret, "grayscale-integration", 32);
  }

  private encrypt(data: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv(ALGORITHM, this.key, iv);
    const encrypted = Buffer.concat([cipher.update(data, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `${this.keyVersion}:${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
  }

  private decrypt(blob: string): string {
    const [versionStr, ivHex, tagHex, dataHex] = blob.split(":");
    void versionStr;
    const decipher = createDecipheriv(ALGORITHM, this.key, Buffer.from(ivHex, "hex"));
    decipher.setAuthTag(Buffer.from(tagHex, "hex"));
    return Buffer.concat([
      decipher.update(Buffer.from(dataHex, "hex")),
      decipher.final(),
    ]).toString("utf8");
  }

  async store(
    companyId: string,
    provider: string,
    secret: Record<string, unknown>,
    expiresAt?: Date,
  ): Promise<EncryptedCredential> {
    const encryptedSecret = this.encrypt(JSON.stringify(secret));
    const row = await this.prisma.integrationCredential.upsert({
      where: { companyId_provider: { companyId, provider } },
      create: { companyId, provider, encryptedSecret, keyVersion: this.keyVersion, expiresAt },
      update: { encryptedSecret, keyVersion: this.keyVersion, expiresAt, rotatedAt: new Date() },
    });

    await this.prisma.credentialAuditLog.create({
      data: {
        credentialId: row.id,
        companyId,
        provider,
        action: "created",
        metadata: { keyVersion: this.keyVersion } as object,
      },
    });

    return this.toCredential(row);
  }

  async retrieve(companyId: string, provider: string): Promise<Record<string, unknown> | null> {
    const row = await this.prisma.integrationCredential.findUnique({
      where: { companyId_provider: { companyId, provider } },
    });
    if (!row) return null;
    if (row.expiresAt && row.expiresAt < new Date()) {
      this.logger.warn(`Credential expired for ${provider} company ${companyId}`);
      return null;
    }
    return JSON.parse(this.decrypt(row.encryptedSecret)) as Record<string, unknown>;
  }

  async rotate(companyId: string, provider: string, newSecret: Record<string, unknown>): Promise<EncryptedCredential> {
    const result = await this.store(companyId, provider, newSecret);
    const row = await this.prisma.integrationCredential.findUnique({
      where: { companyId_provider: { companyId, provider } },
    });
    if (row) {
      await this.prisma.credentialAuditLog.create({
        data: {
          credentialId: row.id,
          companyId,
          provider,
          action: "rotated",
          metadata: {} as object,
        },
      });
    }
    return result;
  }

  async revoke(companyId: string, provider: string, actorId?: string): Promise<void> {
    const row = await this.prisma.integrationCredential.findUnique({
      where: { companyId_provider: { companyId, provider } },
    });
    if (!row) return;

    await this.prisma.credentialAuditLog.create({
      data: {
        credentialId: row.id,
        companyId,
        provider,
        action: "revoked",
        actorId,
        metadata: {} as object,
      },
    });

    await this.prisma.integrationCredential.delete({ where: { id: row.id } });
  }

  async auditLog(credentialId: string, limit = 50): Promise<CredentialAuditEntry[]> {
    const rows = await this.prisma.credentialAuditLog.findMany({
      where: { credentialId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return rows.map((r) => ({
      id: r.id,
      credentialId: r.credentialId,
      companyId: r.companyId,
      provider: r.provider,
      action: r.action as CredentialAuditEntry["action"],
      actorId: r.actorId ?? undefined,
      metadata: (r.metadata ?? {}) as Record<string, unknown>,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  private toCredential(row: {
    id: string;
    companyId: string;
    provider: string;
    keyVersion: number;
    expiresAt: Date | null;
    createdAt: Date;
    rotatedAt: Date | null;
  }): EncryptedCredential {
    return {
      id: row.id,
      companyId: row.companyId,
      provider: row.provider,
      keyVersion: row.keyVersion,
      expiresAt: row.expiresAt?.toISOString(),
      createdAt: row.createdAt.toISOString(),
      rotatedAt: row.rotatedAt?.toISOString(),
    };
  }
}
