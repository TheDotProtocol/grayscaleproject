import { Injectable } from "@nestjs/common";
import type { GovernancePort, GovernanceEntry, GovernanceEntryType } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";
import { EventsService } from "../events/events.service";

@Injectable()
export class GovernanceService implements GovernancePort {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventsService,
  ) {}

  async record(
    entry: Omit<GovernanceEntry, "id" | "recordedAt" | "correlationId"> & { correlationId?: string },
  ): Promise<GovernanceEntry> {
    const correlationId = entry.correlationId ?? crypto.randomUUID();

    const event = await this.events.publish("platform.governance.recorded", "platform", {
      type: entry.type,
      title: entry.title,
      description: entry.description,
      actorId: entry.actorId,
      metadata: entry.metadata,
    }, { source: "governance", userId: entry.actorId });

    const row = await this.prisma.governanceEntry.create({
      data: {
        type: entry.type,
        title: entry.title,
        description: entry.description,
        actorId: entry.actorId,
        correlationId,
        eventId: event.id,
        metadata: entry.metadata as object,
      },
    });

    return this.toEntry(row);
  }

  async search(q?: string, type?: GovernanceEntryType, limit = 50): Promise<GovernanceEntry[]> {
    const rows = await this.prisma.governanceEntry.findMany({
      where: {
        ...(type ? { type } : {}),
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { recordedAt: "desc" },
      take: limit,
    });
    return rows.map((r) => this.toEntry(r));
  }

  private toEntry(row: {
    id: string;
    type: string;
    title: string;
    description: string;
    actorId: string | null;
    correlationId: string;
    eventId: string | null;
    metadata: unknown;
    recordedAt: Date;
  }): GovernanceEntry {
    return {
      id: row.id,
      type: row.type as GovernanceEntryType,
      title: row.title,
      description: row.description,
      actorId: row.actorId ?? undefined,
      correlationId: row.correlationId,
      eventId: row.eventId ?? undefined,
      metadata: (row.metadata ?? {}) as Record<string, unknown>,
      recordedAt: row.recordedAt.toISOString(),
    };
  }
}
