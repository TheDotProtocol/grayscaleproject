import type { CompanyContext, ExecutiveRecommendationDraft, TwinReasoningContext } from "@grayscale/platform";
import { createExplainability } from "@grayscale/platform";

type DraftInput = { title: string; summary: string; primaryReason: string; assumptions: string[] };

function baseDraft(ctx: CompanyContext, twinCtx: TwinReasoningContext, input: DraftInput): ExecutiveRecommendationDraft {
  const views = ctx.twin!;
  return {
    title: input.title,
    summary: input.summary,
    explainability: createExplainability({
      reason: input.primaryReason,
      evidence: {
        memoryRefs: views.memoryView.recentThemes.map((t, i) => ({ id: `twin-mem-${i}`, summary: t })),
        eventRefs: [],
        graphRefs: [{ nodeId: "twin-graph", relationship: "twin_view", summary: `${views.graphView.nodeCount} nodes` }],
      },
      confidence: twinCtx.confidence,
      confidenceSources: [{ type: "graph_evidence", summary: `${twinCtx.evidenceCount} twin evidence items`, weight: 0.8 }],
      policyUsed: [],
      constraintsUsed: [],
      decisionPath: [`Twin version ${twinCtx.versionId}`, "Twin-centric reasoning only"],
      alternatives: [{ title: "Defer", summary: "Await twin update", tradeoffs: "Lower risk" }],
    }),
    payload: { twinVersionId: twinCtx.versionId, assumptions: input.assumptions, twinCentric: true },
  };
}

export const DOMAIN_DRAFT_RULES: Record<
  string,
  { buildDrafts: (ctx: CompanyContext, twinCtx: TwinReasoningContext) => ExecutiveRecommendationDraft[] }
> = {
  atlas: {
    buildDrafts(ctx, twinCtx) {
      const v = ctx.twin!.strategyView;
      const drafts: ExecutiveRecommendationDraft[] = [];
      if (v.openRecommendations > 3) {
        drafts.push(baseDraft(ctx, twinCtx, {
          title: "Reduce operational recommendation backlog",
          summary: `${v.openRecommendations} open recommendations create execution congestion.`,
          primaryReason: "Twin strategy view shows recommendation overload",
          assumptions: ["Twin present state reflects current operations"],
        }));
      }
      if (drafts.length === 0) {
        drafts.push(baseDraft(ctx, twinCtx, {
          title: "Maintain operational rhythm",
          summary: "Operations within healthy twin confidence bounds.",
          primaryReason: "Twin operational health stable",
          assumptions: ["Twin synchronized with reality"],
        }));
      }
      return drafts;
    },
  },
  ledger: {
    buildDrafts(ctx, twinCtx) {
      const org = ctx.twin!.organizationView;
      return [
        baseDraft(ctx, twinCtx, {
          title: "Review financial posture via twin",
          summary: `Mission status: ${org.missionStatus.openRecommendations} open recommendations affecting cash planning.`,
          primaryReason: "Twin organization view informs financial stewardship",
          assumptions: ["Twin financial signals current"],
        }),
      ];
    },
  },
  mercury: {
    buildDrafts(ctx, twinCtx) {
      return [
        baseDraft(ctx, twinCtx, {
          title: "Align stakeholder narrative with twin state",
          summary: "Communications should reflect current organizational twin confidence and identity.",
          primaryReason: "Twin identity and signal views guide narrative coherence",
          assumptions: ["Stakeholder expectations tracked in twin"],
        }),
      ];
    },
  },
  sentinel: {
    buildDrafts(ctx, twinCtx) {
      const risks = ctx.twin!.strategyView.criticalRisks;
      return [
        baseDraft(ctx, twinCtx, {
          title: risks > 0 ? "Address critical risks in twin view" : "Maintain risk posture",
          summary: risks > 0 ? `${risks} critical risk(s) in twin strategy view.` : "Risk levels within twin thresholds.",
          primaryReason: "Twin strategy view risk assessment",
          assumptions: ["Risk classifications current in twin"],
        }),
      ];
    },
  },
  navigator: {
    buildDrafts(ctx, twinCtx) {
      return [
        baseDraft(ctx, twinCtx, {
          title: "Evaluate strategic trade-offs via twin timeline",
          summary: "Long-term strategy should align with twin evolution and intent themes.",
          primaryReason: "Twin intent and strategy views inform navigation",
          assumptions: ["Strategic themes reflected in twin intent"],
        }),
      ];
    },
  },
  forge: {
    buildDrafts(ctx, twinCtx) {
      return [
        baseDraft(ctx, twinCtx, {
          title: "Explore innovation opportunities in twin wisdom",
          summary: `${ctx.twin!.insightView.insightCount} insights available for experiment design.`,
          primaryReason: "Twin insight view drives innovation hypotheses",
          assumptions: ["Insights in twin are observation-only"],
        }),
      ];
    },
  },
};
