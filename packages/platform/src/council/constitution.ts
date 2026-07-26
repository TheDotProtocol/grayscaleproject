/** Executive Council — Sprint 3 Phase A foundation contracts (ADR-035) */

import type { CouncilExecutiveId } from "../executive/executive-council.js";

export const COUNCIL_CONSTITUTION_VERSION = "1.0.0";

export const COUNCIL_PRINCIPLES = [
  "evidence_before_opinion",
  "organizational_health_over_preference",
  "honest_uncertainty_over_false_certainty",
  "long_term_value_over_short_term",
  "explainability_over_intelligence",
  "collaboration_over_competition",
  "founder_sovereignty",
  "constitutional_compliance",
  "disagreement_improves_reasoning",
  "conclusions_must_be_inspectable",
] as const;

export type CouncilPrinciple = (typeof COUNCIL_PRINCIPLES)[number];

export const COUNCIL_ROLES = [
  "chair",
  "reference",
  "voting",
  "advisory",
  "observer",
  "temporary",
] as const;

export type CouncilRole = (typeof COUNCIL_ROLES)[number];

export { type CouncilExecutiveId } from "../executive/executive-council.js";

export const COUNCIL_DECISION_LIFECYCLE_STAGES = [
  "issue",
  "evidence_collection",
  "discovery",
  "deliberation",
  "challenge",
  "counter_evidence",
  "minority_opinions",
  "consensus",
  "founder_review",
  "decision",
  "explanation",
  "execution_approval",
  "organizational_learning",
  "historical_wisdom",
] as const;

export type CouncilDecisionLifecycleStage = (typeof COUNCIL_DECISION_LIFECYCLE_STAGES)[number];

export type CouncilConsensusLevel = "strong" | "weak" | "none";

export type CouncilSessionStatus = "scheduled" | "active" | "deliberating" | "escalated" | "closed" | "cancelled";

export type CouncilIssueStatus = "open" | "evidence_gathering" | "deliberating" | "resolved" | "escalated" | "deferred";

export type CouncilVoteValue = "approve" | "reject" | "abstain" | "defer";

export type CouncilEscalationReason =
  | "no_consensus"
  | "constitutional_failure"
  | "responsibility_conflict"
  | "insufficient_evidence"
  | "founder_requested"
  | "material_impact";

export type CouncilOverrideType =
  | "reject_majority"
  | "select_minority"
  | "halt_session"
  | "reassign_responsibility"
  | "defer_decision";
