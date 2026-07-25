/** Executive Curiosity Engine — questions drive investigations (ADR-029) */

export const CURIOSITY_QUESTION_TYPES = [
  "why",
  "what_changed",
  "what_is_missing",
  "what_contradicts",
  "what_to_investigate",
] as const;

export type CuriosityQuestionType = (typeof CURIOSITY_QUESTION_TYPES)[number];

export type CuriosityQuestionStatus = "open" | "investigating" | "resolved" | "deferred";
export type InvestigationStatus = "open" | "in_progress" | "completed" | "inconclusive";

export interface CuriosityQuestion {
  id: string;
  companyId: string;
  executiveId: string;
  questionType: CuriosityQuestionType;
  question: string;
  context?: string;
  status: CuriosityQuestionStatus;
  investigationId?: string;
  createdAt: string;
}

export interface CuriosityInvestigation {
  id: string;
  companyId: string;
  executiveId: string;
  questionId: string;
  findings: string;
  evidenceRefs: string[];
  status: InvestigationStatus;
  startedAt: string;
  completedAt?: string;
}

export interface ExecutiveCuriosityEnginePort {
  ask(
    input: Omit<CuriosityQuestion, "id" | "status" | "createdAt" | "investigationId">,
  ): Promise<CuriosityQuestion>;
  startInvestigation(questionId: string): Promise<CuriosityInvestigation>;
  completeInvestigation(
    investigationId: string,
    findings: string,
    evidenceRefs: string[],
  ): Promise<CuriosityInvestigation>;
  listOpenQuestions(companyId: string, executiveId: string): Promise<CuriosityQuestion[]>;
  listInvestigations(companyId: string, executiveId: string): Promise<CuriosityInvestigation[]>;
  /** Curiosity never directly recommends */
  assertNoDirectRecommendation(): true;
}

export function curiosityNeverRecommends(): true {
  return true;
}
