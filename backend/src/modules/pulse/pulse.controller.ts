import { Controller, Get, Param, Post, Body, UseGuards, Sse } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { Observable } from "rxjs";
import { PulseEngineService } from "./pulse-engine.service";
import { PULSE_EVENTS } from "@grayscale/shared";

@ApiTags("pulse")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("companies/:companyId/pulse")
export class PulseController {
  constructor(private readonly pulse: PulseEngineService) {}

  @Get("recent")
  getRecent(@Param("companyId") companyId: string) {
    return this.pulse.getRecent(companyId);
  }

  @Get("health")
  getHealth(@Param("companyId") companyId: string) {
    return this.pulse.getHealth(companyId);
  }

  /** Server-Sent Events — Mission Control subscribes for live operational pulse */
  @Sse("stream")
  stream(@Param("companyId") companyId: string): Observable<{ data: unknown }> {
    return this.pulse.observe(companyId);
  }

  /** Record sprint completion (Mission Control → Pulse Engine) */
  @Post("sprint-completed")
  async sprintCompleted(
    @Param("companyId") companyId: string,
    @Body() body: { sprintNumber: number; name: string; summary?: string },
  ) {
    await this.pulse.emit({
      companyId,
      type: PULSE_EVENTS.SPRINT_COMPLETED,
      title: "Sprint completed",
      summary: body.summary ?? `Sprint ${body.sprintNumber}: ${body.name}`,
      severity: "success",
      category: "sprint",
      payload: body,
      source: "mission-control",
    });
    return { ok: true };
  }
}
