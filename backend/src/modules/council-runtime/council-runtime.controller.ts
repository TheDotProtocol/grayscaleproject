import { Controller, Get, Param, Post, Body, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { ExecutiveCouncilRuntimeService } from "./executive-council-runtime.service";
import { CouncilSessionService } from "./council-session.service";
import { CouncilCertificationService } from "./council-certification.service";
import { CouncilCollaborationService } from "./council-collaboration.service";

@ApiTags("council-runtime")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("companies/:companyId/council")
export class CouncilRuntimeController {
  constructor(
    private readonly runtime: ExecutiveCouncilRuntimeService,
    private readonly sessions: CouncilSessionService,
    private readonly certification: CouncilCertificationService,
    private readonly collaborationService: CouncilCollaborationService,
  ) {}

  @Get("health")
  health(@Param("companyId") companyId: string) {
    return this.runtime.getHealth(companyId);
  }

  @Get("sessions")
  listSessions(@Param("companyId") companyId: string) {
    return this.sessions.listSessions(companyId);
  }

  @Get("metrics")
  metrics(@Param("companyId") companyId: string) {
    const now = new Date();
    const from = new Date(now.getTime() - 30 * 86400000).toISOString();
    return this.runtime.getMetrics(companyId, { from, to: now.toISOString() });
  }

  @Get("history")
  history(@Param("companyId") companyId: string) {
    return this.runtime.getHistory(companyId);
  }

  @Get("audit")
  audit(@Param("companyId") companyId: string) {
    return this.runtime.getAudit(companyId);
  }

  @Get("certify")
  certify(@Param("companyId") companyId: string) {
    return this.certification.runCouncilCertification(companyId);
  }

  @Post("sessions")
  openSession(
    @Param("companyId") companyId: string,
    @Body() body: { title: string; participatingExecutiveIds: string[]; correlationId?: string },
  ) {
    return this.runtime.openSession({
      companyId,
      title: body.title,
      status: "active",
      participatingExecutiveIds: body.participatingExecutiveIds,
      quorumRequired: 1,
      correlationId: body.correlationId ?? crypto.randomUUID(),
    });
  }

  @Post("sessions/:sessionId/issues")
  openIssue(
    @Param("companyId") companyId: string,
    @Param("sessionId") sessionId: string,
    @Body()
    body: {
      title: string;
      summary: string;
      domain: string;
      decisionClass: string;
      initiatingExecutiveId: string;
      correlationId?: string;
    },
  ) {
    return this.runtime.openIssue({
      companyId,
      sessionId,
      title: body.title,
      summary: body.summary,
      domain: body.domain,
      decisionClass: body.decisionClass,
      status: "open",
      urgency: "medium",
      initiatingExecutiveId: body.initiatingExecutiveId,
      correlationId: body.correlationId ?? crypto.randomUUID(),
    });
  }

  @Post("sessions/:sessionId/issues/:issueId/consensus")
  measureConsensus(
    @Param("sessionId") sessionId: string,
    @Param("issueId") issueId: string,
  ) {
    return this.runtime.measureConsensus(sessionId, issueId);
  }

  @Get("sessions/:sessionId/replay")
  replay(@Param("sessionId") sessionId: string) {
    return this.runtime.replaySession(sessionId);
  }

  @Get("collaboration")
  getCollaboration(@Param("companyId") companyId: string) {
    return this.collaborationService.getMetrics(companyId);
  }

  @Get("collaboration/participation")
  getCollaborationParticipation(@Param("companyId") companyId: string) {
    return this.collaborationService.getParticipation(companyId);
  }

  @Get("collaboration/conflicts")
  getCollaborationConflicts(@Param("companyId") companyId: string) {
    return this.collaborationService.getResponsibilityConflicts(companyId);
  }
}
