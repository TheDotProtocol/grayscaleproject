import { Injectable, NotFoundException } from "@nestjs/common";
import {
  createExplainability,
  isAthenaExplainabilityComplete,
  type AthenaRecommendationDraft,
  type CompanyContext,
  type DiscoverySnapshot,
} from "@grayscale/platform";
import { ContextRuntimeService } from "../context-runtime/context-runtime.service";
import { ExecutiveRuntimeService } from "../executive/executive-runtime.service";
import { ExecutiveCuriosityService } from "../executive-curiosity/executive-curiosity.service";
import { ExecutiveNotebookService } from "../executive-notebook/executive-notebook.service";
import { ExecutiveSkepticService } from "../executive-skeptic/executive-skeptic.service";
import { DiscoveryEngineService } from "./discovery-engine.service";

const ATHENA_ID = "athena";

@Injectable()
export class AthenaService {
  constructor(
    private readonly contextRuntime: ContextRuntimeService,
    private readonly runtime: ExecutiveRuntimeService,
    private readonly discovery: DiscoveryEngineService,
    private readonly curiosity: ExecutiveCuriosityService,
    private readonly notebook: ExecutiveNotebookService,
    private readonly skeptic: ExecutiveSkepticService,
  ) {}

  async runDiscovery(companyId: string, instanceId: string): Promise<DiscoverySnapshot> {
    const ctx = await this.ensureContext(companyId, instanceId);
    await this.runtime.transition(instanceId, "discovering", "Athena discovery pipeline started");
    const snapshot = await this.discovery.runPipelineFromContext(ATHENA_ID, ctx);
    await this.runtime.transition(instanceId, "idle", "Athena discovery pipeline completed");
    await this.generateCuriosityFromContext(companyId, ctx);
    return snapshot;
  }

  async draftRecommendations(
    companyId: string,
    instanceId: string,
  ): Promise<AthenaRecommendationDraft[]> {
    const ctx = await this.ensureContext(companyId, instanceId);
    const eligibility = await this.discovery.checkEligibility(ATHENA_ID, companyId);
    if (!eligibility.eligible) {
      throw new Error(`Discovery incomplete: ${eligibility.reason}`);
    }

    const drafts: AthenaRecommendationDraft[] = [];
    const correlationId = ctx.correlationId;

    if (ctx.missionStatus.criticalRisks > 0) {
      drafts.push(
        await this.buildDraft(ctx, instanceId, {
          title: "Address critical strategic risks",
          summary: `${ctx.missionStatus.criticalRisks} critical risk(s) require founder review before proceeding with new initiatives.`,
          assumptions: ["Current risk assessments are accurate", "Risk severity labels are up to date"],
          primaryReason: "Critical risks detected in strategic intelligence context",
        }),
      );
    }

    if (ctx.missionStatus.blockedObjectives > 0) {
      drafts.push(
        await this.buildDraft(ctx, instanceId, {
          title: "Unblock strategic objectives",
          summary: `${ctx.missionStatus.blockedObjectives} objective(s) are blocked. Resolve dependencies before allocating new resources.`,
          assumptions: ["Blocked status reflects current operational reality"],
          primaryReason: "Blocked objectives reduce execution momentum",
        }),
      );
    }

    if (ctx.missionStatus.openRecommendations === 0 && ctx.goals.length > 0) {
      drafts.push(
        await this.buildDraft(ctx, instanceId, {
          title: "Align active goals with measurable next actions",
          summary: `${ctx.missionStatus.activeGoals} active goal(s) have no open recommendations. Define concrete next steps.`,
          assumptions: ["Goals in context reflect current founder priorities"],
          primaryReason: "Goals without recommendations lack execution path",
        }),
      );
    }

    if (drafts.length === 0) {
      drafts.push(
        await this.buildDraft(ctx, instanceId, {
          title: "Continue discovery and monitoring",
          summary: "No immediate high-priority recommendations. Maintain observation and enrich organizational context.",
          assumptions: ["CompanyContext reflects current state"],
          primaryReason: "Insufficient signals for high-confidence action recommendation",
        }),
      );
    }

    for (const draft of drafts) {
      if (!isAthenaExplainabilityComplete(draft.explainability)) {
        throw new Error("Incomplete explainability — certification failure");
      }
      await this.runtime.recordOutput({
        companyId,
        executiveId: ATHENA_ID,
        instanceId,
        outputType: "recommendation_draft",
        title: draft.title,
        summary: draft.summary,
        explainability: draft.explainability,
        payload: draft.payload,
        correlationId,
      });
    }

    return drafts;
  }

  private async ensureContext(companyId: string, instanceId: string): Promise<CompanyContext> {
    const instance = await this.runtime.getInstance(companyId, ATHENA_ID);
    if (!instance) throw new NotFoundException("Athena instance not initialized");
    return this.contextRuntime.assemble(companyId, { bypassCache: true });
  }

