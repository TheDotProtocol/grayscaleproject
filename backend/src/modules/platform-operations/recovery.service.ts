import { Injectable } from "@nestjs/common";
import type { RecoveryPort, RecoveryOperation, RecoveryType } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";
import { EventsService } from "../events/events.service";

@Injectable()
export class RecoveryService implements RecoveryPort {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventsService,
  ) {}

  async execute(
    type: RecoveryType,
    parameters: Record<string, unknown>,
    initiatedBy?: string,
  ): Promise<RecoveryOperation> {
    const row = await this.prisma.platformRecoveryOperation.create({
      data: {
        type,
        subsystem: (parameters.subsystem as string) ?? "event-store",
        status: "running",
        parameters: parameters as object,
        initiatedBy,
      },
    });

    try {
      let result: Record<string, unknown> = {};
      switch (type) {
        case "replay":
          result = (await this.events.replay({
            companyId: parameters.companyId as string,
            fromSequence: parameters.fromSequence ? BigInt(parameters.fromSequence as number) : undefined,
            toSequence: parameters.toSequence ? BigInt(parameters.toSequence as number) : undefined,
            dryRun: parameters.dryRun as boolean,
          })) as unknown as Record<string, unknown>;
          break;
        case "snapshot":
          result = await this.createSnapshot(parameters.name as string);
          break;
        case "platform_rebuild":
          if (!parameters.confirmRebuild) throw new Error("confirmRebuild required");
          result = (await this.events.replay({
            companyId: parameters.companyId as string,
            dryRun: false,
          })) as unknown as Record<string, unknown>;
          break;
        default:
          result = { message: `Recovery type ${type} queued` };
      }

      await this.prisma.platformRecoveryOperation.update({
        where: { id: row.id },
        data: { status: "completed", result: result as object, completedAt: new Date() },
      });

      return this.toOp({ ...row, status: "completed", result, completedAt: new Date() });
    } catch (e) {
      const error = e instanceof Error ? e.message : "Recovery failed";
      await this.prisma.platformRecoveryOperation.update({
        where: { id: row.id },
        data: { status: "failed", error, completedAt: new Date() },
      });
      throw e;
    }
  }

  async get(id: string) {
    const row = await this.prisma.platformRecoveryOperation.findUnique({ where: { id } });
    return row ? this.toOp(row) : null;
  }

  async list(limit = 20) {
    const rows = await this.prisma.platformRecoveryOperation.findMany({
      orderBy: { startedAt: "desc" },
      take: limit,
    });
    return rows.map((r) => this.toOp(r));
  }

  private async createSnapshot(name: string) {
    const tables = {
      domainEvents: await this.prisma.domainEvent.count(),
      memoryRecords: await this.prisma.memoryRecord.count(),
      graphNodes: await this.prisma.graphNode.count(),
    };
    const snap = await this.prisma.platformSnapshot.create({
      data: { name, description: "Platform state snapshot", tables: tables as object },
    });
    return { snapshotId: snap.id, tables };
  }

  private toOp(row: {
    id: string;
    type: string;
    subsystem: string;
    status: string;
    parameters: unknown;
    result: unknown;
    error: string | null;
    initiatedBy: string | null;
    startedAt: Date;
    completedAt: Date | null;
  }): RecoveryOperation {
    return {
      id: row.id,
      type: row.type as RecoveryType,
      subsystem: row.subsystem,
      status: row.status as RecoveryOperation["status"],
      parameters: (row.parameters ?? {}) as Record<string, unknown>,
      result: row.result ? (row.result as Record<string, unknown>) : undefined,
      error: row.error ?? undefined,
      initiatedBy: row.initiatedBy ?? undefined,
      startedAt: row.startedAt.toISOString(),
      completedAt: row.completedAt?.toISOString(),
    };
  }
}
