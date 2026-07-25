import { Controller, Get, Put, Body, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { AiProvidersService } from "./ai-providers.service";

@ApiTags("ai-providers")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("companies/:companyId/ai-providers")
export class AiProvidersController {
  constructor(private readonly aiProviders: AiProvidersService) {}

  @Get()
  list(@Param("companyId") companyId: string) {
    return this.aiProviders.list(companyId);
  }

  @Put()
  upsert(
    @Param("companyId") companyId: string,
    @Body() body: { provider: string; model: string; isDefault?: boolean; isEnabled?: boolean },
  ) {
    return this.aiProviders.upsert(companyId, body);
  }
}
