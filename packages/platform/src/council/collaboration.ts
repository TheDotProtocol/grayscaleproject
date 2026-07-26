/** Council collaboration contracts — Sprint 3 Phase D */

import type { CouncilExecutiveContribution } from "./deliberation.js";

export type CouncilCollaborationStage =
  | "session_opened"
  | "evidence_gathering"
  | "deliberation"
  | "voting"
  | "consensus"
  | "minority_preserved"
  | "founder_escalation"
  | "tie_break"
  | "conflict_resolution"
  | "decision_recorded"
  | "replay_available";

export interface CouncilCollaborationSession {
  sessionId: string;
  companyId: string;
  participatingExecutiveIds: string[];
  abstainingExecutiveIds: string[];
  disagreeingExecutiveIds: string[];
  stage: CouncilCollaborationStage;
  consensusScore: number;
  minorityOpinionCount: number;
  founderEscalations: number;
  tieBreakRequired: boolean;
  responsibilityConflicts: string[];
  explainabilityComplete: boolean;
  twinVersionId: string;
  correlationId: string;
}

export interface CouncilExecutiveParticipation {
  executiveId: string;
  sessionsParticipated: number;
  votesCast: number;
  abstentions: number;
  dissents: number;
  minorityOpinions: number;
  averageConfidence: number;
  trustScore: number;
}

export interface CouncilCollaborationMetrics {
  companyId: string;
  activeSessions: number;
  completedDecisions: number;
  averageConsensus: number;
  escalationRate: number;
  minorityPreservationRate: number;
  replayConsistency: number;
  computedAt: string;
}

export interface CouncilTieBreak {
  issueId: string;
  sessionId: string;
  tiedExecutiveIds: string[];
  resolvedBy: "founder" | "chair" | "weighted_vote";
  resolvedAt: string;
}

export interface CouncilResponsibilityConflict {
  conflictId: string;
  domain: string;
  executiveIds: string[];
  resolution?: string;
  escalatedToFounder: boolean;
}

export interface CouncilCollaborationPort {
  getSessionCollaboration(sessionId: string): Promise<CouncilCollaborationSession | null>;
  getParticipation(companyId: string): Promise<CouncilExecutiveParticipation[]>;
  getMetrics(companyId: string): Promise<CouncilCollaborationMetrics>;
  recordContribution(contribution: CouncilExecutiveContribution): Promise<void>;
  getTieBreaks(companyId: string): Promise<CouncilTieBreak[]>;
  getResponsibilityConflicts(companyId: string): Promise<CouncilResponsibilityConflict[]>;
}
