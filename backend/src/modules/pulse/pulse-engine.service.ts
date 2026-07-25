import { Injectable, Logger } from "@nestjs/common";
import { Subject, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import {
  PLUGIN_HOOKS,
  type DomainEvent,
  type PulseHeartbeat,
  type CompanyPulseHealth,
  type PulseCategory,
  domainEventToPulse,
  createPulseHeartbeat,
  PULSE_EVENTS,
  type PulseEventType,
  type PulseSeverity,
} from "@grayscale/shared";
import { PrismaService } from "../../prisma/prisma.service";
import { PluginsService } from "../plugins/plugins.service";

/**
 * The Pulse Engine — invisible service that turns domain events into operational heartbeats.
 * Mission Control subscribes to build a real-time picture of company health.
 */
@Injectable()
export class PulseEngineService {
  private readonly logger = new Logger(PulseEngineService.name);
  private readonly stream$ = new Subject<PulseHeartbeat>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly plugins: PluginsService,
  ) {}

  /** Ingest a domain event from the event bus → persist pulse → notify subscribers */
  async ingestFromDomainEvent(event: DomainEvent): Promise<PulseHeartbeat | null> {
    const mapped = domainEventToPulse(event);
    if (!mapped) return null;

    return this.persist(mapped);
  }

  /** Emit a pulse directly (e.g. sprint.completed from Mission Control) */
  async emit(input: {
    companyId: string;
    type: PulseEventType;
    title: string;
    summary?: string;
    severity?: PulseSeverity;
    category: PulseHeartbeat["category"];
    payload?: Record<string, unknown>;
    source?: string;
    correlationId?: string;
  }): Promise<PulseHeartbeat> {
    return this.persist({
      companyId: input.companyId,
      type: input.type,
      title: input.title,
      summary: input.summary,
      severity: input.severity ?? "info",
      category: input.category,
      payload: input.payload ?? {},
      correlationId: input.correlationId ?? crypto.randomUUID(),
      source: input.source ?? "pulse-engine",
    });
  }

  observe(companyId: string): Observable<{ data: PulseHeartbeat }> {
    return this.stream$.pipe(
      filter((pulse) => pulse.companyId === companyId),
      map((pulse) => ({ data: pulse })),
    );
  }

  async getRecent(companyId: string, limit = 50): Promise<PulseHeartbeat[]> {
    const rows = await this.prisma.pulseEvent.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return rows.map(rowToPulse);
  }

  async getHealth(companyId: string): Promise<CompanyPulseHealth> {
    const since = new Date();
    since.setHours(since.getHours() - 24);

    const recent = await this.prisma.pulseEvent.findMany({
      where: { companyId, createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
    });

    const pulses = recent.map(rowToPulse);
    const critical = pulses.filter((p) => p.severity === "critical").length;
    const warning = pulses.filter((p) => p.severity === "warning").length;

    const byCategory = emptyCategoryCounts();
    for (const p of pulses) {
      byCategory[p.category] = (byCategory[p.category] ?? 0) + 1;
    }

    let score = 100;
    score -= critical * 15;
    score -= warning * 5;
    score = Math.max(0, Math.min(100, score));

    const status: CompanyPulseHealth["status"] =
      critical > 0 ? "critical" : warning > 2 ? "attention" : "healthy";

    return {
      companyId,
      score,
      status,
      lastPulseAt: pulses[0]?.timestamp ?? null,
      counts: { last24h: pulses.length, critical, warning },
      byCategory,
      recent: pulses.slice(0, 12),
    };
  }

  private async persist(
    input: Omit<PulseHeartbeat, "id" | "timestamp">,
  ): Promise<PulseHeartbeat> {
    const heartbeat = createPulseHeartbeat(input);

    await this.prisma.pulseEvent.create({
      data: {
        id: heartbeat.id,
        companyId: heartbeat.companyId,
        type: heartbeat.type,
        domainType: heartbeat.domainType,
        title: heartbeat.title,
        summary: heartbeat.summary,
        severity: heartbeat.severity,
        category: heartbeat.category,
        payload: heartbeat.payload as object,
        correlationId: heartbeat.correlationId,
        source: heartbeat.source,
        createdAt: new Date(heartbeat.timestamp),
      },
    });

    await this.plugins.dispatch(PLUGIN_HOOKS.ON_PULSE, { pulse: heartbeat });
    this.stream$.next(heartbeat);
    this.logger.log(`Pulse ${heartbeat.type} → ${heartbeat.title} [${heartbeat.companyId}]`);

    return heartbeat;
  }
}

function rowToPulse(row: {
  id: string;
  companyId: string;
  type: string;
  domainType: string | null;
  title: string;
  summary: string | null;
  severity: string;
  category: string;
  payload: unknown;
  correlationId: string;
  source: string;
  createdAt: Date;
}): PulseHeartbeat {
  return {
    id: row.id,
    companyId: row.companyId,
    type: row.type as PulseEventType,
    domainType: row.domainType as PulseHeartbeat["domainType"],
    title: row.title,
    summary: row.summary ?? undefined,
    severity: row.severity as PulseHeartbeat["severity"],
    category: row.category as PulseCategory,
    payload: row.payload as Record<string, unknown>,
    correlationId: row.correlationId,
    source: row.source,
    timestamp: row.createdAt.toISOString(),
  };
}

function emptyCategoryCounts(): Record<PulseCategory, number> {
  return {
    project: 0,
    billing: 0,
    sprint: 0,
    repository: 0,
    meeting: 0,
    integration: 0,
    ai: 0,
    system: 0,
  };
}

/** Re-export for mission control sprint completion */
export { PULSE_EVENTS };
