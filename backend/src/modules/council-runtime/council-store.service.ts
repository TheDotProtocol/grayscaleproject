import { Injectable } from "@nestjs/common";
import type {
  CouncilAudit,
  CouncilAuditEntry,
  CouncilConsensus,
  CouncilDecision,
  CouncilDeliberationRecord,
  CouncilEscalation,
  CouncilEvidence,
  CouncilExplanation,
  CouncilGovernance,
  CouncilHistory,
  CouncilHistoryEntry,
  CouncilIssue,
  CouncilMember,
  CouncilMetrics,
  CouncilMinorityOpinion,
  CouncilOverride,
  CouncilReplay,
  CouncilReplayEvent,
  CouncilResolution,
  CouncilSession,
  CouncilTrust,
  CouncilVote,
  ClassifiedDecision,
} from "@grayscale/platform";

/** In-memory council state — event-sourced via EventsService (Phase B) */
@Injectable()
export class CouncilStoreService {
  readonly sessions = new Map<string, CouncilSession>();
  readonly issues = new Map<string, CouncilIssue>();
  readonly evidence = new Map<string, CouncilEvidence>();
  readonly deliberations = new Map<string, CouncilDeliberationRecord>();
  readonly votes = new Map<string, CouncilVote>();
  readonly consensus = new Map<string, CouncilConsensus>();
  readonly minorityOpinions = new Map<string, CouncilMinorityOpinion>();
  readonly resolutions = new Map<string, CouncilResolution>();
  readonly decisions = new Map<string, CouncilDecision>();
  readonly explanations = new Map<string, CouncilExplanation>();
  readonly escalations = new Map<string, CouncilEscalation>();
  readonly overrides = new Map<string, CouncilOverride>();
  readonly auditEntries = new Map<string, CouncilAuditEntry>();
  readonly replayEvents = new Map<string, CouncilReplayEvent[]>();
  readonly classifications = new Map<string, ClassifiedDecision>();
  readonly members = new Map<string, CouncilMember[]>();
  readonly proposals = new Map<string, import("@grayscale/platform").ExecutiveDeliberationProposal>();
  readonly memoryEntries = new Map<string, import("@grayscale/platform").CouncilMemoryEntry[]>();
  readonly minutes = new Map<string, import("@grayscale/platform").CouncilMinutes>();
  readonly collaborationRequests = new Map<string, import("@grayscale/platform").CollaborationRequest>();
  readonly collaborationResponses = new Map<string, import("@grayscale/platform").CollaborationResponse>();
  readonly consensusVotes = new Map<string, import("@grayscale/platform").ConsensusVoteRequest>();
  readonly minorityReports = new Map<string, import("@grayscale/platform").MinorityOpinionReport>();
  readonly dissentReports = new Map<string, import("@grayscale/platform").DissentReport>();

  private id(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  newId(prefix: string): string {
    return this.id(prefix);
  }

  appendReplay(sessionId: string, event: Omit<CouncilReplayEvent, "sequence">): void {
    const events = this.replayEvents.get(sessionId) ?? [];
    events.push({ ...event, sequence: events.length + 1 });
    this.replayEvents.set(sessionId, events);
  }

  appendAudit(companyId: string, entry: Omit<CouncilAuditEntry, "id">): CouncilAuditEntry {
    const full: CouncilAuditEntry = { id: this.id("audit"), ...entry };
    this.auditEntries.set(full.id, full);
    return full;
  }

  appendHistory(companyId: string, entries: CouncilHistoryEntry[]): CouncilHistory {
    return { companyId, entries, from: entries[0]?.recordedAt ?? new Date().toISOString(), to: new Date().toISOString() };
  }

  defaultMembers(companyId: string): CouncilMember[] {
    const existing = this.members.get(companyId);
    if (existing) return existing;
    const defaults: CouncilMember[] = [
      { executiveId: "athena", companyId, roles: ["reference", "voting", "chair"], domains: ["strategy", "discovery"], votingWeight: 1, certified: true, activeFrom: new Date().toISOString(), correlationId: "default" },
      { executiveId: "atlas", companyId, roles: ["voting"], domains: ["operations", "execution", "delivery"], votingWeight: 1, certified: true, activeFrom: new Date().toISOString(), correlationId: "default" },
      { executiveId: "ledger", companyId, roles: ["voting"], domains: ["finance", "budget"], votingWeight: 1, certified: true, activeFrom: new Date().toISOString(), correlationId: "default" },
      { executiveId: "mercury", companyId, roles: ["voting"], domains: ["communication", "brand"], votingWeight: 1, certified: true, activeFrom: new Date().toISOString(), correlationId: "default" },
      { executiveId: "sentinel", companyId, roles: ["voting"], domains: ["risk", "security", "compliance"], votingWeight: 1, certified: true, activeFrom: new Date().toISOString(), correlationId: "default" },
      { executiveId: "navigator", companyId, roles: ["voting"], domains: ["long_term_strategy", "trade_offs"], votingWeight: 1, certified: true, activeFrom: new Date().toISOString(), correlationId: "default" },
      { executiveId: "forge", companyId, roles: ["voting"], domains: ["innovation", "experiments"], votingWeight: 1, certified: true, activeFrom: new Date().toISOString(), correlationId: "default" },
    ];
    this.members.set(companyId, defaults);
    return defaults;
  }

  defaultGovernance(companyId: string): CouncilGovernance {
    return {
      companyId,
      quorumMinimum: 1,
      founderReviewOnWeakConsensus: true,
      founderReviewOnMaterialImpact: true,
      maxDeliberationRounds: 3,
      evidenceRequiredForDissent: true,
      version: "1.0.0",
      updatedAt: new Date().toISOString(),
    };
  }
}
