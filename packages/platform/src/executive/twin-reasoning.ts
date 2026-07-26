/** Twin-centric reasoning — Sprint 3 Phase D (immutable rule) */

import type { CompanyContext } from "./context.js";
import type { OrganizationalTwin } from "../twin/twin-model.js";

export const TWIN_CENTRIC_RULE_VERSION = "1.0.0";

/** Source systems executives MUST NOT query directly (Phase D+) */
export const FORBIDDEN_DIRECT_SOURCES = [
  "memory_engine",
  "knowledge_graph",
  "strategy_engine",
  "signals",
  "insights",
  "pulse",
  "goals",
  "intent_engine",
  "organizational_intelligence",
] as const;

export type ForbiddenDirectSource = (typeof FORBIDDEN_DIRECT_SOURCES)[number];

export interface TwinReasoningContext {
  twin: OrganizationalTwin;
  versionId: string;
  confidence: number;
  evidenceCount: number;
  assembledAt: string;
}

export class TwinCentricViolationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TwinCentricViolationError";
  }
}

/** Assert CompanyContext includes assembled twin — required for all executive reasoning */
export function assertTwinPresent(ctx: CompanyContext): OrganizationalTwin {
  if (!ctx.twin) {
    throw new TwinCentricViolationError(
      "CompanyContext.twin is required. Executives must reason exclusively through the Living Organizational Twin.",
    );
  }
  return ctx.twin;
}

/** Extract twin-centric reasoning surface from context */
export function extractTwinReasoning(ctx: CompanyContext): TwinReasoningContext {
  const twin = assertTwinPresent(ctx);
  return {
    twin,
    versionId: twin.present.version.versionId,
    confidence: twin.confidence.overall,
    evidenceCount: twin.evidence.length,
    assembledAt: twin.assembledAt,
  };
}

/** Twin views for domain-specific reasoning — no direct source access */
export function getTwinDomainViews(twin: OrganizationalTwin) {
  return {
    memory: twin.memoryView,
    graph: twin.graphView,
    strategy: twin.strategyView,
    signals: twin.signalView,
    insights: twin.insightView,
    organization: twin.organizationView,
    attention: twin.attention,
    intent: twin.intent,
    wisdom: twin.wisdom,
    decisions: twin.decisionHistory,
    identity: twin.identity,
    health: twin.health,
    metrics: twin.metrics,
  };
}
