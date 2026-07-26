import { Controller, Get, Param, Post, Body, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { ExecutiveCouncilRuntimeService } from "./executive-council-runtime.service";
import { CouncilSessionService } from "./council-session.service";
import { CouncilCertificationService } from "./council-certification.service";
import { CouncilCollaborationService } from "./council-collaboration.service";
import { CouncilSchedulerService } from "./council-scheduler.service";
import { CouncilDeliberationEngineService } from "./council-deliberation-engine.service";
import { CouncilMemoryService } from "./council-memory.service";
import { ExecutiveCollaborationNetworkService } from "./executive-collaboration-network.service";
import { ExecutiveCollaborationCertificationService } from "./executive-collaboration-certification.service";

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
    private readonly scheduler: CouncilSchedulerService,
    private readonly deliberation: CouncilDeliberationEngineService,
    private readonly memory: CouncilMemoryService,
    private readonly network: ExecutiveCollaborationNetworkService,
    private readonly collaborationCert: ExecutiveCollaborationCertificationService,
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

  @Get("scheduler")
  getScheduler(@Param("companyId") companyId: string) {
    return this.scheduler.getStatus(companyId);
  }

  @Post("scheduler/sessions")
  scheduleCouncil(
    @Param("companyId") companyId: string,
    @Body() body: { mode: string; correlationId?: string },
  ) {
    return this.scheduler.openScheduledSession(companyId, body.mode as never, body.correlationId ?? crypto.randomUUID());
  }

  @Get("deliberations")
  listDeliberations(@Param("companyId") companyId: string) {
    return this.deliberation.listActive(companyId);
  }

  @Post("deliberations")
  startDeliberation(
    @Param("companyId") companyId: string,
    @Body() body: { sessionId: string; issueId: string; initiatingExecutiveId: string; correlationId?: string },
  ) {
    return this.deliberation.startProposal({
      companyId,
      sessionId: body.sessionId,
      issueId: body.issueId,
      initiatingExecutiveId: body.initiatingExecutiveId,
      correlationId: body.correlationId ?? crypto.randomUUID(),
    });
  }

  @Post("deliberations/:proposalId/advance")
  advanceDeliberation(@Param("proposalId") proposalId: string) {
    return this.deliberation.advanceStage(proposalId);
  }

  @Get("memory/search")
  searchMemory(@Param("companyId") companyId: string, @Query("q") q = "") {
    return this.memory.search(companyId, q);
  }

  @Get("memory/:sessionId")
  getMemory(@Param("sessionId") sessionId: string) {
    return this.memory.getBySession(sessionId);
  }

  @Post("collaboration/requests")
  sendCollaborationRequest(
    @Param("companyId") companyId: string,
    @Body()
    body: {
      kind: string;
      fromExecutiveId: string;
      toExecutiveId: string;
      sessionId?: string;
      issueId?: string;
      payload?: Record<string, unknown>;
      correlationId?: string;
    },
  ) {
    return this.network.sendRequest({
      companyId,
      kind: body.kind as never,
      fromExecutiveId: body.fromExecutiveId,
      toExecutiveId: body.toExecutiveId,
      sessionId: body.sessionId,
      issueId: body.issueId,
      payload: body.payload ?? {},
      correlationId: body.correlationId ?? crypto.randomUUID(),
    });
  }

  @Get("collaboration/requests")
  listCollaborationRequests(@Param("companyId") companyId: string) {
    return this.network.listRequests(companyId);
  }

  @Get("collaboration/certify")
  certifyCollaboration(@Param("companyId") companyId: string) {
    return this.collaborationCert.certify(companyId);
  }
}
