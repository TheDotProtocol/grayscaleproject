import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { ExecutiveNetworkService } from "./executive-network.service";

@ApiTags("executive-network")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("companies/:companyId/executive-network")
export class ExecutiveNetworkController {
  constructor(private readonly network: ExecutiveNetworkService) {}

  @Get()
  assemble(@Param("companyId") companyId: string) {
    return this.network.assemble(companyId);
  }

  @Get("dependencies/:executiveId")
  dependencies(@Param("companyId") companyId: string, @Param("executiveId") executiveId: string) {
    return this.network.getDependencies(companyId, executiveId);
  }

  @Get("trust/:executiveId")
  trust(@Param("companyId") companyId: string, @Param("executiveId") executiveId: string) {
    return this.network.getTrustEdges(companyId, executiveId);
  }

  @Get("coverage")
  coverage(@Param("companyId") companyId: string) {
    return this.network.getCoverage(companyId);
  }

  @Get("collaborations")
  collaborations(@Param("companyId") companyId: string) {
    return this.network.getCollaborationHistory(companyId);
  }
}
