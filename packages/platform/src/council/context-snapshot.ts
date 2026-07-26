/** Read-only Executive Council snapshots for CompanyContext — Sprint 3 Phase A alignment */

import type { CouncilHealth } from "./governance.js";

/** Lightweight governance summary — not a duplicate of runtime store */
export interface ExecutiveCouncilSnapshot {
  memberCount: number;
  governanceVersion: string;
  assembledAt: string;
}

export interface CouncilSessionSummary {
  id: string;
  title: string;
  status: string;
  startedAt?: string;
}

export interface PendingVoteSummary {
  sessionId: string;
  issueId: string;
  title: string;
  votesCast: number;
}

export interface OrganizationalConsensusSummary {
  sessionId: string;
  issueId: string;
  level: string;
  score: number;
  measuredAt: string;
}

/** Optional read-only council fields on CompanyContext — assembled at context build time */
export interface ExecutiveCouncilContextFields {
  executiveCouncil?: ExecutiveCouncilSnapshot;
  councilHealth?: CouncilHealth;
  activeCouncilSessions?: CouncilSessionSummary[];
  organizationalConsensus?: OrganizationalConsensusSummary[];
  pendingVotes?: PendingVoteSummary[];
}
