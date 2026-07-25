import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";
import { EXECUTIVE_LIST } from "@grayscale/shared";
import { createProviderAdapter } from "@grayscale/agents";

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async getFounderDashboard(companyId: string, userId: string) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    const [
      memoryCount,
      upcomingBills,
      recentMemories,
      journalEntries,
      latestJournal,
    ] = await Promise.all([
      this.prisma.memory.count({ where: { companyId } }),
      this.prisma.bill.findMany({
        where: { companyId },
        orderBy: { dueDate: "asc" },
        take: 10,
      }),
      this.prisma.memory.findMany({
        where: { companyId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      this.prisma.journalEntry.findMany({
        where: { companyId },
        orderBy: { entryDate: "desc" },
        select: { entryDate: true },
      }),
      this.prisma.journalEntry.findFirst({
        where: { companyId },
        orderBy: { entryDate: "desc" },
        select: { summary: true },
      }),
    ]);

    const ollamaAdapter = createProviderAdapter({
      ollamaBaseUrl: this.config.get("OLLAMA_BASE_URL"),
    });
    const [ollama, openai] = await Promise.all([
      ollamaAdapter.isAvailable().catch(() => false),
      Promise.resolve(Boolean(this.config.get("OPENAI_API_KEY"))),
    ]);

    return {
      company: company
        ? { id: company.id, name: company.name, industry: company.industry }
        : null,
      memoryCount,
      journalStreak: this.computeJournalStreak(journalEntries.map((e) => e.entryDate)),
      latestJournalSummary: latestJournal?.summary ?? null,
      upcomingBills,
      recentMemories: recentMemories.map((m) => ({
        id: m.id,
        title: m.title,
        category:
          (m.metadata as { category?: string })?.category ??
          (m.tags[0] ?? "general"),
        createdAt: m.createdAt,
      })),
      aiProviderStatus: { ollama, openai },
      executives: EXECUTIVE_LIST,
      stats: {
        unreadNotifications: await this.prisma.notification.count({
          where: { userId, isRead: false },
        }),
      },
    };
  }

  private computeJournalStreak(dates: Date[]): number {
    if (dates.length === 0) return 0;
    const dayKeys = new Set(
      dates.map((d) => new Date(d).toISOString().slice(0, 10)),
    );
    let streak = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    while (dayKeys.has(cursor.toISOString().slice(0, 10))) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }

  async getDailyBriefing(companyId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await this.prisma.dailyBriefing.findUnique({
      where: { companyId_briefingDate: { companyId, briefingDate: today } },
    });
    if (existing) return existing;

    const [memories, bills, timeline] = await Promise.all([
      this.prisma.memory.findMany({
        where: { companyId },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      this.prisma.bill.findMany({
        where: { companyId, isPaid: false },
        orderBy: { dueDate: "asc" },
        take: 3,
      }),
      this.prisma.timelineEvent.findMany({
        where: { companyId },
        orderBy: { occurredAt: "desc" },
        take: 3,
      }),
    ]);

    const summary = [
      `${memories.length} recent memories`,
      `${bills.length} bills upcoming`,
      `${timeline.length} timeline events`,
    ].join(" · ");

    return this.prisma.dailyBriefing.create({
      data: {
        companyId,
        briefingDate: today,
        summary,
        content: { memories, bills, timeline },
      },
    });
  }
}
