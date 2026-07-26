import { Injectable } from "@nestjs/common";
import type {
  CouncilIssue,
  CouncilSession,
  CouncilEvidence,
  CouncilDeliberationRecord,
  CouncilVote,
  CouncilMinorityOpinion,
  CouncilResolution,
  CouncilDecision,
  CouncilEscalation,
  CouncilOverride,
  CouncilEvolution,
  CouncilConflictResolution,
} from "@grayscale/platform";
import { CouncilSessionService } from "./council-session.service";
import { CouncilEvidenceService } from "./council-evidence.service";
import { CouncilConsensusService } from "./council-consensus.service";
import { CouncilDecisionService, CouncilExplainabilityService } from "./council-decision.service";
import { CouncilGovernanceService } from "./council-governance.service";
import { CouncilHistoryService, CouncilReplayService } from "./council-history.service";
import { CouncilStoreService } from "./council-store.service";

@Injectable()
export class ExecutiveCouncilRuntimeService {
  constructor(
    private readonly sessions: CouncilSessionService,
    private readonly evidenceSvc: CouncilEvidenceService,
    private readonly consensusSvc: CouncilConsensusService,
    private readonly decisionSvc: CouncilDecisionService,
    private readonly explainSvc: CouncilExplainabilityService,
    private readonly governanceSvc: CouncilGovernanceService,
    private readonly historySvc: CouncilHistoryService,
    private readonly replaySvc: CouncilReplayService,
    private readonly store: CouncilStoreService,
  ) {}

  getMembers(companyId: string) {
    return Promise.resolve(this.store.defaultMembers(companyId));
  }

  getResponsibilities(companyId: string) {
    return Promise.resolve([]);
  }

  openSession(input: Omit<CouncilSession, "id" | "constitutionalCompliance">) {
    return this.sessions.openSession({
      companyId: input.companyId,
      title: input.title,
      participatingExecutiveIds: input.participatingExecutiveIds,
      quorumRequired: input.quorumRequired,
      correlationId: input.correlationId,
    });
  }

  openIssue(input: Omit<CouncilIssue, "id" | "openedAt">) {
    return this.sessions.openIssue({
      companyId: input.companyId,
      sessionId: input.sessionId,
      title: input.title,
      summary: input.summary,
      domain: input.domain,
      decisionClass: input.decisionClass,
      urgency: input.urgency,
      initiatingExecutiveId: input.initiatingExecutiveId,
      correlationId: input.correlationId,
    });
  }

  submitEvidence(input: Omit<CouncilEvidence, "id" | "submittedAt">) {
    return this.evidenceSvc.submit(input);
  }

  recordDeliberation(input: Omit<CouncilDeliberationRecord, "id" | "recordedAt">) {
    return this.decisionSvc.recordDeliberation(input);
  }

  castVote(input: Omit<CouncilVote, "id" | "castAt">) {
    return this.consensusSvc.castVote(input);
  }

  recordMinorityOpinion(input: Omit<CouncilMinorityOpinion, "id" | "recordedAt">) {
    return this.consensusSvc.recordMinorityOpinion(input);
  }

  measureConsensus(sessionId: string, issueId: string) {
    return this.consensusSvc.measureConsensus(sessionId, issueId);
  }

  proposeResolution(input: Omit<CouncilResolution, "id" | "proposedAt">) {
    return this.decisionSvc.proposeResolution(input);
  }

  approveDecision(input: Omit<CouncilDecision, "id">) {
    return this.decisionSvc.approveDecision(input);
  }

  generateExplanation(sessionId: string, issueId: string) {
    return this.explainSvc.generateExplanation(sessionId, issueId);
  }

  getGovernance(companyId: string) {
    return Promise.resolve(this.governanceSvc.getGovernance(companyId));
  }

  escalate(input: Omit<CouncilEscalation, "id" | "escalatedAt">) {
    return this.governanceSvc.escalate(input);
  }

  recordOverride(input: Omit<CouncilOverride, "id" | "overriddenAt">) {
    return this.governanceSvc.recordOverride(input);
  }

  resolveConflict(input: Omit<CouncilConflictResolution, "id" | "resolvedAt">) {
    return Promise.resolve({ id: this.store.newId("conflict"), ...input, resolvedAt: new Date().toISOString() });
  }

  evolveMembership(input: Omit<CouncilEvolution, "id">) {
    return Promise.resolve({ id: this.store.newId("evolution"), ...input });
  }

  getHealth(companyId: string) {
    return Promise.resolve(this.governanceSvc.getHealth(companyId));
  }

  getMetrics(companyId: string, period: { from: string; to: string }) {
    return Promise.resolve(this.governanceSvc.getMetrics(companyId, period));
  }

  getHistory(companyId: string, filters?: { from?: string; to?: string }) {
    return Promise.resolve(this.historySvc.getHistory(companyId, filters));
  }

  getAudit(companyId: string, sessionId?: string) {
    return Promise.resolve(this.governanceSvc.getAudit(companyId, sessionId));
  }

  replaySession(sessionId: string) {
    return Promise.resolve(this.replaySvc.replaySession(sessionId));
  }

  getTrustScores(companyId: string) {
    return Promise.resolve(this.governanceSvc.getTrustScores(companyId));
  }
}
