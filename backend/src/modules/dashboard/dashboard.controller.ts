import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { DashboardService } from "./dashboard.service";
import { CurrentUser } from "../auth/auth.decorators";

@ApiTags("dashboard")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  @Get("companies/:companyId/founder")
  founderDashboard(
    @Param("companyId") companyId: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.dashboard.getFounderDashboard(companyId, user.userId);
  }

  @Get("companies/:companyId/briefing")
  dailyBriefing(@Param("companyId") companyId: string) {
    return this.dashboard.getDailyBriefing(companyId);
  }
}
