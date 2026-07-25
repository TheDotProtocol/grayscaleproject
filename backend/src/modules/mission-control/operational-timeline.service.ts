import { Injectable } from "@nestjs/common";
import type { OperationalTimelinePort, OperationalTimelineEntry } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class OperationalTimelineService implements OperationalTimelinePort {
  constructor(private readonly prisma: PrismaService) {}

  async getTimeline(
    companyId: string,
    options?: { limit?: number; offset?: number; types?: string[] },
  ): Promise<OperationalTimelineEntry[]> {
    const rows = await this.prisma.domainEvent.findMany({
      where: {
        companyId,
        ...(options?.types?.length ? { type: { in: options.types } } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: options?.limit ?? 100,
      skip: options?.offset ?? 0,
    });

    return rows.map((row) => {
      const payload = row.payload as Record<string, unknown>;
      const category = row.type.split(".")[0] ?? "unknown";
      const title = this.resolveTitle(row.type, payload);
      return {
        id: row.id,
        companyId: row.companyId,
        type: row.type,
        category,
        title,
        summary: typeof payload.summary === "string" ? payload.summary : undefined,
        source: row.source,
        status: row.status,
        occurredAt: row.createdAt.toISOString(),
        correlationId: row.correlationId,
        metadata: { sequence: row.sequence.toString(), version: row.version },
      };
    });
  }

  private resolveTitle(type: string, payload: Record<string, unknown>): string {
    if (typeof payload.title === "string") return payload.title;
    if (typeof payload.message === "string") return payload.message;
    if (typeof payload.name === "string") return payload.name;
    if (typeof payload.pluginId === "string") return `${type}: ${payload.pluginId}`;
    if (typeof payload.provider === "string") return `${type}: ${payload.provider}`;
    return type;
  }
}
