import { Injectable } from "@nestjs/common";
import type { WidgetDataPort, WidgetInstanceConfig, WidgetDataResult } from "@grayscale/platform";
import { PulseEngineService } from "../pulse/pulse-engine.service";
import { IntegrationHealthService } from "../integration-platform/integration-health.service";
import { IntegrationCostService } from "../integration-platform/integration-cost.service";
import { PluginRuntimeService } from "../integration-platform/plugin-runtime.service";
import { RecommendationEngineService } from "../intelligence/recommendation-engine.service";
import { StrategyEngineService } from "../intelligence/strategy-engine.service";
import { GraphSummaryService } from "../graph/graph-summary.service";
import { TimelineService } from "../timeline/timeline.service";
import { BillingService } from "../billing/billing.service";
import { PlatformHealthService } from "./platform-health.service";
import { ReadinessScoringService } from "./readiness-scoring.service";
import { FounderBriefService } from "./founder-brief.service";
import { OperationalTimelineService } from "./operational-timeline.service";
import { ReliabilityEngineService } from "../platform-operations/reliability-engine.service";
import { DiagnosticsEngineService } from "../platform-operations/diagnostics-engine.service";
import { PerformanceObservatoryService } from "../platform-operations/performance-observatory.service";
import { PlatformCostObservatoryService } from "../platform-operations/platform-cost-observatory.service";
import { ReadinessReportGeneratorService } from "../platform-operations/readiness-report-generator.service";
import { PlatformEvolutionService } from "../platform-operations/platform-evolution.service";
import { SecurityObservatoryService } from "../platform-operations/security-observatory.service";
import { AthenaWidgetDataService } from "./athena-widget-data.service";
import { CouncilWidgetDataService } from "./council-widget-data.service";

@Injectable()
export class WidgetDataService implements WidgetDataPort {
  constructor(
    private readonly pulse: PulseEngineService,
    private readonly platformHealth: PlatformHealthService,
    private readonly integrationHealth: IntegrationHealthService,
    private readonly integrationCost: IntegrationCostService,
    private readonly plugins: PluginRuntimeService,
    private readonly recommendations: RecommendationEngineService,
    private readonly strategy: StrategyEngineService,
    private readonly graph: GraphSummaryService,
    private readonly timeline: TimelineService,
    private readonly billing: BillingService,
    private readonly readiness: ReadinessScoringService,
    private readonly brief: FounderBriefService,
    private readonly opTimeline: OperationalTimelineService,
    private readonly reliability: ReliabilityEngineService,
    private readonly diagnostics: DiagnosticsEngineService,
    private readonly performance: PerformanceObservatoryService,
    private readonly platformCost: PlatformCostObservatoryService,
    private readonly foundationReadiness: ReadinessReportGeneratorService,
    private readonly evolution: PlatformEvolutionService,
    private readonly security: SecurityObservatoryService,
    private readonly athenaWidgets: AthenaWidgetDataService,
    private readonly councilWidgets: CouncilWidgetDataService,
  ) {}

