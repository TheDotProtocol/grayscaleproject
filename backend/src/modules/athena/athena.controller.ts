import { Controller, Get, Post, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { AthenaService } from "./athena.service";
import { ExecutiveRuntimeService } from "../executive/executive-runtime.service";

@ApiTags("athena")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("companies/:companyId/athena")
export class AthenaController {
  constructor(
    private readonly athena: AthenaService,
    private readonly runtime: ExecutiveRuntimeService,
  ) {}

  @Get("status")
  status() {
    return {
      executiveId: "athena",
      role: "Chief Executive Strategist",
      executivesEnabled: this.runtime.isEnabled(),
      certification: "in_progress",
      message: "Athena Phase B — discovery and draft recommendations available for certification testing",
    };
  }

  @Post("instances/:instanceId/discovery")
  runDiscovery(
    @Param("companyId") companyId: string,
    @Param("instanceId") instanceId: string,
  ) {
    return this.athena.runDiscovery(companyId, instanceId);
  }

  @Post("instances/:instanceId/recommendations/draft")
  draftRecommendations(
    @Param("companyId") companyId: string,
    @Param("instanceId") instanceId: string,
  ) {
    return this.athena.draftRecommendations(companyId, instanceId);
  }
}
