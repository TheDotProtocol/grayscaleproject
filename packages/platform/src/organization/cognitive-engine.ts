/** Organizational Cognitive Engine — HOW the organization thinks (ADR-017) */

import type { EngineEvidenceRef, EngineLinkRef, VersionedEngineRecord } from "./common.js";

export type ThinkingStyle = "analytical" | "intuitive" | "collaborative" | "decisive" | "unknown";
export type MaturityLevel = "emerging" | "developing" | "mature" | "advanced" | "unknown";

export interface OrganizationalCognitiveProfile extends VersionedEngineRecord {
  decisionPatterns: string[];
  problemSolvingStyle: ThinkingStyle;
  planningMaturity: MaturityLevel;
  executionStyle: string;
  innovationStyle: string;
  detectedBiases: Array<{ bias: string; evidence: EngineEvidenceRef[]; confidence: number }>;
  communicationPatterns: string[];
  meetingBehavior: string[];
  strategicThinking: MaturityLevel;
  technicalThinking: MaturityLevel;
  financialThinking: MaturityLevel;
  operationalThinking: MaturityLevel;
  riskThinking: MaturityLevel;
  learningStyle: string;
  cognitiveEvolution: Array<{ at: string; dimension: string; from: string; to: string; evidenceId: string }>;
  evidence: EngineEvidenceRef[];
  links: EngineLinkRef;
  confidence: number;
}

export interface OrganizationalCognitiveEnginePort {
  readonly engineId: "organizational-cognitive";
  /** Executives consume read-only */
  getProfile(companyId: string): Promise<OrganizationalCognitiveProfile | null>;
  /** Platform-only updates with evidence */
  applyEvidence(
    companyId: string,
    patch: Partial<Omit<OrganizationalCognitiveProfile, "id" | "companyId" | "version" | "evidence" | "createdAt" | "updatedAt">>,
    evidence: EngineEvidenceRef,
  ): Promise<OrganizationalCognitiveProfile>;
  getEvolution(companyId: string): Promise<OrganizationalCognitiveProfile["cognitiveEvolution"]>;
}
