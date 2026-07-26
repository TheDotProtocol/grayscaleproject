import { Injectable } from "@nestjs/common";
import type {
  OrganizationalTwin,
  TwinConfidence,
  TwinEvidence,
  TwinIdentity,
  TwinPresentState,
  TwinVersion,
  CompanyContext,
} from "@grayscale/platform";
import { StrategyEngineService } from "../intelligence/strategy-engine.service";
import { GraphSummaryService } from "../graph/graph-summary.service";
import { IntentEngineService } from "./intent-engine.service";
import { TemporalEngineService } from "./temporal-engine.service";
import { AttentionEngineService } from "./attention-engine.service";
import { OrganizationalInsightEngineService } from "./organizational-insight-engine.service";
import { OrganizationalSignalBusService } from "./organizational-signal-bus.service";
import { PrismaService } from "../../prisma/prisma.service";

/** Assembles OrganizationalTwin from organizational sources — no duplicate models */
@Injectable()
export class TwinEngineService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly strategy: StrategyEngineService,
    private readonly graph: GraphSummaryService,
    private readonly intent: IntentEngineService,
    private readonly temporal: TemporalEngineService,
    private readonly attention: AttentionEngineService,
    private readonly insights: OrganizationalInsightEngineService,
    private readonly signals: OrganizationalSignalBusService,
  ) {}

  async assembleFromContext(ctx: CompanyContext, versionId: string, correlationId: string): Promise<OrganizationalTwin> {
    const evidence = this.collectEvidence(ctx);
    const confidence = this.computeConfidence(ctx, evidence);

    const present: TwinPresentState = {
      version: this.buildVersion(ctx.companyId, versionId, correlationId, "present"),
      identity: this.buildIdentity(ctx),
      scope: "present",
      assembledAt: new Date().toISOString(),
      confidence: confidence.overall,
      evidenceCount: evidence.length,
    };

    return {
      companyId: ctx.companyId,
      version: "1.0.0",
      assembledAt: new Date().toISOString(),
      correlationId,
      present,
      identity: present.identity,
      confidence,
      evidence,
      attention: ctx.attention
        ? {
            saturation: ctx.attention.saturation.status,
            driftScore: ctx.attention.drift?.driftScore ?? 0,
            congestionScore: ctx.attention.decisionCongestion?.congestionScore ?? 0,
          }
        : undefined,
      intent: ctx.intent
        ? {
            activeThemes: ctx.intent.rootIntents.map((n) => n.intent.title),
            priorityCount: ctx.intent.rootIntents.length,
          }
        : undefined,
      wisdom: ctx.insights
        ? {
            insights: ctx.insights.insights.slice(0, 5).map((i) => i.observation),
            learnedPatterns: [],
          }
        : undefined,
      decisionHistory: {
        decisionCount: ctx.decisions.length,
        recentDecisions: ctx.decisions.slice(0, 5).map((d) => ({
          id: d.id,
          title: d.title,
          decisionClass: "operational",
          decidedAt: d.createdAt,
        })),
      },
      memoryView: { recordCount: ctx.memory.length, recentThemes: ctx.memory.slice(0, 3).map((m) => m.title) },
      graphView: { nodeCount: ctx.graph.nodeCount, edgeCount: ctx.graph.edgeCount, density: ctx.graph.edgeCount / Math.max(ctx.graph.nodeCount, 1) },
      strategyView: {
        activeGoals: ctx.goals.filter((g) => g.status === "active").length,
        openRecommendations: ctx.recommendations.length,
        criticalRisks: ctx.risks.filter((r) => r.severity === "critical").length,
      },
      signalView: {
        signalCount: ctx.signals?.activeSignals.length ?? 0,
        categories: {},
      },
      insightView: {
        insightCount: ctx.insights?.insights.length ?? 0,
        topInsights: ctx.insights?.insights.slice(0, 3).map((i) => i.observation) ?? [],
      },
      organizationView: {
        stage: ctx.company.stage,
        operatingMode: ctx.operatingMode,
        missionStatus: {
          activeGoals: ctx.missionStatus.activeGoals,
          openRecommendations: ctx.missionStatus.openRecommendations,
          pendingDecisions: ctx.missionStatus.pendingDecisions,
          criticalRisks: ctx.missionStatus.criticalRisks,
        },
      },
    };
  }

  async assemble(companyId: string, correlationId: string, versionId: string): Promise<Partial<OrganizationalTwin>> {
    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new Error("Company not found");

    const [strategy, graphSummary, intentCtx, temporalCtx, attentionSnap, insightSnap, signalSnap] = await Promise.all([
      this.strategy.buildContext(companyId),
      this.graph.getSummary(companyId),
      this.intent.getContext(companyId),
      this.temporal.getContext(companyId),
      this.attention.assemble(companyId),
      this.insights.getSnapshot(companyId),
      this.signals.getSnapshot(companyId),
    ]);

    const minimalCtx = {
      companyId,
      assembledAt: new Date().toISOString(),
      correlationId,
      company: { id: company.id, name: company.name, slug: company.slug, stage: company.stage, metadata: {} },
      operatingMode: strategy.operatingMode,
      goals: strategy.goals,
      objectives: strategy.objectives,
      recommendations: strategy.openRecommendations,
      decisions: strategy.pendingDecisions,
      risks: strategy.topRisks,
      opportunities: strategy.topOpportunities,
      memory: [],
      graph: graphSummary,
      strategy,
      missionStatus: {
        activeGoals: strategy.goals.filter((g) => g.status === "active").length,
        openRecommendations: strategy.openRecommendations.length,
        pendingDecisions: strategy.pendingDecisions.length,
        blockedObjectives: strategy.objectives.filter((o) => o.status === "blocked").length,
        criticalRisks: strategy.topRisks.filter((r) => r.severity === "critical").length,
      },
      intent: intentCtx,
      temporal: temporalCtx,
      attention: attentionSnap,
      insights: insightSnap,
      signals: signalSnap,
      recentEvents: [],
      projects: [],
      tasks: [],
      timeline: [],
      bills: [],
      cashPosition: { totalUnpaidCents: 0, totalOverdueCents: 0, currency: "USD" },
      pulse: { recentCount: 0, healthScore: 0, categories: {} },
      plugins: [],
      infrastructure: { databaseConnected: true, eventStoreHealthy: true, graphNodeCount: graphSummary.nodeCount, memoryRecordCount: 0 },
      security: { executivesEnabled: false, activeIntegrations: 0, disconnectedIntegrations: 0 },
      integrations: [],
    } as CompanyContext;

    return this.assembleFromContext(minimalCtx, versionId, correlationId);
  }

  private buildVersion(companyId: string, versionId: string, correlationId: string, scope: TwinPresentState["scope"]): TwinVersion {
    return { versionId, companyId, sequence: 1, capturedAt: new Date().toISOString(), scope, correlationId };
  }

  private buildIdentity(ctx: CompanyContext): TwinIdentity {
    return {
      companyId: ctx.companyId,
      name: ctx.company.name,
      stage: ctx.company.stage,
      industry: ctx.company.industry,
      persistedSince: ctx.company.id,
    };
  }

  private collectEvidence(ctx: CompanyContext): TwinEvidence[] {
    const evidence: TwinEvidence[] = [];
    if (ctx.memory.length) evidence.push({ evidenceId: "mem", source: "memory", sourceType: "memory", summary: `${ctx.memory.length} records`, capturedAt: ctx.assembledAt });
    if (ctx.graph.nodeCount) evidence.push({ evidenceId: "graph", source: "graph", sourceType: "graph", summary: `${ctx.graph.nodeCount} nodes`, capturedAt: ctx.assembledAt });
    if (ctx.signals?.activeSignals.length) evidence.push({ evidenceId: "sig", source: "signals", sourceType: "signal", summary: `${ctx.signals.activeSignals.length} signals`, capturedAt: ctx.assembledAt });
    if (ctx.intent) evidence.push({ evidenceId: "intent", source: "intent", sourceType: "intent", summary: "Intent context", capturedAt: ctx.assembledAt });
    if (ctx.temporal) evidence.push({ evidenceId: "temporal", source: "temporal", sourceType: "temporal", summary: "Temporal context", capturedAt: ctx.assembledAt });
    if (ctx.attention) evidence.push({ evidenceId: "attn", source: "attention", sourceType: "attention", summary: "Attention snapshot", capturedAt: ctx.assembledAt });
    return evidence;
  }

  private computeConfidence(ctx: CompanyContext, evidence: TwinEvidence[]): TwinConfidence {
    const evidenceScore = Math.min(1, evidence.length / 6);
    const temporalScore = ctx.temporal ? 0.8 : 0.5;
    return {
      overall: Math.round(((evidenceScore + temporalScore) / 2) * 100) / 100,
      evidence: evidenceScore,
      temporal: temporalScore,
    };
  }
}
