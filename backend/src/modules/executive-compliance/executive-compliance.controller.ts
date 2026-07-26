import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { PHASE_D_EXECUTIVE_IDS } from "@grayscale/platform";
import { ExecutiveComplianceService } from "./executive-compliance.service";

@ApiTags("executive-compliance")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("companies/:companyId/executive-compliance")
export class ExecutiveComplianceController {
  constructor(private readonly compliance: ExecutiveComplianceService) {}

  @Get("athena/certify")
  certifyAthena(@Param("companyId") companyId: string) {
    return this.compliance.runCertification(companyId, "athena");
  }

  @Get(":executiveId/certify")
  certifyExecutive(@Param("companyId") companyId: string, @Param("executiveId") executiveId: string) {
    if (!PHASE_D_EXECUTIVE_IDS.includes(executiveId as never)) {
      return this.compliance.runCertification(companyId, executiveId);
    }
    return this.compliance.runCertification(companyId, executiveId);
  }
}
