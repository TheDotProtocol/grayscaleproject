/** Executive Collaboration Network — constitutional communication (Sprint 4 Phase B) */

export type CollaborationRequestKind =
  | "opinion_request"
  | "evidence_request"
  | "knowledge_request"
  | "challenge_request"
  | "review_request"
  | "policy_question"
  | "delegation"
  | "escalation"
  | "consensus_vote"
  | "minority_opinion"
  | "dissent_report";

export interface CollaborationRequest {
  requestId: string;
  companyId: string;
  kind: CollaborationRequestKind;
  fromExecutiveId: string;
  toExecutiveId: string;
  sessionId?: string;
  issueId?: string;
  payload: Record<string, unknown>;
  status: "pending" | "responded" | "escalated" | "closed";
  correlationId: string;
  createdAt: string;
  respondedAt?: string;
}

export interface CollaborationResponse {
  responseId: string;
  requestId: string;
  fromExecutiveId: string;
  evidenceRefs: string[];
  rationale: string;
  confidence: number;
  correlationId: string;
  recordedAt: string;
}

export interface ConsensusVoteRequest {
  voteId: string;
  companyId: string;
  sessionId: string;
  issueId: string;
  executiveId: string;
  vote: "approve" | "reject" | "abstain" | "defer";
  evidenceRefs: string[];
  correlationId: string;
  castAt: string;
}

export interface MinorityOpinionReport {
  reportId: string;
  companyId: string;
  sessionId: string;
  issueId: string;
  executiveId: string;
  position: string;
  evidenceRefs: string[];
  rationale: string;
  preserved: true;
  correlationId: string;
  recordedAt: string;
}

export interface DissentReport {
  reportId: string;
  companyId: string;
  sessionId: string;
  issueId: string;
  executiveId: string;
  dissentReason: string;
  evidenceRefs: string[];
  correlationId: string;
  recordedAt: string;
}

export interface ExecutiveCollaborationNetworkPort {
  sendRequest(input: Omit<CollaborationRequest, "requestId" | "status" | "createdAt">): Promise<CollaborationRequest>;
  respond(input: Omit<CollaborationResponse, "responseId" | "recordedAt">): Promise<CollaborationResponse>;
  listRequests(companyId: string, filters?: { executiveId?: string; kind?: CollaborationRequestKind }): Promise<CollaborationRequest[]>;
  recordConsensusVote(input: Omit<ConsensusVoteRequest, "voteId" | "castAt">): Promise<ConsensusVoteRequest>;
  recordMinorityOpinion(input: Omit<MinorityOpinionReport, "reportId" | "preserved" | "recordedAt">): Promise<MinorityOpinionReport>;
  recordDissent(input: Omit<DissentReport, "reportId" | "recordedAt">): Promise<DissentReport>;
}
