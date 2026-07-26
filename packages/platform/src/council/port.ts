import type {
  CouncilConflictResolution,
  CouncilEscalation,
  CouncilGovernance,
  CouncilHealth,
  CouncilMetrics,
  CouncilOverride,
  CouncilTrust,
} from "./governance.js";
import type { CouncilAudit, CouncilHistory, CouncilReplay } from "./history.js";
import type {
  CouncilConsensus,
  CouncilDecision,
  CouncilDeliberationRecord,
  CouncilMinorityOpinion,
  CouncilResolution,
  CouncilVote,
} from "./deliberation.js";
import type { CouncilEvidence, CouncilIssue, CouncilSession } from "./session.js";
import type { CouncilExplanation } from "./explanation.js";
import type { CouncilEvolution, CouncilMember, CouncilResponsibility } from "./member.js";

/** Sprint 3 Phase A — full council port (Phase B implements) */
export interface ExecutiveCouncilFoundationPort {
  // Membership
  getMembers(companyId: string): Promise<CouncilMember[]>;
  getResponsibilities(companyId: string): Promise<CouncilResponsibility[]>;

  // Sessions & issues
  openSession(input: Omit<CouncilSession, "id" | "constitutionalCompliance">): Promise<CouncilSession>;
  openIssue(input: Omit<CouncilIssue, "id" | "openedAt">): Promise<CouncilIssue>;
  submitEvidence(input: Omit<CouncilEvidence, "id" | "submittedAt">): Promise<CouncilEvidence>;

  // Deliberation
  recordDeliberation(input: Omit<CouncilDeliberationRecord, "id" | "recordedAt">): Promise<CouncilDeliberationRecord>;
  castVote(input: Omit<CouncilVote, "id" | "castAt">): Promise<CouncilVote>;
  recordMinorityOpinion(input: Omit<CouncilMinorityOpinion, "id" | "recordedAt">): Promise<CouncilMinorityOpinion>;
  measureConsensus(sessionId: string, issueId: string): Promise<CouncilConsensus>;

  // Resolution & decision
  proposeResolution(input: Omit<CouncilResolution, "id" | "proposedAt">): Promise<CouncilResolution>;
  approveDecision(input: Omit<CouncilDecision, "id">): Promise<CouncilDecision>;
  generateExplanation(sessionId: string, issueId: string): Promise<CouncilExplanation>;

  // Governance
  getGovernance(companyId: string): Promise<CouncilGovernance>;
  escalate(input: Omit<CouncilEscalation, "id" | "escalatedAt">): Promise<CouncilEscalation>;
  recordOverride(input: Omit<CouncilOverride, "id" | "overriddenAt">): Promise<CouncilOverride>;
  resolveConflict(input: Omit<CouncilConflictResolution, "id" | "resolvedAt">): Promise<CouncilConflictResolution>;
  evolveMembership(input: Omit<CouncilEvolution, "id">): Promise<CouncilEvolution>;

  // Observability
  getHealth(companyId: string): Promise<CouncilHealth>;
  getMetrics(companyId: string, period: { from: string; to: string }): Promise<CouncilMetrics>;
  getHistory(companyId: string, filters?: { from?: string; to?: string }): Promise<CouncilHistory>;
  getAudit(companyId: string, sessionId?: string): Promise<CouncilAudit>;
  replaySession(sessionId: string): Promise<CouncilReplay>;
  getTrustScores(companyId: string): Promise<CouncilTrust[]>;
}

/** Phase B implements this port. Sprint 2 messaging port remains in executive/executive-council.ts */
export type { ExecutiveCouncilFoundationPort as CouncilArchitecturePort };
