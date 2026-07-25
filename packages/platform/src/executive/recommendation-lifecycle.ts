/** Recommendation Lifecycle — first-class living entities (ADR-014) */

export const RECOMMENDATION_LIFECYCLE_STATES = [
  "observed",
  "draft",
  "internal_debate",
  "evidence_collection",
  "submitted",
  "founder_review",
  "approved",
  "rejected",
  "implemented",
  "measured",
  "archived",
  "lessons_learned",
] as const;

export type RecommendationLifecycleState = (typeof RECOMMENDATION_LIFECYCLE_STATES)[number];

export const VALID_RECOMMENDATION_TRANSITIONS: Record<
  RecommendationLifecycleState,
  RecommendationLifecycleState[]
> = {
  observed: ["draft", "archived"],
  draft: ["internal_debate", "evidence_collection", "archived"],
  internal_debate: ["evidence_collection", "draft", "archived"],
  evidence_collection: ["submitted", "draft", "archived"],
  submitted: ["founder_review", "archived"],
  founder_review: ["approved", "rejected", "archived"],
  approved: ["implemented", "archived"],
  rejected: ["archived", "lessons_learned"],
  implemented: ["measured", "archived"],
  measured: ["lessons_learned", "archived"],
  archived: [],
  lessons_learned: ["archived"],
};

export interface RecommendationLifecycleRecord {
  id: string;
  companyId: string;
  executiveId: string;
  state: RecommendationLifecycleState;
  title: string;
  correlationId: string;
  transitionedAt: string;
  history: Array<{ from: RecommendationLifecycleState; to: RecommendationLifecycleState; at: string; actor?: string }>;
}

export interface RecommendationLifecyclePort {
  create(input: {
    companyId: string;
    executiveId: string;
    title: string;
    correlationId: string;
  }): Promise<RecommendationLifecycleRecord>;
  transition(
    id: string,
    to: RecommendationLifecycleState,
    actor?: string,
  ): Promise<RecommendationLifecycleRecord>;
  get(id: string): Promise<RecommendationLifecycleRecord | null>;
  listByExecutive(executiveId: string, companyId: string, state?: RecommendationLifecycleState): Promise<RecommendationLifecycleRecord[]>;
}

export function canTransitionRecommendation(
  from: RecommendationLifecycleState,
  to: RecommendationLifecycleState,
): boolean {
  return VALID_RECOMMENDATION_TRANSITIONS[from]?.includes(to) ?? false;
}
