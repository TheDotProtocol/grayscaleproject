import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  storedToPlatformEvent,
  createFounderConstitutionContext,
  type CompanyContext,
  type ContextAssemblerResult,
  type ImmutableCompanyContext,
} from "@grayscale/platform";
import { isExecutivesEnabled } from "@grayscale/shared";
import { PrismaService } from "../../prisma/prisma.service";
import { StrategyEngineService } from "../intelligence/strategy-engine.service";
import { GraphSummaryService } from "../graph/graph-summary.service";
import { MemoryQueryService } from "../memory/memory-query.service";
import { PulseEngineService } from "../pulse/pulse-engine.service";
import { PluginsService } from "../plugins/plugins.service";
import { EventStoreService } from "../events/event-store.service";
import { ReliabilityEngineService } from "../platform-operations/reliability-engine.service";
import { GovernanceService } from "../platform-operations/governance.service";
import { SecurityObservatoryService } from "../platform-operations/security-observatory.service";
import { OrganizationalIntelligenceAssemblerService } from "./organizational-intelligence-assembler.service";
import { IntentEngineService } from "./intent-engine.service";
import { TemporalEngineService } from "./temporal-engine.service";
import { OrganizationalSignalBusService } from "./organizational-signal-bus.service";
import { OrganizationalInsightEngineService } from "./organizational-insight-engine.service";
import { AttentionEngineService } from "./attention-engine.service";
import { TwinEngineService } from "./twin-engine.service";
import { CouncilContextAssemblerService } from "../council-runtime/council-context-assembler.service";
import { SignalCorrelationService } from "./signal-correlation.service";
import { HomeostasisEngineService } from "./homeostasis-engine.service";
import { SimulationContextService } from "../twin-runtime/simulation-context.service";
import { ForesightEngineService } from "./foresight-engine.service";
import { AntifragilityEngineService } from "./antifragility-engine.service";
import { DecisionEconomyEngineService } from "./decision-economy-engine.service";
import { AlignmentEngineService } from "./alignment-engine.service";
import { ScenarioPlanningService } from "./scenario-planning.service";
import { ForecastContextService } from "./forecast-context.service";
import { RuntimeContextService } from "../runtime/runtime-context.service";
import { RuntimeCoordinatorService } from "../runtime/runtime-coordinator.service";
import { AttentionBudgetContextService } from "../attention-budget/attention-budget-context.service";
import { OrganizationalRuntimeModule } from "../runtime/runtime.module";
import { AttentionBudgetModule } from "../attention-budget/attention-budget.module";
import { PolicyEngineModule } from "../policy-engine/policy-engine.module";
import { PolicyEngineContextService } from "../policy-engine/policy-engine-context.service";

const CONTEXT_VERSION = "2.3.0-s4d-policy-engine";

