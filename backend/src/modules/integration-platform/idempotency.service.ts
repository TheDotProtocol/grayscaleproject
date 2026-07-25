import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

/** AIP-22 idempotency + duplicate suppression */
@Injectable()
export class IdempotencyService {
  constructor(private readonly prisma: PrismaService) {}

  async checkAndSet(companyId: string, key: string, ttlHours = 24): Promise<{ isDuplicate: boolean }> {
    const existing = await this.prisma.platformIdempotencyKey.findUnique({
      where: { companyId_key: { companyId, key } },
    });
    if (existing && existing.expiresAt > new Date()) {
      return { isDuplicate: true };
    }

    const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);
    await this.prisma.platformIdempotencyKey.upsert({
      where: { companyId_key: { companyId, key } },
      create: { companyId, key, expiresAt },
      update: { expiresAt },
    });
    return { isDuplicate: false };
  }

  async isEntityDuplicate(companyId: string, idempotencyKey: string): Promise<boolean> {
    const existing = await this.prisma.normalizedEntityRecord.findUnique({
      where: { companyId_idempotencyKey: { companyId, idempotencyKey } },
    });
    return !!existing;
  }
}
