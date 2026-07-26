/** Organizational Alignment Engine — contracts (Sprint 3 Phase D) */

export const ALIGNMENT_ENGINE_VERSION = "1.0.0";

export interface AlignmentScore {
  score: number;
  confidence: number;
  evidence: string[];
  reason: string;
  gaps: string[];
}

export interface OrganizationalAlignment {
  companyId: string;
  assembledAt: string;
  version: string;
  visionMission: AlignmentScore;
  missionStrategy: AlignmentScore;
  strategyObjectives: AlignmentScore;
  objectivesProjects: AlignmentScore;
  projectsExecution: AlignmentScore;
  executionResults: AlignmentScore;
  founderOrganization: AlignmentScore;
  executivesFounder: AlignmentScore;
  cultureDecisions: AlignmentScore;
  identityExecution: AlignmentScore;
  intentOutcomes: AlignmentScore;
  overallAlignment: number;
}

export interface OrganizationalAlignmentPort {
  assess(companyId: string): Promise<OrganizationalAlignment>;
}
