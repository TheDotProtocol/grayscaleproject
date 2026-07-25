import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { PrismaService } from "../../prisma/prisma.service";
import { EventsService } from "../events/events.service";
import { RecommendationEngineService } from "../intelligence/recommendation-engine.service";
import { GoalEngineService } from "../intelligence/goal-engine.service";
import { TimelineService } from "../timeline/timeline.service";
import { PluginRuntimeService } from "../integration-platform/plugin-runtime.service";
import { SyncOrchestratorService } from "../integration-platform/sync-orchestrator.service";
import { GITHUB_PLUGIN_MANIFEST } from "../integration-platform/github-plugin.manifest";
import { FounderBriefService } from "./founder-brief.service";
import { PLATFORM_JOBS_QUEUE } from "./action-dispatcher.service";
import type { ConnectorProviderId } from "@grayscale/platform";

@Processor(PLATFORM_JOBS_QUEUE)
export class ActionProcessor extends WorkerHost {
  private readonly logger = new Logger(ActionProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventsService,
    private readonly recommendations: RecommendationEngineService,
    private readonly goals: GoalEngineService,
    private readonly timeline: TimelineService,
    private readonly plugins: PluginRuntimeService,
    private readonly sync: SyncOrchestratorService,
    private readonly brief: FounderBriefService,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    const { jobId, companyId, actionId, payload, userId, correlationId } = job.data as {
      jobId: string;
      companyId: string;
      actionId: string;
      payload: Record<string, unknown>;
      userId?: string;
      correlationId: string;
    };

    await this.prisma.platformJob.update({
      where: { id: jobId },
      data: { status: "running" },
    });

    try {
      const result = await this.execute(companyId, actionId, payload, userId);
      await this.prisma.platformJob.update({
        where: { id: jobId },
        data: { status: "completed", result: result as object, completedAt: new Date() },
      });
      await this.events.publish("mission-control.action.completed", companyId, {
        jobId,
        actionId,
        result,
        correlationId,
      }, { source: "mission-control", userId });
    } catch (e) {
      const error = e instanceof Error ? e.message : "Action failed";
      await this.prisma.platformJob.update({
        where: { id: jobId },
        data: { status: "failed", error, completedAt: new Date() },
      });
      await this.events.publish("mission-control.action.failed", companyId, {
        jobId,
        actionId,
        error,
        correlationId,
      }, { source: "mission-control", userId });
      throw e;
    }
  }

  private async execute(
    companyId: string,
    actionId: string,
    payload: Record<string, unknown>,
    userId?: string,
  ): Promise<Record<string, unknown>> {
    switch (actionId) {
      case "recommendation.approve":
        return {
          recommendation: await this.recommendations.updateStatus(
            companyId,
            payload.recommendationId as string,
            "approved",
            (payload.actorId as string) ?? userId ?? "system",
          ),
        };
      case "recommendation.reject":
        return {
          recommendation: await this.recommendations.updateStatus(
            companyId,
            payload.recommendationId as string,
            "rejected",
            (payload.actorId as string) ?? userId ?? "system",
          ),
        };
      case "goal.create":
        return {
          goal: await this.goals.create({
            companyId,
            scope: "company",
            title: payload.title as string,
            description: payload.description as string | undefined,
          }),
        };
      case "task.create":
        return {
          event: await this.timeline.create(companyId, {
            title: payload.title as string,
            description: payload.description as string | undefined,
            eventType: "task",
          }),
        };
      case "meeting.schedule":
        return {
          event: await this.timeline.create(companyId, {
            title: payload.title as string,
            eventType: "meeting",
            occurredAt: payload.occurredAt as string | undefined,
          }),
        };
      case "plugin.install":
        return { plugin: await this.plugins.install(companyId, GITHUB_PLUGIN_MANIFEST) };
      case "integration.retry-sync":
        return {
          sync: await this.sync.enqueueSync(
            companyId,
            payload.provider as ConnectorProviderId,
          ),
        };
      case "brief.refresh":
        return { brief: await this.brief.assemble(companyId) };
      default:
        throw new Error(`Unhandled action: ${actionId}`);
    }
  }
}
