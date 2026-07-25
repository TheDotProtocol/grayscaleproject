import { Controller, Get, Post, Body, Param, Patch } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { AgentsService } from "./agents.service";
import { CurrentUser } from "../auth/auth.decorators";
import { SkipCompanyGuard } from "../auth/guards/company-member.guard";

@ApiTags("agents")
@ApiBearerAuth()
@Controller("agents")
export class AgentsController {
  constructor(private readonly agents: AgentsService) {}

  @Get("executives")
  listExecutives() {
    return this.agents.listExecutives();
  }

  @Post("companies/:companyId/run/:executiveId")
  run(
    @Param("companyId") companyId: string,
    @Param("executiveId") executiveId: string,
    @CurrentUser() user: { userId: string },
    @Body() body: { prompt: string },
  ) {
    return this.agents.runAgent(companyId, user.userId, executiveId, body.prompt);
  }

  @SkipCompanyGuard()
  @Patch("recommendations/:id/approval")
  resolveApproval(
    @Param("id") id: string,
    @CurrentUser() user: { userId: string },
    @Body() body: { action: "approve" | "amend" | "reject" },
  ) {
    return this.agents.resolveApproval(id, user.userId, body.action);
  }
}
