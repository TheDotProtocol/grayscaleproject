import { Injectable } from "@nestjs/common";
import type { FounderBriefPort, FounderDailyBrief, WorkloadIndicators, WorkloadIntensity } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";
import { StrategyEngineService } from "../intelligence/strategy-engine.service";
import { RecommendationEngineService } from "../intelligence/recommendation-engine.service";
import { IntegrationHealthService } from "../integration-platform/integration-health.service";
import { PlatformHealthService } from "./platform-health.service";
import { OperationalTimelineService } from "./operational-timeline.service";

@Injectable()
export class FounderBriefService implements FounderBriefPort {
  constructor(
    private readonly prisma: PrismaService,
    private readonly strategy: StrategyEngineService,
    private readonly recommendations: RecommendationEngineService,
    private readonly integrationHealth: IntegrationHealthService,
    private readonly platformHealth: PlatformHealthService,
    private readonly timeline: OperationalTimelineService,
  ) {}

  async assemble(companyId: string, dateStr?: string): Promise<FounderDailyBrief> {
    const briefingDate = dateStr ?? new Date().toISOString().slice(0, 10);
    const dayStart = new Date(briefingDate);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const [
      priorities,
      bills,
      meetings,
      recommendations,
      integrationHealth,
      platformHealth,
      recentEvents,
      risks,
      syncJobs,
      timelineEvents,
    ] = await Promise.all([
      this.strategy.prioritize(companyId).catch(() => []),
      this.prisma.bill.findMany({
        where: { companyId, isPaid: false, dueDate: { lte: new Date(Date.now() + 14 * 86400000) } },
        orderBy: { dueDate: "asc" },
        take: 10,
      }),
      this.prisma.timelineEvent.findMany({
        where: { companyId, occurredAt: { gte: dayStart, lt: dayEnd } },
        orderBy: { occurredAt: "asc" },
      }),
      this.recommendations.listOpen(companyId).catch(() => []),
      this.integrationHealth.getCompanyHealth(companyId),
      this.platformHealth.computePlatformHealth(companyId),
      this.timeline.getTimeline(companyId, { limit: 20 }),
      this.prisma.riskAssessment.findMany({
        where: { companyId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      this.prisma.pluginSyncJob.findMany({
        where: { companyId, status: { in: ["failed", "pending"] } },
        take: 10,
      }),
      this.prisma.timelineEvent.findMany({
        where: { companyId, occurredAt: { gte: new Date(Date.now() - 7 * 86400000) } },
      }),
    ]);

    const unpaidBills = await this.prisma.bill.findMany({ where: { companyId, isPaid: false } });
    const paidBills = await this.prisma.bill.findMany({ where: { companyId, isPaid: true } });
    const totalUnpaid = unpaidBills.reduce((s, b) => s + b.amountCents, 0);
    const totalPaid = paidBills.reduce((s, b) => s + b.amountCents, 0);

    const taskCount = timelineEvents.filter((e) => e.eventType === "task").length;
    const deadlineCount = unpaidBills.filter((b) => b.dueDate <= dayEnd).length;

    const workload = this.computeWorkload({
      meetingCount: meetings.length,
      taskCount,
      deadlineCount,
      billCount: bills.length,
      calendarEventCount: meetings.length + timelineEvents.filter((e) => e.eventType === "meeting").length,
    });

    const brief: FounderDailyBrief = {
      companyId,
      briefingDate,
      sections: {
        todaysPriorities: Array.isArray(priorities) ? priorities.slice(0, 5) : [],
        blockedWork: syncJobs.map((j) => ({
          type: "sync",
          provider: j.provider,
          status: j.status,
          error: j.error,
        })),
        upcomingBills: bills,
        upcomingMeetings: meetings,
        engineeringStatus: {
          failedSyncs: syncJobs.filter((j) => j.status === "failed").length,
          integrationStates: integrationHealth,
        },
        platformHealth: platformHealth as unknown as Record<string, unknown>,
        cashPosition: {
          totalUnpaidCents: totalUnpaid,
          totalPaidCents: totalPaid,
          currency: "USD",
          upcomingBillCount: bills.length,
        },
        topRecommendations: recommendations.slice(0, 5),
        recentEvents: recentEvents.slice(0, 10),
        riskChanges: risks,
        workload,
      },
      assembledAt: new Date().toISOString(),
      version: 1,
    };

    await this.prisma.dailyBriefing.upsert({
      where: { companyId_briefingDate: { companyId, briefingDate: dayStart } },
      create: {
        companyId,
        briefingDate: dayStart,
        summary: `Workload: ${workload.intensity} · ${bills.length} bills · ${meetings.length} meetings`,
        content: brief as unknown as object,
      },
      update: {
        summary: `Workload: ${workload.intensity} · ${bills.length} bills · ${meetings.length} meetings`,
        content: brief as unknown as object,
      },
    });

    return brief;
  }

  private computeWorkload(input: {
    meetingCount: number;
    taskCount: number;
    deadlineCount: number;
    billCount: number;
    calendarEventCount: number;
  }): WorkloadIndicators {
    const score =
      input.meetingCount * 3 +
      input.taskCount * 2 +
      input.deadlineCount * 4 +
      input.billCount * 2 +
      input.calendarEventCount;

    let intensity: WorkloadIntensity = "low";
    if (score >= 30) intensity = "critical";
    else if (score >= 20) intensity = "high";
    else if (score >= 10) intensity = "moderate";

    return {
      intensity,
      score,
      meetingCount: input.meetingCount,
      taskCount: input.taskCount,
      deadlineCount: input.deadlineCount,
      billCount: input.billCount,
      calendarEventCount: input.calendarEventCount,
    };
  }
}
