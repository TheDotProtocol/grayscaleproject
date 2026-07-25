import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import type { WidgetInstanceConfig } from "@grayscale/platform";
import { MissionControlService } from "./mission-control.service";
import { PlatformHealthService } from "./platform-health.service";
import { ReadinessScoringService } from "./readiness-scoring.service";
import { FounderBriefService } from "./founder-brief.service";
import { WidgetCatalogService } from "./widget-catalog.service";
import { WidgetDataService } from "./widget-data.service";
import { ActionDispatcherService } from "./action-dispatcher.service";
import { OperationalTimelineService } from "./operational-timeline.service";
import { GlobalSearchService } from "./global-search.service";
import { QuickActionsService } from "./quick-actions.service";
import { CurrentUser } from "../auth/auth.decorators";

@ApiTags("mission-control")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("companies/:companyId/mission-control")
export class MissionControlController {
  constructor(
    private readonly missionControl: MissionControlService,
    private readonly platformHealth: PlatformHealthService,
    private readonly readiness: ReadinessScoringService,
    private readonly brief: FounderBriefService,
    private readonly catalog: WidgetCatalogService,
    private readonly widgetData: WidgetDataService,
    private readonly actions: ActionDispatcherService,
    private readonly timeline: OperationalTimelineService,
    private readonly globalSearch: GlobalSearchService,
    private readonly quickActionsService: QuickActionsService,
  ) {}

  @Get("dashboard")
  getDashboard(
    @Param("companyId") companyId: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.missionControl.getDashboard(companyId, user.userId);
  }

  @Get("health")
  getHealth(@Param("companyId") companyId: string) {
    return this.platformHealth.computePlatformHealth(companyId);
  }

  @Get("readiness")
  getReadiness(@Param("companyId") companyId: string) {
    return this.readiness.compute(companyId);
  }

  @Get("brief")
  getBrief(@Param("companyId") companyId: string, @Query("date") date?: string) {
    return this.brief.assemble(companyId, date);
  }

  @Get("widgets")
  async getWidgets(
    @Param("companyId") companyId: string,
    @CurrentUser() user: { userId: string },
  ) {
    return {
      catalog: this.catalog.list(),
      layout: await this.missionControl.getLayout(companyId, user.userId),
    };
  }

  @Put("widgets/layout")
  saveLayout(
    @Param("companyId") companyId: string,
    @CurrentUser() user: { userId: string },
    @Body() body: { widgets: WidgetInstanceConfig[] },
  ) {
    return this.missionControl.saveLayout(companyId, user.userId, body.widgets);
  }

  @Get("widgets/:widgetId/data")
  getWidgetData(
    @Param("companyId") companyId: string,
    @Param("widgetId") widgetId: string,
  ) {
    return this.widgetData.fetchWidget(companyId, widgetId);
  }

  @Get("actions")
  listActions() {
    return this.actions.listActions();
  }

  @Post("actions")
  dispatchAction(
    @Param("companyId") companyId: string,
    @CurrentUser() user: { userId: string },
    @Body() body: { actionId: string; payload?: Record<string, unknown> },
  ) {
    return this.actions.dispatch(companyId, body.actionId, body.payload ?? {}, user.userId);
  }

  @Get("actions/:jobId")
  getJob(@Param("jobId") jobId: string) {
    return this.actions.getJob(jobId);
  }

  @Get("timeline")
  getTimeline(
    @Param("companyId") companyId: string,
    @Query("limit") limit?: string,
    @Query("types") types?: string,
  ) {
    return this.timeline.getTimeline(companyId, {
      limit: limit ? parseInt(limit, 10) : undefined,
      types: types?.split(",").filter(Boolean),
    });
  }

  @Get("search")
  searchPlatform(
    @Param("companyId") companyId: string,
    @Query("q") q: string,
    @Query("domains") domains?: string,
    @Query("limit") limit?: string,
  ) {
    return this.globalSearch.search(companyId, {
      q: q ?? "",
      domains: domains?.split(",").filter(Boolean) as never,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get("quick-actions")
  listQuickActions() {
    return this.quickActionsService.list();
  }
}