@Injectable()
export class CompanyContextAssemblerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly strategy: StrategyEngineService,
    private readonly graphSummary: GraphSummaryService,
    private readonly memoryQuery: MemoryQueryService,
    private readonly pulse: PulseEngineService,
    private readonly plugins: PluginsService,
    private readonly eventStore: EventStoreService,
    private readonly config: ConfigService,
    private readonly orgIntel: OrganizationalIntelligenceAssemblerService,
    private readonly intent: IntentEngineService,
    private readonly temporal: TemporalEngineService,
    private readonly signals: OrganizationalSignalBusService,
    private readonly insights: OrganizationalInsightEngineService,
    private readonly reliability: ReliabilityEngineService,
    private readonly governance: GovernanceService,
    private readonly security: SecurityObservatoryService,
    private readonly attention: AttentionEngineService,
    private readonly twinEngine: TwinEngineService,
    private readonly councilContext: CouncilContextAssemblerService,
    private readonly signalCorrelation: SignalCorrelationService,
    private readonly homeostasis: HomeostasisEngineService,
    private readonly simulationContext: SimulationContextService,
    private readonly foresight: ForesightEngineService,
    private readonly antifragility: AntifragilityEngineService,
    private readonly decisionEconomy: DecisionEconomyEngineService,
    private readonly alignment: AlignmentEngineService,
    private readonly scenarioPlanning: ScenarioPlanningService,
    private readonly forecastContext: ForecastContextService,
    private readonly runtimeContext: RuntimeContextService,
    private readonly runtimeCoordinator: RuntimeCoordinatorService,
    private readonly attentionBudgetContext: AttentionBudgetContextService,
    private readonly policyEngineContext: PolicyEngineContextService,
  ) {}

  async assemble(
    companyId: string,
    options?: { correlationId?: string; founderUserId?: string },
  ): Promise<ImmutableCompanyContext> {
    const start = Date.now();
    const correlationId = options?.correlationId ?? crypto.randomUUID();
    const assemblerResults: ContextAssemblerResult[] = [];

    const wrap = async <T>(
      assemblerId: ContextAssemblerResult["assemblerId"],
      version: string,
      fn: () => Promise<T>,
    ): Promise<T | undefined> => {
      const t0 = Date.now();
      try {
        const result = await fn();
        assemblerResults.push({
          assemblerId,
          version,
          durationMs: Date.now() - t0,
          success: true,
        });
        return result;
      } catch (err) {
        assemblerResults.push({
          assemblerId,
          version,
          durationMs: Date.now() - t0,
          success: false,
          error: err instanceof Error ? err.message : String(err),
        });
        return undefined;
      }
    };

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
      organizationalIntelligence,
      intentContext,
      temporalContext,
      signalSnapshot,
      insightSnapshot,
      reliabilitySnapshot,
      governanceSummary,
      securitySummary,
      attentionSnapshot,
    ] = await Promise.all([
      wrap("strategic", "1.0", () => this.strategy.buildContext(companyId)),
      wrap("graph", "1.0", () => this.graphSummary.getSummary(companyId)),
      wrap("memory", "1.0", () => this.memoryQuery.search(companyId, { limit: 25 })),
      wrap("pulse", "1.0", () => this.pulse.getHealth(companyId)),
      wrap("financial", "1.0", () =>
        this.prisma.bill.findMany({ where: { companyId }, orderBy: { dueDate: "asc" }, take: 20 }),
      ),
      wrap("timeline", "1.0", () =>
        this.prisma.timelineEvent.findMany({
          where: { companyId },
          orderBy: { occurredAt: "desc" },
          take: 15,
        }),
      ),
      wrap("integration", "1.0", () => this.prisma.integration.findMany({ where: { companyId } })),
      wrap("plugin", "1.0", () => Promise.resolve(this.plugins.list())),
      wrap("operational", "1.0", () => this.eventStore.findForReplay({ companyId, limit: 20 })),
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
      wrap("organizational-intelligence", "1.0", () =>
        this.orgIntel.assemble(companyId, { founderUserId: options?.founderUserId }),
      ),
      wrap("intent", "1.0", () => this.intent.getContext(companyId)),
      wrap("temporal", "1.0", () => this.temporal.getContext(companyId)),
      wrap("signals", "1.0", () => this.signals.getSnapshot(companyId)),
      wrap("insights", "1.0", () => this.insights.getSnapshot(companyId)),
      wrap("platform-reliability", "1.0", () => this.reliability.computeAll()),
      wrap("governance", "1.0", () => this.governance.search(undefined, undefined, 5)),
      wrap("security", "1.0", () => this.security.assess(companyId)),
      wrap("attention", "1.0", () => this.attention.assemble(companyId)),
    ]);

    const councilSnapshot = await wrap("council", "1.0", async () =>
      Promise.resolve(this.councilContext.assemble(companyId)),
    );

    const signalCorrelationSnapshot = await wrap("signal-correlation", "1.0", () =>
      this.signalCorrelation.correlate(companyId),
    );

    const homeostasisSnapshot = await wrap("homeostasis", "1.1", () =>
      this.homeostasis.assess(companyId),
    );

    const simulationSnapshot = await wrap("simulation", "1.1", () =>
      this.simulationContext.assemble(companyId),
    );

    const [foresightSnapshot, antifragilitySnapshot, decisionEconomySnapshot, alignmentSnapshot, scenarioPlanningSnapshot, forecastSnapshot] =
      await Promise.all([
        wrap("foresight", "1.0", () => this.foresight.assemble(companyId)),
        wrap("antifragility", "1.0", () => this.antifragility.assess(companyId)),
        wrap("decision-economy", "1.0", () => this.decisionEconomy.assess(companyId)),
        wrap("alignment", "1.0", () => this.alignment.assess(companyId)),
        wrap("scenario-planning", "1.0", () => this.scenarioPlanning.plan(companyId, { twinVersionId: undefined })),
        wrap("forecast", "1.1", () => this.forecastContext.assemble(companyId)),
      ]);

    const runtimeBundle = await wrap("organizational-runtime", "1.0", async () => {
      const snapshot = await this.runtimeContext.assemble(companyId);
      const metrics = await this.runtimeCoordinator.getMetrics(companyId);
      return { snapshot, metrics };
    });

    const attentionBudgetBundle = await wrap("attention-budget", "1.0", () =>
      this.attentionBudgetContext.assemble(companyId),
    );

    const policyEngineBundle = await wrap("policy-engine", "1.0", () =>
      this.policyEngineContext.assemble(companyId),
    );

    if (!strategy || !graph || !memoryResult || !pulseHealth) {
      throw new Error("Required context assemblers failed");
    }

    const now = new Date();
    const unpaid = (bills ?? []).filter((b) => !b.isPaid);
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

    const base: CompanyContext = {
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
      timeline: (timeline ?? []).map((t) => ({
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
      bills: (bills ?? []).map((b) => ({
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
        currency: bills?.[0]?.currency ?? "USD",
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
      plugins: (pluginManifests ?? []).map((p) => ({
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
        activeIntegrations: (integrations ?? []).filter((i) => i.status === "connected").length,
        disconnectedIntegrations: (integrations ?? []).filter((i) => i.status !== "connected").length,
      },
      integrations: (integrations ?? []).map((i) => ({
        id: i.id,
        provider: i.provider,
        status: i.status,
        lastSyncAt: i.lastSyncAt?.toISOString(),
      })),
      recentEvents: (recentStored ?? [])
        .slice()
        .reverse()
        .map((e) => storedToPlatformEvent(e)),
      organizationalIntelligence,
      intent: intentContext,
      temporal: temporalContext,
      signals: signalSnapshot,
      insights: insightSnapshot,
      founderConstitution: createFounderConstitutionContext(),
      attention: attentionSnapshot,
      ...(councilSnapshot ?? {}),
    };

    const twinSnapshot = await wrap("twin", "1.0", () =>
      this.twinEngine.assembleFromContext(
        { ...base, contextRuntime: undefined } as CompanyContext,
        `ver-${correlationId.slice(0, 8)}`,
        correlationId,
      ),
    );

    const attentionHealthSnapshot = attentionSnapshot
      ? {
          companyId,
          score: 1 - attentionSnapshot.saturation.level,
          saturation: attentionSnapshot.saturation,
          driftDetected: !!attentionSnapshot.drift,
          assessedAt: new Date().toISOString(),
        }
      : undefined;

    assemblerResults.push({
      assemblerId: "readiness",
      version: "1.0",
      durationMs: 0,
      success: true,
    });

    const cacheKey = `ctx:${companyId}:${options?.founderUserId ?? "default"}`;

    return {
      ...base,
      twin: twinSnapshot,
      organizationalTwin: twinSnapshot,
      organizationalAttention: attentionSnapshot,
      attentionHealth: attentionHealthSnapshot,
      twinHealth: twinSnapshot?.health,
      twinState: twinSnapshot?.present,
      signalCorrelation: signalCorrelationSnapshot,
      homeostasis: homeostasisSnapshot,
      organizationalHomeostasis: homeostasisSnapshot,
      simulation: simulationSnapshot,
      activeSimulations: simulationSnapshot?.activeSimulations,
      simulationHealth: simulationSnapshot?.simulationHealth,
      simulationHistory: simulationSnapshot?.recentSessions,
      simulationCapabilities: simulationSnapshot?.simulationCapabilities,
      simulationMetrics: simulationSnapshot
        ? {
            totalSessions: simulationSnapshot.recentSessions.length,
            completedSessions: simulationSnapshot.recentSessions.filter((s) => s.status === "completed").length,
            averageDurationMs: 0,
          }
        : undefined,
      foresight: foresightSnapshot,
      organizationalForesight: foresightSnapshot,
      antifragility: antifragilitySnapshot,
      decisionEconomy: decisionEconomySnapshot,
      alignment: alignmentSnapshot,
      organizationalAlignment: alignmentSnapshot,
      scenarioPlanning: scenarioPlanningSnapshot,
      forecast: forecastSnapshot,
      forecastContext: forecastSnapshot,
      organizationalRuntime: runtimeBundle?.snapshot,
      runtimeHealth: runtimeBundle?.snapshot?.health,
      runtimeMetrics: runtimeBundle?.metrics,
      ...attentionBudgetBundle,
      ...policyEngineBundle,
      contextRuntime: {
        cacheKey,
        cached: false,
        assemblyDurationMs: Date.now() - start,
        assemblerResults,
        contextVersion: CONTEXT_VERSION,
        immutable: true,
      },
    };
  }
}
