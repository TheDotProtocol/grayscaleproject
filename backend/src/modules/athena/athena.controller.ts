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
  async status(@Param("companyId") companyId: string) {
    const instance = await this.runtime.getInstance(companyId, "athena");
    return {
      executiveId: "athena",
      role: "Chief Executive Strategist",
      canonicalIdentity: "ATHENA",
      instanceId: instance?.id ?? null,
      executivesEnabled: this.runtime.isEnabled(),
      certification: "Sprint-2",
      message: "Athena reference executive — certified dormant until Founder activation",
    };
  }

  @Get("pipeline")
  getPipeline(@Param("companyId") companyId: string) {
    return this.athena.getPipelineTrace(companyId);
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
