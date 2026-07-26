import { Injectable } from "@nestjs/common";
import type {
  CollaborationRequest,
  CollaborationRequestKind,
  CollaborationResponse,
  ConsensusVoteRequest,
  DissentReport,
  ExecutiveCollaborationNetworkPort,
  MinorityOpinionReport,
} from "@grayscale/platform";
import { EventsService } from "../events/events.service";
import { CouncilStoreService } from "./council-store.service";

/** Executive Collaboration Network — all executive communication flows through here */
@Injectable()
export class ExecutiveCollaborationNetworkService implements ExecutiveCollaborationNetworkPort {
  constructor(
    private readonly store: CouncilStoreService,
    private readonly events: EventsService,
  ) {}

  async sendRequest(input: Omit<CollaborationRequest, "requestId" | "status" | "createdAt">): Promise<CollaborationRequest> {
    const request: CollaborationRequest = {
      ...input,
      requestId: this.store.newId("creq"),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    this.store.collaborationRequests.set(request.requestId, request);

    await this.events.publish("collaboration.request.sent", input.companyId, {
      requestId: request.requestId,
      kind: input.kind,
      from: input.fromExecutiveId,
      to: input.toExecutiveId,
    }, { correlationId: input.correlationId });

    return request;
  }

  async respond(input: Omit<CollaborationResponse, "responseId" | "recordedAt">): Promise<CollaborationResponse> {
    const response: CollaborationResponse = {
      ...input,
      responseId: this.store.newId("cres"),
      recordedAt: new Date().toISOString(),
    };
    this.store.collaborationResponses.set(response.responseId, response);

    const request = this.store.collaborationRequests.get(input.requestId);
    if (request) {
      request.status = "responded";
      request.respondedAt = response.recordedAt;
      this.store.collaborationRequests.set(request.requestId, request);
    }

    await this.events.publish("collaboration.request.responded", request?.companyId ?? "unknown", {
      requestId: input.requestId,
      responseId: response.responseId,
    }, { correlationId: input.correlationId });

    return response;
  }

  async listRequests(
    companyId: string,
    filters?: { executiveId?: string; kind?: CollaborationRequestKind },
  ): Promise<CollaborationRequest[]> {
    return [...this.store.collaborationRequests.values()].filter((r) => {
      if (r.companyId !== companyId) return false;
      if (filters?.executiveId && r.fromExecutiveId !== filters.executiveId && r.toExecutiveId !== filters.executiveId) return false;
      if (filters?.kind && r.kind !== filters.kind) return false;
      return true;
    });
  }

  async recordConsensusVote(input: Omit<ConsensusVoteRequest, "voteId" | "castAt">): Promise<ConsensusVoteRequest> {
    const vote: ConsensusVoteRequest = {
      ...input,
      voteId: this.store.newId("cvote"),
      castAt: new Date().toISOString(),
    };
    this.store.consensusVotes.set(vote.voteId, vote);
    return vote;
  }

  async recordMinorityOpinion(input: Omit<MinorityOpinionReport, "reportId" | "preserved" | "recordedAt">): Promise<MinorityOpinionReport> {
    const report: MinorityOpinionReport = {
      ...input,
      reportId: this.store.newId("minor"),
      preserved: true,
      recordedAt: new Date().toISOString(),
    };
    this.store.minorityReports.set(report.reportId, report);
    return report;
  }

  async recordDissent(input: Omit<DissentReport, "reportId" | "recordedAt">): Promise<DissentReport> {
    const report: DissentReport = {
      ...input,
      reportId: this.store.newId("dissent"),
      recordedAt: new Date().toISOString(),
    };
    this.store.dissentReports.set(report.reportId, report);
    return report;
  }
}
