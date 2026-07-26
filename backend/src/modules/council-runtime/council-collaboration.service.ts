import { Injectable } from "@nestjs/common";
import type {
  CouncilCollaborationMetrics,
  CouncilCollaborationPort,
  CouncilCollaborationSession,
  CouncilExecutiveParticipation,
  CouncilResponsibilityConflict,
  CouncilTieBreak,
} from "@grayscale/platform";
import { EXECUTIVE_SPECIALIZATIONS } from "@grayscale/platform";
import { CouncilStoreService } from "./council-store.service";

@Injectable()
export class CouncilCollaborationService implements CouncilCollaborationPort {
  constructor(private readonly store: CouncilStoreService) {}

  async getSessionCollaboration(sessionId: string): Promise<CouncilCollaborationSession | null> {
    const session = this.store.sessions.get(sessionId);
    if (!session) return null;
    const votes = [...this.store.votes.values()].filter((v) => v.sessionId === sessionId);
    const minority = [...this.store.minorityOpinions.values()].filter((m) => m.sessionId === sessionId);
    const escalations = [...this.store.escalations.values()].filter((e) => e.sessionId === sessionId);
    const consensus = [...this.store.consensus.values()].find((c) => c.sessionId === sessionId);
    const members = this.store.defaultMembers(session.companyId);

    return {
      sessionId,
      companyId: session.companyId,
      participatingExecutiveIds: members.map((m) => m.executiveId),
      abstainingExecutiveIds: votes.filter((v) => v.vote === "abstain").map((v) => v.executiveId),
      disagreeingExecutiveIds: votes.filter((v) => v.vote === "reject").map((v) => v.executiveId),
      stage: session.status === "closed" ? "decision_recorded" : "deliberation",
      consensusScore: consensus?.score ?? 0,
      minorityOpinionCount: minority.length,
      founderEscalations: escalations.length,
      tieBreakRequired:
        votes.filter((v) => v.vote === "approve").length === votes.filter((v) => v.vote === "reject").length,
      responsibilityConflicts: this.detectConflicts(members.map((m) => m.executiveId)),
      explainabilityComplete: minority.every((m) => m.rationale.length > 0),
      twinVersionId: "twin-present",
      correlationId: session.correlationId,
    };
  }

  async getParticipation(companyId: string): Promise<CouncilExecutiveParticipation[]> {
    const members = this.store.defaultMembers(companyId);
    return members.map((m) => {
      const votes = [...this.store.votes.values()].filter((v) => v.executiveId === m.executiveId);
      const minority = [...this.store.minorityOpinions.values()].filter((o) => o.executiveId === m.executiveId);
      return {
        executiveId: m.executiveId,
        sessionsParticipated: [...this.store.sessions.values()].filter((s) => s.companyId === companyId).length,
        votesCast: votes.length,
        abstentions: votes.filter((v) => v.vote === "abstain").length,
        dissents: votes.filter((v) => v.vote === "reject").length,
        minorityOpinions: minority.length,
        averageConfidence: votes.length ? 0.75 : 0,
        trustScore: 0.75,
      };
    });
  }

  async getMetrics(companyId: string): Promise<CouncilCollaborationMetrics> {
    const sessions = [...this.store.sessions.values()].filter((s) => s.companyId === companyId);
    const consensus = [...this.store.consensus.values()].filter((c) => c.companyId === companyId);
    const avg = consensus.length ? consensus.reduce((s, c) => s + c.score, 0) / consensus.length : 0;
    return {
      companyId,
      activeSessions: sessions.filter((s) => s.status !== "closed").length,
      completedDecisions: [...this.store.decisions.values()].filter((d) => d.companyId === companyId).length,
      averageConsensus: avg,
      escalationRate: [...this.store.escalations.values()].filter((e) => e.companyId === companyId).length / Math.max(sessions.length, 1),
      minorityPreservationRate: 1,
      replayConsistency: 1,
      computedAt: new Date().toISOString(),
    };
  }

  async recordContribution(): Promise<void> {
    /* contributions recorded via council-deliberation service + bus */
  }

  async getTieBreaks(companyId: string): Promise<CouncilTieBreak[]> {
    return [];
  }

  async getResponsibilityConflicts(companyId: string): Promise<CouncilResponsibilityConflict[]> {
    const members = this.store.defaultMembers(companyId).map((m) => m.executiveId);
    return this.detectConflicts(members).map((domain, i) => ({
      conflictId: `conflict-${i}`,
      domain,
      executiveIds: members.filter((id) => EXECUTIVE_SPECIALIZATIONS[id]?.domains.includes(domain as never)),
      escalatedToFounder: false,
    }));
  }

  private detectConflicts(executiveIds: string[]): string[] {
    const domainCount = new Map<string, number>();
    for (const id of executiveIds) {
      for (const d of EXECUTIVE_SPECIALIZATIONS[id]?.domains ?? []) {
        domainCount.set(d, (domainCount.get(d) ?? 0) + 1);
      }
    }
    return [...domainCount.entries()].filter(([, c]) => c > 1).map(([d]) => d);
  }
}
