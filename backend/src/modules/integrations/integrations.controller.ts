import { Controller, Get, Post, Delete, Body, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { IntegrationsService } from "./integrations.service";

@ApiTags("integrations")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("companies/:companyId/integrations")
export class IntegrationsController {
  constructor(private readonly integrations: IntegrationsService) {}

  @Get()
  list(@Param("companyId") companyId: string) {
    return this.integrations.list(companyId);
  }

  @Post("github")
  connectGitHub(
    @Param("companyId") companyId: string,
    @Body() body: { accessToken: string; owner: string; repo: string },
  ) {
    return this.integrations.connectGitHub(companyId, body);
  }

  @Delete(":provider")
  disconnect(
    @Param("companyId") companyId: string,
    @Param("provider") provider: string,
  ) {
    return this.integrations.disconnect(companyId, provider);
  }
}
