import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
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
}
