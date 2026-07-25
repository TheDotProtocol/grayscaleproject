/** Executive Council — inter-executive collaboration via Bus (ADR-014) */

export const COUNCIL_EXECUTIVES = [
  "athena",
  "atlas",
  "ledger",
  "mercury",
  "sentinel",
  "navigator",
  "forge",
] as const;

export type CouncilExecutiveId = (typeof COUNCIL_EXECUTIVES)[number];

export type CouncilBehaviorMode =
  | "consensus"
  | "debate"
  | "conflict_detection"
  | "evidence_comparison"
  | "minority_opinion"
  | "synthesis";

export interface CouncilDeliberation {
  id: string;
  companyId: string;
  recommendationId?: string;
  mode: CouncilBehaviorMode;
  participatingExecutives: CouncilExecutiveId[];
  consensusReached: boolean;
  minorityOpinions: { executiveId: string; position: string; evidenceRefs: string[] }[];
  synthesizedRecommendation?: string;
  correlationId: string;
  createdAt: string;
}

export const COUNCIL_ACTIONS = [
  "approve",
  "disagree",
  "delegate",
  "escalate",
  "request_clarification",
  "support",
] as const;

export type CouncilAction = (typeof COUNCIL_ACTIONS)[number];

export interface CouncilMessage {
  id: string;
  companyId: string;
  fromExecutiveId: string;
  toExecutiveId?: string; // undefined = broadcast to council
  action: CouncilAction;
  subject: string;
  body: string;
  evidenceRefs: string[];
  recommendationId?: string;
  correlationId: string;
  createdAt: string;
}

export interface CouncilMessageInput {
  companyId: string;
  fromExecutiveId: string;
  toExecutiveId?: string;
  action: CouncilAction;
  subject: string;
  body: string;
  evidenceRefs: string[];
  recommendationId?: string;
  correlationId: string;
}

export interface ExecutiveCouncilPort {
  send(input: CouncilMessageInput): Promise<CouncilMessage>;
  list(companyId: string, filters?: { executiveId?: string; recommendationId?: string; limit?: number }): Promise<CouncilMessage[]>;
  /** Disagree requires at least one evidence ref — constitutional */
  validateMessage(input: CouncilMessageInput): { valid: boolean; reason?: string };
}

export function validateCouncilMessage(input: CouncilMessageInput): { valid: boolean; reason?: string } {
  if (input.action === "disagree" && input.evidenceRefs.length === 0) {
    return { valid: false, reason: "Disagreement requires evidence references" };
  }
  if (!input.subject.trim()) {
    return { valid: false, reason: "Subject required" };
  }
  return { valid: true };
}
