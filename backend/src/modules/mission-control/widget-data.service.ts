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
