import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  storedToPlatformEvent,
  type CompanyContext,
  type CompanyContextAssemblerPort,
} from "@grayscale/platform";
import { isExecutivesEnabled } from "@grayscale/shared";
import { PrismaService } from "../../prisma/prisma.service";
import { StrategyEngineService } from "../intelligence/strategy-engine.service";
import { GraphSummaryService } from "../graph/graph-summary.service";
import { MemoryQueryService } from "../memory/memory-query.service";
import { PulseEngineService } from "../pulse/pulse-engine.service";
import { PluginsService } from "../plugins/plugins.service";
import { EventStoreService } from "../events/event-store.service";

@Injectable()
export class CompanyContextService implements CompanyContextAssemblerPort {
  constructor(
    private readonly prisma: PrismaService,
    private readonly strategy: StrategyEngineService,
    private readonly graphSummary: GraphSummaryService,
    private readonly memoryQuery: MemoryQueryService,
    private readonly pulse: PulseEngineService,
    private readonly plugins: PluginsService,
    private readonly eventStore: EventStoreService,
    private readonly config: ConfigService,
  ) {}

  async assemble(
    companyId: string,
    options?: { correlationId?: string; founderUserId?: string },
  ): Promise<CompanyContext> {
    const correlationId = options?.correlationId ?? crypto.randomUUID();
    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new NotFoundException("Company not found");

    const [
      strategy,
      graph,
      memoryResult,
      pulseHealth,
      bills,
      timeline,
      integrations,
      pluginManifests,
      recentStored,
      projectNodes,
      taskNodes,
      founderMember,
    ] = await Promise.all([
      this.strategy.buildContext(companyId),
      this.graphSummary.getSummary(companyId),
      this.memoryQuery.search(companyId, { limit: 25 }),
      this.pulse.getHealth(companyId),
      this.prisma.bill.findMany({
        where: { companyId },
        orderBy: { dueDate: "asc" },
        take: 20,
      }),
      this.prisma.timelineEvent.findMany({
        where: { companyId },
        orderBy: { occurredAt: "desc" },
        take: 15,
      }),
      this.prisma.integration.findMany({ where: { companyId } }),
      Promise.resolve(this.plugins.list()),
      this.eventStore.findForReplay({ companyId, limit: 20 }),
      this.prisma.graphNode.findMany({
        where: { companyId, nodeType: "project", lifecycleStatus: "active" },
        take: 20,
      }),
      this.prisma.graphNode.findMany({
        where: { companyId, nodeType: "task", lifecycleStatus: "active" },
        take: 50,
      }),
      options?.founderUserId
        ? this.prisma.companyMember.findFirst({
            where: { companyId, userId: options.founderUserId, role: "founder" },
            include: { user: { include: { founderProfile: true } } },
          })
        : this.prisma.companyMember.findFirst({
            where: { companyId, role: "founder" },
            include: { user: { include: { founderProfile: true } } },
          }),
    ]);

    const now = new Date();
    const unpaid = bills.filter((b) => !b.isPaid);
    const overdue = unpaid.filter((b) => b.dueDate < now);

    const founder = founderMember?.user
      ? {
          userId: founderMember.user.id,
          name: founderMember.user.name,
          email: founderMember.user.email,
          bio: founderMember.user.founderProfile?.bio ?? undefined,
          timezone: founderMember.user.founderProfile?.timezone ?? "UTC",
          preferences: (founderMember.user.founderProfile?.preferences ?? {}) as Record<string, unknown>,
        }
      : undefined;

    const pulseCategories: Record<string, number> = {};
    for (const [cat, count] of Object.entries(pulseHealth.byCategory ?? {})) {
      pulseCategories[cat] = count as number;
    }

    return {
      companyId,
      assembledAt: new Date().toISOString(),
      correlationId,
      company: {
        id: company.id,
        name: company.name,
        slug: company.slug,
        stage: company.stage,
        industry: company.industry ?? undefined,
        metadata: (company.metadata ?? {}) as Record<string, unknown>,
      },
      founder,
      operatingMode: strategy.operatingMode,
      goals: strategy.goals,
      objectives: strategy.objectives,
      projects: projectNodes.map((n) => ({
        id: n.sourceId ?? n.id,
        name: n.displayName,
        status: (n.metadata as { status?: string })?.status ?? "active",
        source: "graph" as const,
      })),
      tasks: taskNodes.map((n) => ({
        id: n.sourceId ?? n.id,
        title: n.displayName,
        status: (n.metadata as { status?: string })?.status ?? "open",
        projectId: (n.metadata as { projectId?: string })?.projectId,
      })),
      timeline: timeline.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description ?? undefined,
        occurredAt: t.occurredAt.toISOString(),
        category: t.eventType,
      })),
      memory: memoryResult.items,
      graph,
      strategy,
      recommendations: strategy.openRecommendations,
      decisions: strategy.pendingDecisions,
      risks: strategy.topRisks,
      opportunities: strategy.topOpportunities,
      bills: bills.map((b) => ({
        id: b.id,
        name: b.name,
        amountCents: b.amountCents,
        currency: b.currency,
        dueDate: b.dueDate.toISOString(),
        isPaid: b.isPaid,
        category: b.category ?? undefined,
      })),
      cashPosition: {
        totalUnpaidCents: unpaid.reduce((s, b) => s + b.amountCents, 0),
        totalOverdueCents: overdue.reduce((s, b) => s + b.amountCents, 0),
        currency: bills[0]?.currency ?? "USD",
      },
      pulse: {
        recentCount: pulseHealth.counts.last24h,
        healthScore: pulseHealth.score,
        categories: pulseCategories,
      },
      missionStatus: {
        activeGoals: strategy.goals.filter((g) => g.status === "active").length,
        openRecommendations: strategy.openRecommendations.length,
        pendingDecisions: strategy.pendingDecisions.length,
        blockedObjectives: strategy.objectives.filter((o) => o.status === "blocked").length,
        criticalRisks: strategy.topRisks.filter((r) => r.severity === "critical").length,
      },
      plugins: pluginManifests.map((p) => ({
        id: p.id,
        name: p.name,
        version: p.version,
        hooks: p.hooks,
        source: p.source ?? "unknown",
      })),
      infrastructure: {
        databaseConnected: true,
        eventStoreHealthy: true,
        graphNodeCount: graph.nodeCount,
        memoryRecordCount: memoryResult.total,
      },
      security: {
        executivesEnabled: isExecutivesEnabled(this.config.get("EXECUTIVES_ENABLED")),
        activeIntegrations: integrations.filter((i) => i.status === "connected").length,
        disconnectedIntegrations: integrations.filter((i) => i.status !== "connected").length,
      },
      integrations: integrations.map((i) => ({
        id: i.id,
        provider: i.provider,
        status: i.status,
        lastSyncAt: i.lastSyncAt?.toISOString(),
      })),
      recentEvents: recentStored
        .slice()
        .reverse()
        .map((e) => storedToPlatformEvent(e)),
    };
  }
}
