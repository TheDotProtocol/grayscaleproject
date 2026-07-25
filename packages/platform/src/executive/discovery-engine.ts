/** Discovery Engine — observation before recommendation (ADR-014) */

export const DISCOVERY_STAGES = [
  "observe",
  "identity_engine",
  "cognitive_model",
  "memory_engine",
  "knowledge_graph",
  "strategy_engine",
  "policies",
  "constraints",
  "dependencies",
  "risk_analysis",
  "opportunity_analysis",
  "confidence_evaluation",
  "recommendation_eligibility",
] as const;

export type DiscoveryStage = (typeof DISCOVERY_STAGES)[number];

export type DiscoveryStatus = "not_started" | "in_progress" | "completed" | "blocked" | "eligible";

export interface DiscoveryStageResult {
  stage: DiscoveryStage;
  status: "pending" | "completed" | "blocked" | "skipped";
  completedAt?: string;
  evidenceCount: number;
  blockers?: string[];
  metadata?: Record<string, unknown>;
}

export interface DiscoverySnapshot {
  executiveId: string;
  companyId: string;
  status: DiscoveryStatus;
  currentStage: DiscoveryStage;
  stages: DiscoveryStageResult[];
  startedAt?: string;
  completedAt?: string;
  eligibleForRecommendation: boolean;
  eligibilityReason?: string;
  overallConfidence: number; // 0–1
}

export interface DiscoveryEnginePort {
  /** Begin discovery — executive enters discovering lifecycle */
  start(executiveId: string, companyId: string): Promise<DiscoverySnapshot>;
  /** Advance or complete a stage with evidence */
  completeStage(
    executiveId: string,
    companyId: string,
    stage: DiscoveryStage,
    evidence?: Record<string, unknown>,
  ): Promise<DiscoverySnapshot>;
  getSnapshot(executiveId: string, companyId: string): Promise<DiscoverySnapshot | null>;
  /** Returns true only when all stages complete and confidence threshold met */
  checkEligibility(executiveId: string, companyId: string): Promise<{ eligible: boolean; reason: string }>;
}

/** Stage order enforcement */
export function nextDiscoveryStage(current: DiscoveryStage): DiscoveryStage | null {
  const idx = DISCOVERY_STAGES.indexOf(current);
  return idx >= 0 && idx < DISCOVERY_STAGES.length - 1 ? DISCOVERY_STAGES[idx + 1]! : null;
}

export function isDiscoveryComplete(snapshot: DiscoverySnapshot): boolean {
  return snapshot.stages.every((s) => s.status === "completed") && snapshot.eligibleForRecommendation;
}
