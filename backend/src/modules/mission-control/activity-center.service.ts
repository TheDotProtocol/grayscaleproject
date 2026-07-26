import { Injectable } from "@nestjs/common";
import type { ActivityCenterPort, ActivityCenterFeed, ActivityCenterEntry } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ActivityCenterService implements ActivityCenterPort {
  constructor(private readonly prisma: PrismaService) {}

  async getFeed(companyId: string, options?: { limit?: number }): Promise<ActivityCenterFeed> {
    const limit = options?.limit ?? 50;
    const rows = await this.prisma.domainEvent.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const entries: ActivityCenterEntry[] = rows.map((row) => {
      const payload = row.payload as Record<string, unknown>;
      const actorType = this.resolveActorType(row.source, row.type);
      return {
        id: row.id,
        companyId: row.companyId,
        actor: row.source,
        actorType,
        action: row.type,
        target: this.resolveTarget(row.type, payload),
        reason: typeof payload.reason === "string" ? payload.reason : undefined,
        evidence: Array.isArray(payload.evidence)
          ? payload.evidence.filter((e): e is string => typeof e === "string")
          : undefined,
        confidence: typeof payload.confidence === "number" ? payload.confidence : undefined,
        occurredAt: row.createdAt.toISOString(),
        correlationId: row.correlationId,
        auditable: true as const,
      };
    });

    return {
      companyId,
      entries,
      assembledAt: new Date().toISOString(),
    };
  }

  private resolveActorType(source: string, type: string): ActivityCenterEntry["actorType"] {
    if (source.includes("council") || type.includes("council")) return "council";
    if (source.includes("executive") || type.includes("executive")) return "executive";
    if (source.includes("founder") || type.includes("founder")) return "founder";
    return "system";
  }

  private resolveTarget(type: string, payload: Record<string, unknown>): string {
    if (typeof payload.target === "string") return payload.target;
    if (typeof payload.title === "string") return payload.title;
    if (typeof payload.name === "string") return payload.name;
    if (typeof payload.pluginId === "string") return payload.pluginId;
    return type;
  }
}
