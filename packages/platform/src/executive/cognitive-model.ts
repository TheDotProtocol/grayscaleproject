/** Executive Cognitive Model (ECM) — behavioural understanding (ADR-014)
 *  NOT Memory. Memory stores facts. ECM stores evidence-derived behavioural patterns.
 */

export type PlanningStyle = "macro" | "micro" | "balanced" | "unknown";
export type ThinkerMode = "macro" | "micro" | "mixed" | "unknown";
export type RiskTolerance = "conservative" | "moderate" | "aggressive" | "unknown";
export type CommunicationModality = "visual" | "textual" | "mixed" | "unknown";
export type MeetingPreference = "async" | "sync" | "minimal" | "unknown";

export interface CognitiveEvidenceRef {
  type: "observation" | "correction" | "outcome" | "explicit_feedback" | "interaction";
  sourceId: string;
  recordedAt: string;
  summary: string;
}

export interface ExecutiveCognitiveProfile {
  companyId: string;
  operatorId: string;

  preferredPlanningStyle: PlanningStyle;
  thinkerMode: ThinkerMode;
  decisionConfidencePattern: number; // 0–1 calibrated from outcomes
  riskTolerance: RiskTolerance;
  focusDurationMinutes?: number;
  typicalWorkSchedule?: Record<string, { start: string; end: string }>;

  adhdAssistanceEnabled: boolean;
  adhdPreferences?: {
    boundedLists: boolean;
    explicitNextActions: boolean;
    reducedContextSwitching: boolean;
    gentleReminders: boolean;
  };

  communicationModality: CommunicationModality;
  meetingPreference: MeetingPreference;
  reminderEffectiveness?: Record<string, number>;

  executiveInteractionPreferences: Record<string, {
    preferredTone?: string;
    preferredFrequency?: string;
    preferredDepth?: string;
  }>;

  evidence: CognitiveEvidenceRef[];
  confidence: number; // 0–1 — how much evidence supports this profile
  version: number;
  updatedAt: string;
}

export interface CognitiveModelUpdateInput {
  companyId: string;
  operatorId: string;
  patch: Partial<Omit<ExecutiveCognitiveProfile, "companyId" | "operatorId" | "evidence" | "version" | "updatedAt">>;
  evidence: CognitiveEvidenceRef;
}

export interface ExecutiveCognitiveModelPort {
  getProfile(companyId: string, operatorId: string): Promise<ExecutiveCognitiveProfile | null>;
  /** Updates ONLY with evidence — rejects updates without evidence ref */
  applyEvidence(input: CognitiveModelUpdateInput): Promise<ExecutiveCognitiveProfile>;
}
