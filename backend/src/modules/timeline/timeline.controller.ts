import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { TimelineService } from "./timeline.service";

@ApiTags("timeline")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("companies/:companyId/timeline")
export class TimelineController {
  constructor(private readonly timeline: TimelineService) {}

  @Get()
  list(@Param("companyId") companyId: string) {
    return this.timeline.list(companyId);
  }

  @Post()
  create(
    @Param("companyId") companyId: string,
    @Body() body: { title: string; description?: string; eventType: string; occurredAt?: string },
  ) {
    return this.timeline.create(companyId, body);
  }
}
