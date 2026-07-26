/** Generic executive recommendation draft — Phase D */

import type { ExecutiveExplainability } from "./explainability.js";

export interface ExecutiveRecommendationDraft {
  title: string;
  summary: string;
  explainability: ExecutiveExplainability;
  payload: Record<string, unknown>;
}