  private async generateCuriosityFromContext(companyId: string, ctx: CompanyContext): Promise<void> {
    if (ctx.memory.length === 0) {
      await this.curiosity.ask({
        companyId,
        executiveId: ATHENA_ID,
        questionType: "what_is_missing",
        question: "What foundational company memories are missing for reliable recommendations?",
        context: "Zero memory records in CompanyContext",
      });
    }
    if (ctx.intent?.coverage.coveragePercent === 0) {
      await this.curiosity.ask({
        companyId,
        executiveId: ATHENA_ID,
        questionType: "why",
        question: "Why are strategic objects not yet linked to organizational intent?",
        context: "Intent coverage at 0%",
      });
    }
  }

  private async buildDraft(
    ctx: CompanyContext,
    instanceId: string,
    input: {
      title: string;
      summary: string;
      assumptions: string[];
      primaryReason: string;
    },
  ): Promise<AthenaRecommendationDraft> {
    const memoryRefs = ctx.memory.slice(0, 5).map((m) => ({
      id: m.id,
      summary: m.summary ?? m.title,
    }));
    const eventRefs = ctx.recentEvents.slice(0, 5).map((e) => ({
      id: e.id,
      type: e.type,
      summary: e.type,
    }));
    const graphRefs = ctx.graph.hubNodes.slice(0, 3).map((n) => ({
      nodeId: n.nodeId,
      relationship: "influences",
      summary: n.displayName,
    }));

    const notebookEntries = await this.notebook.search(ctx.companyId, ATHENA_ID, { limit: 5 });
    const investigations = await this.curiosity.listInvestigations(ctx.companyId, ATHENA_ID);

    const baseExplainability = createExplainability({
      reason: input.primaryReason,
      evidence: { memoryRefs, eventRefs, graphRefs },
      confidence: 0.65,
      confidenceSources: [{ type: "graph_evidence", summary: "Graph summary consulted", weight: 0.3 }],
      policyUsed: ctx.strategy.policies?.map((p) => p.name) ?? [],
      constraintsUsed: ctx.strategy.constraints?.map((c) => c.type) ?? [],
      decisionPath: [
        "CompanyContext assembled",
        "Discovery pipeline completed",
        "Strategic signals evaluated",
        "Skeptic pass applied",
      ],
      alternatives: [
        {
          title: "Defer action",
          summary: "Wait for additional evidence",
          tradeoffs: "Reduces risk of premature action but delays progress",
        },
      ],
    });

    const skeptic = await this.skeptic.runPass({
      companyId: ctx.companyId,
      executiveId: ATHENA_ID,
      recommendationTitle: input.title,
      recommendationSummary: input.summary,
      assumptions: input.assumptions,
      evidenceIds: memoryRefs.map((m) => m.id),
      confidence: baseExplainability.confidence,
      policyIds: ctx.strategy.policies?.map((p) => p.id),
      constraintIds: ctx.strategy.constraints?.map((c) => c.id),
    });

    const snapshot = await this.discovery.getSnapshot(ATHENA_ID, ctx.companyId);

    const explainability = {
      ...baseExplainability,
      whyAthenaThinksThis: input.primaryReason,
      organizationalDnaFactors: ctx.organizationalIntelligence?.organizationalDna?.coreValues ?? [],
      emotionalIndicators: ctx.organizationalIntelligence?.emotional?.metrics.map((m) => m.metric) ?? [],
      founderPreferenceFactors: ctx.identity
        ? [ctx.identity.communicationStyle, ctx.identity.decisionStyle]
        : [],
      signalIds: ctx.signals?.activeSignals.map((s) => s.id) ?? [],
      insightIds: ctx.insights?.insights.map((i) => i.id) ?? [],
      notebookEntryIds: notebookEntries.map((n) => n.id),
      curiosityInvestigationIds: investigations.map((i) => i.id),
      supportingEvidence: memoryRefs.map((m) => ({ id: m.id, summary: m.summary, source: "memory" })),
      contradictingEvidence: [],
      skepticChallenges: skeptic.challenges.map((c) => ({
        type: c.type,
        summary: c.summary,
        severity: c.severity,
      })),
      whatCouldMakeThisWrong: skeptic.whatCouldMakeThisWrong,
      rollbackPlan: "Revert to prior strategic plan; re-run discovery pipeline after new evidence is recorded.",
      discoveryStagesCompleted: snapshot?.stages.filter((s) => s.status === "completed").map((s) => s.stage) ?? [],
      confidence: skeptic.adjustedConfidence,
    };

    await this.notebook.record({
      companyId: ctx.companyId,
      executiveId: ATHENA_ID,
      entryType: "observation",
      title: `Draft: ${input.title}`,
      content: input.summary,
      correlationId: ctx.correlationId,
      links: { memoryIds: memoryRefs.map((m) => m.id) },
    });

    return {
      title: input.title,
      summary: input.summary,
      explainability,
      payload: {
        instanceId,
        skepticPassed: skeptic.passed,
        assumptions: input.assumptions,
      },
    };
  }
}
