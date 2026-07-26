import { Injectable } from "@nestjs/common";
import type {
  OrganizationalTimelinePort,
  OrganizationalTimelineEntry,
  OrganizationalTimelineCategory,
} from "@grayscale/platform";
import { OperationalTimelineService } from "./operational-timeline.service";
import { CouncilSessionService } from "../council-runtime/council-session.service";
import { PrismaService } from "../../prisma/prisma.service";

const CATEGORY_MAP: Record<string, OrganizationalTimelineCategory> = {
  council: "council",
  executive: "executive_discovery",
  athena: "executive_discovery",
  twin: "evolution",
  evolution: "evolution",
  learning: "learning",
  wisdom: "wisdom",
  strategy: "strategy",
  forecast: "forecast",
  simulation: "simulation",
  reflection: "reflection",
  founder: "founder_override",
  automation: "automation",
  platform: "mission_control",
  mission: "mission_control",
  integration: "mission_control",
  notification: "mission_control",
};

@Injectable()
export class OrganizationalTimelineService implements OrganizationalTimelinePort {
  constructor(
    private readonly operational: OperationalTimelineService,
    private readonly councilSessions: CouncilSessionService,
    private readonly prisma: PrismaService,
  ) {}

  async getUnifiedTimeline(
    companyId: string,
    options?: { limit?: number; categories?: OrganizationalTimelineCategory[] },
  ): Promise<OrganizationalTimelineEntry[]> {
    const limit = options?.limit ?? 100;
    const entries: OrganizationalTimelineEntry[] = [];

    const [ops, councilSessions, evolutionEvents, journalEntries] = await Promise.all([
      this.operational.getTimeline(companyId, { limit: limit * 2 }),
      Promise.resolve(this.councilSessions.listSessions(companyId)),
      this.prisma.domainEvent.findMany({
        where: {
          companyId,
          type: {
            in: [
              "evolution.learning.milestone",
              "evolution.wisdom.recorded",
              "evolution.strategy.updated",
              "evolution.reflection.completed",
              "evolution.certification.changed",
              "twin.version.created",
              "simulation.completed",
              "forecast.updated",
            ],
          },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      }).catch(() => []),
      this.prisma.journalEntry.findMany({
        where: { companyId },
        orderBy: { createdAt: "desc" },
        take: 20,
      }).catch(() => []),
    ]);

    for (const op of ops) {
      const category = this.resolveCategory(op.type, op.category);
      entries.push({
        id: op.id,
        companyId: op.companyId,
        category,
        title: op.title,
        summary: op.summary,
        occurredAt: op.occurredAt,
        source: op.source,
        correlationId: op.correlationId,
      });
    }

    for (const session of councilSessions) {
      entries.push({
        id: `council-${session.id}`,
        companyId,
        category: "council",
        title: session.title || `Council session ${session.status}`,
        summary: session.status,
        occurredAt: session.startedAt ?? session.constitutionalCompliance.checkedAt,
        source: "council-runtime",
        correlationId: session.correlationId,
      });
    }

    for (const ev of evolutionEvents) {
      const payload = ev.payload as Record<string, unknown>;
      entries.push({
        id: ev.id,
        companyId,
        category: this.resolveCategory(ev.type, ev.type.split(".")[0]),
        title: typeof payload.title === "string" ? payload.title : ev.type,
        summary: typeof payload.summary === "string" ? payload.summary : undefined,
        occurredAt: ev.createdAt.toISOString(),
        source: ev.source,
        correlationId: ev.correlationId,
        confidence: typeof payload.confidence === "number" ? payload.confidence : undefined,
      });
    }

    for (const j of journalEntries) {
      entries.push({
        id: `journal-${j.id}`,
        companyId,
        category: "reflection",
        title: j.summary ?? "Founder journal entry",
        summary: j.content.slice(0, 120),
        occurredAt: j.createdAt.toISOString(),
        source: "founder",
      });
    }

    const filtered = options?.categories?.length
      ? entries.filter((e) => options.categories!.includes(e.category))
      : entries;

    return filtered
      .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
      .slice(0, limit);
  }

  private resolveCategory(type: string, fallback: string): OrganizationalTimelineCategory {
    const prefix = type.split(".")[0]?.toLowerCase() ?? fallback;
    if (type.includes("council")) return "council";
    if (type.includes("simulation")) return "simulation";
    if (type.includes("forecast")) return "forecast";
    if (type.includes("learning")) return "learning";
    if (type.includes("wisdom")) return "wisdom";
    if (type.includes("strategy")) return "strategy";
    if (type.includes("reflection")) return "reflection";
    if (type.includes("twin")) return "evolution";
    if (type.includes("founder") || type.includes("override")) return "founder_override";
    if (type.includes("automation") || type.includes("approval")) return "automation";
    return CATEGORY_MAP[prefix] ?? "platform";
  }
}
