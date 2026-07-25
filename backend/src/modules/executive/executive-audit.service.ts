import { Injectable, Logger } from "@nestjs/common";
import type {
  ExecutiveAuditPort,
  ExecutiveAuditEntry,
} from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";
import { rowToAudit } from "./executive.mapper";

@Injectable()
export class ExecutiveAuditService implements ExecutiveAuditPort {
  private readonly logger = new Logger(ExecutiveAuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async log(
    entry: Omit<ExecutiveAuditEntry, "id" | "createdAt">,
  ): Promise<ExecutiveAuditEntry> {
    const row = await this.prisma.executiveAuditLog.create({
      data: {
        companyId: entry.companyId,
        instanceId: entry.instanceId,
        executiveId: entry.executiveId,
        action: entry.action,
        actorType: entry.actorType,
        actorId: entry.actorId,
        metadata: entry.metadata as object,
        correlationId: entry.correlationId,
        traceId: entry.traceId,
      },
    });

    this.logger.debug(`Audit: ${entry.action} [${entry.correlationId ?? "no-corr"}]`);
    return rowToAudit(row);
  }

  async query(
    companyId: string,
    filters?: { executiveId?: string; limit?: number },
  ): Promise<ExecutiveAuditEntry[]> {
    const rows = await this.prisma.executiveAuditLog.findMany({
      where: {
        companyId,
        ...(filters?.executiveId ? { executiveId: filters.executiveId } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: filters?.limit ?? 50,
    });
    return rows.map(rowToAudit);
  }
}
