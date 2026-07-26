/** Runtime Explainability — contracts (Sprint 4 Phase A) */

import type { RuntimeId } from "./organizational-runtime.js";

export const RUNTIME_EXPLAINABILITY_VERSION = "1.0.0";

export interface RuntimeExplainability {
  actionId: string;
  companyId: string;
  version: string;
  assembledAt: string;
  summary: string;
  whyExecuted: string;
  triggerSource: "heartbeat" | "scheduler" | "event" | "manual" | "maintenance";
  dependencies: RuntimeId[];
  affectedRuntimes: RuntimeId[];
  durationMs: number;
  priority: number;
  evidence: string[];
  engineVersion: string;
  correlationId: string;
  traceId: string;
  auditReference: string;
}

export interface RuntimeExplainabilityPort {
  explain(actionId: string): Promise<RuntimeExplainability>;
}
