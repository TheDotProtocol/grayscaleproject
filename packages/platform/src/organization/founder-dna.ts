/** Founder DNA Engine — founder behavioural profile, evidence only (ADR-015) */

import type { EngineEvidenceRef, EngineLinkRef, VersionedEngineRecord } from "./common.js";

export type FounderLeadershipStyle = "directive" | "coaching" | "delegative" | "participative" | "unknown";
export type FounderPlanningStyle = "macro" | "micro" | "balanced" | "unknown";
export type FounderRiskTolerance = "conservative" | "moderate" | "aggressive" | "unknown";

export interface FounderDnaProfile extends VersionedEngineRecord {
  founderUserId: string;
  leadershipStyle: FounderLeadershipStyle;
  communicationPreferences: Record<string, unknown>;
  decisionHabits: string[];
  planningStyle: FounderPlanningStyle;
  innovationTendencies: string[];
  delegationStyle: string;
  meetingPreferences: Record<string, unknown>;
  workingSchedule?: Record<string, { start: string; end: string }>;
  riskTolerance: FounderRiskTolerance;
  learningPreferences: string[];
  executiveCommunicationPreferences: Record<string, unknown>;
  dashboardPreferences: Record<string, unknown>;
  explanationDepth: "summary" | "standard" | "detailed" | "unknown";
  preferredExecutivePersonalities: Record<string, string>;
  historicalBehaviorPatterns: string[];
  evidence: EngineEvidenceRef[];
  links: EngineLinkRef;
  confidence: number;
}

export interface FounderDnaUpdateInput {
  companyId: string;
  founderUserId: string;
  patch: Partial<Omit<FounderDnaProfile, "id" | "companyId" | "founderUserId" | "version" | "evidence" | "createdAt" | "updatedAt">>;
  evidence: EngineEvidenceRef;
  actorId: string;
}

export interface FounderDnaEnginePort {
  readonly engineId: "founder-dna";
  get(companyId: string, founderUserId: string): Promise<FounderDnaProfile | null>;
  /** Rejects updates without evidence — never inferred */
  applyEvidence(input: FounderDnaUpdateInput): Promise<FounderDnaProfile>;
  getHistory(companyId: string, founderUserId: string): Promise<FounderDnaProfile[]>;
}
