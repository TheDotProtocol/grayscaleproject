import { Injectable } from "@nestjs/common";
import type { WidgetInstanceConfig } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";
import { WidgetCatalogService } from "./widget-catalog.service";
import { WidgetDataService } from "./widget-data.service";
import { PlatformHealthService } from "./platform-health.service";
import { ReadinessScoringService } from "./readiness-scoring.service";
import { FounderBriefService } from "./founder-brief.service";

@Injectable()
export class MissionControlService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: WidgetCatalogService,
    private readonly widgetData: WidgetDataService,
    private readonly platformHealth: PlatformHealthService,
    private readonly readiness: ReadinessScoringService,
    private readonly brief: FounderBriefService,
  ) {}

  async getDashboard(companyId: string, userId: string) {
    const layout = await this.getLayout(companyId, userId);
    const [platformHealth, readiness, widgets] = await Promise.all([
      this.platformHealth.computePlatformHealth(companyId),
      this.readiness.compute(companyId),
      this.widgetData.fetchAll(companyId, layout),
    ]);

    return {
      companyId,
      platformHealth,
      readiness,
      widgets,
      layout: { widgets: layout },
      catalog: this.catalog.list(),
      assembledAt: new Date().toISOString(),
    };
  }

  async getLayout(companyId: string, userId: string): Promise<WidgetInstanceConfig[]> {
    const row = await this.prisma.missionControlLayout.findUnique({
      where: { companyId_userId: { companyId, userId } },
    });
    if (row?.widgets) {
      return row.widgets as unknown as WidgetInstanceConfig[];
    }
    return this.catalog.defaultLayout();
  }

  async saveLayout(companyId: string, userId: string, widgets: WidgetInstanceConfig[]) {
    await this.prisma.missionControlLayout.upsert({
      where: { companyId_userId: { companyId, userId } },
      create: { companyId, userId, widgets: widgets as unknown as object },
      update: { widgets: widgets as unknown as object },
    });
    return { saved: true, widgets };
  }
}