  async fetchWidget(
    companyId: string,
    widgetId: string,
    _config?: Record<string, unknown>,
  ): Promise<unknown> {
    switch (widgetId) {
      case "platform-health":
        return this.platformHealth.computePlatformHealth(companyId);
      case "pulse-feed": {
        const [health, recent] = await Promise.all([
          this.pulse.getHealth(companyId),
          this.pulse.getRecent(companyId, 30),
        ]);
        return { health, recent };
      }
      case "operational-timeline":
        return this.opTimeline.getTimeline(companyId, { limit: 50 });
      case "integrations-health":
        return this.integrationHealth.getCompanyHealth(companyId);
      case "recommendations":
        return this.recommendations.listOpen(companyId);
      case "upcoming-bills":
        return this.billing.list(companyId);
      case "timeline-today": {
        const events = await this.timeline.list(companyId);
        const today = new Date().toISOString().slice(0, 10);
        return events.filter((e) => e.occurredAt.toISOString().slice(0, 10) === today);
      }
      case "graph-summary":
        return this.graph.getSummary(companyId);
      case "readiness-matrix":
        return this.readiness.compute(companyId);
      case "founder-brief":
        return this.brief.assemble(companyId);
      case "plugin-status":
        return this.plugins.listInstalled(companyId);
      case "integration-cost":
        return this.integrationCost.getCompanyUsage(companyId);
      case "reliability-dashboard":
        return this.reliability.computeAll();
      case "diagnostics-panel":
        return this.diagnostics.runAll(companyId);
      case "performance-metrics":
        return this.performance.getTrends("24h");
      case "platform-cost":
        return this.platformCost.compute();
      case "foundation-readiness":
        return this.foundationReadiness.getLatest();
      case "platform-evolution":
        return this.evolution.getCurrent();
      case "security-health":
        return this.security.assess(companyId);
      case "athena-status":
        return this.athenaWidgets.getStatus(companyId);
      case "athena-discovery-progress":
        return this.athenaWidgets.getDiscoveryProgress(companyId);
      case "athena-trust-score":
        return this.athenaWidgets.getTrustScore(companyId);
      case "athena-certification-progress":
        return this.athenaWidgets.getCertificationProgress(companyId);
      case "athena-notebook-activity":
        return this.athenaWidgets.getNotebookActivity(companyId);
      case "athena-curiosity-investigations":
        return this.athenaWidgets.getCuriosityInvestigations(companyId);
      case "athena-skeptic-challenges":
        return this.athenaWidgets.getSkepticChallenges(companyId);
      case "athena-executive-health":
        return this.athenaWidgets.getExecutiveHealth(companyId);
      case "athena-explainability":
        return this.athenaWidgets.getExplainability(companyId);
      case "athena-recommendation-lifecycle":
        return this.athenaWidgets.getRecommendationLifecycle(companyId);
      case "athena-constitution-compliance":
        return this.athenaWidgets.getConstitutionCompliance(companyId);
      case "athena-automation-readiness":
        return this.athenaWidgets.getAutomationReadiness(companyId);
      case "athena-founder-overrides":
        return this.athenaWidgets.getFounderOverrides(companyId);
      case "council-sessions":
        return this.councilWidgets.getSessions(companyId);
      case "council-open-deliberations":
        return this.councilWidgets.getDeliberations(companyId);
      case "council-consensus-score":
        return this.councilWidgets.getConsensus(companyId);
      case "council-minority-opinions":
        return this.councilWidgets.getMinorityOpinions(companyId);
      case "council-executive-participation":
        return this.councilWidgets.getParticipation(companyId);
      case "council-health":
        return this.councilWidgets.getHealth(companyId);
      case "council-trust":
        return this.councilWidgets.getTrust(companyId);
      case "council-decisions":
        return this.councilWidgets.getDecisions(companyId);
      case "council-founder-overrides":
        return this.councilWidgets.getOverrides(companyId);
      case "council-history":
        return this.councilWidgets.getHistory(companyId);
      case "council-audit":
        return this.councilWidgets.getAudit(companyId);
      case "council-timeline":
        return this.councilWidgets.getTimeline(companyId);
      case "council-metrics":
        return this.councilWidgets.getMetrics(companyId);
      case "executive-council":
        return this.councilWidgets.getCouncilFeed(companyId);
      case "council-decision-queue":
        return this.councilWidgets.getDecisionQueue(companyId);
      case "council-decision-classification":
        return this.councilWidgets.getDecisionClassification(companyId);
      case "organizational-attention":
        return this.councilWidgets.getAttention(companyId);
      case "council-founder-escalations":
        return this.councilWidgets.getEscalations(companyId);
      case "council-decision-replay":
        return this.councilWidgets.getHistory(companyId);
      default:
        return null;
    }
  }

  async fetchAll(companyId: string, instances: WidgetInstanceConfig[]): Promise<WidgetDataResult[]> {
    const visible = instances.filter((i) => i.visible);
    return Promise.all(
      visible.map(async (inst) => {
        try {
          const data = await this.fetchWidget(companyId, inst.widgetId, inst.config);
          const isEmpty = data == null || (Array.isArray(data) && data.length === 0);
          return {
            instanceId: inst.instanceId,
            widgetId: inst.widgetId,
            status: isEmpty ? "empty" as const : "ok" as const,
            data: data ?? null,
            fetchedAt: new Date().toISOString(),
          };
        } catch (e) {
          return {
            instanceId: inst.instanceId,
            widgetId: inst.widgetId,
            status: "error" as const,
            data: null,
            error: e instanceof Error ? e.message : "Fetch failed",
            fetchedAt: new Date().toISOString(),
          };
        }
      }),
    );
  }
}
