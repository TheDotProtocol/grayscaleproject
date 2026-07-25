/** Recommendation pipeline — discovery before recommendation (Sprint 2 Part 6) */

export const RECOMMENDATION_PIPELINE_STAGES = [
  "observe",
  "discover",
  "understand",
  "validate",
  "challenge",
  "cross_reference",
  "investigate",
  "generate_hypotheses",
  "run_skeptic_engine",
  "consult_notebook",
  "consult_memory",
  "consult_graph",
  "consult_organizational_intelligence",
  "consult_intent",
  "consult_policies",
  "consult_constraints",
  "consult_founder_constitution",
  "generate_draft_recommendation",
] as const;

export type RecommendationPipelineStage = (typeof RECOMMENDATION_PIPELINE_STAGES)[number];

export interface RecommendationPipelineStepResult {
  stage: RecommendationPipelineStage;
  status: "completed" | "blocked" | "skipped";
  evidence: Record<string, unknown>;
  completedAt: string;
}

export interface RecommendationPipelineTrace {
  executiveId: string;
  companyId: string;
  correlationId: string;
  steps: RecommendationPipelineStepResult[];
  completed: boolean;
  blockedAt?: RecommendationPipelineStage;
  startedAt: string;
  completedAt?: string;
}

export function isRecommendationPipelineComplete(trace: RecommendationPipelineTrace): boolean {
  return trace.completed && trace.steps.length === RECOMMENDATION_PIPELINE_STAGES.length - 1;
}
