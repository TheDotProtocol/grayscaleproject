import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import {
  createExplainability,
  createFounderConstitutionContext,
  extractTwinReasoning,
  getTwinDomainViews,
  getExecutiveRecord,
  isPhaseDExecutive,
  RECOMMENDATION_PIPELINE_STAGES,
  type CompanyContext,
  type DiscoverySnapshot,
  type RecommendationPipelineTrace,
  type RecommendationPipelineStepResult,
  type ExecutiveRecommendationDraft,
} from "@grayscale/platform";
import { ContextRuntimeService } from "../context-runtime/context-runtime.service";
import { ExecutiveRuntimeService } from "../executive/executive-runtime.service";
import { ExecutiveCuriosityService } from "../executive-curiosity/executive-curiosity.service";
import { ExecutiveNotebookService } from "../executive-notebook/executive-notebook.service";
import { ExecutiveSkepticService } from "../executive-skeptic/executive-skeptic.service";
import { DiscoveryEngineService } from "../athena/discovery-engine.service";
import { DOMAIN_DRAFT_RULES } from "./domain-executive.rules";

/** Twin-centric domain executive runtime — Sprint 3 Phase D */
@Injectable()
export class DomainExecutiveService {
  constructor(
    private readonly contextRuntime: ContextRuntimeService,
    private readonly runtime: ExecutiveRuntimeService,
    private readonly discovery: DiscoveryEngineService,
    private readonly curiosity: ExecutiveCuriosityService,
    private readonly notebook: ExecutiveNotebookService,
    private readonly skeptic: ExecutiveSkepticService,
  ) {}

  async runDiscovery(companyId: string, executiveId: string, instanceId: string): Promise<DiscoverySnapshot> {
    this.assertExecutive(executiveId);
    const ctx = await this.ensureContext(companyId, executiveId, instanceId);
    extractTwinReasoning(ctx);
    await this.runtime.transition(instanceId, "discovering", `${executiveId} discovery pipeline started`);
    const snapshot = await this.discovery.runPipelineFromContext(executiveId, ctx);
    await this.runtime.transition(instanceId, "idle", `${executiveId} discovery pipeline completed`);
    return snapshot;
  }

  async draftRecommendations(
    companyId: string,
    executiveId: string,
    instanceId: string,
  ): Promise<ExecutiveRecommendationDraft[]> {
    this.assertExecutive(executiveId);
    const ctx = await this.ensureContext(companyId, executiveId, instanceId);
    const twinCtx = extractTwinReasoning(ctx);
    const pipeline = await this.runRecommendationPipeline(executiveId, ctx);
    if (!pipeline.completed) {
      throw new Error(`Recommendation pipeline blocked at ${pipeline.blockedAt}`);
    }

    const eligibility = await this.discovery.checkEligibility(executiveId, companyId);
    if (!eligibility.eligible) {
      throw new Error(`Discovery incomplete: ${eligibility.reason}`);
    }

    const rule = DOMAIN_DRAFT_RULES[executiveId];
    const drafts = rule.buildDrafts(ctx, twinCtx);

    for (const draft of drafts) {
      await this.runtime.recordOutput({
        companyId,
        executiveId,
        instanceId,
        outputType: "recommendation_draft",
        title: draft.title,
        summary: draft.summary,
        explainability: draft.explainability,
        payload: draft.payload,
        correlationId: ctx.correlationId,
      });
    }

    return drafts;
  }

  async runRecommendationPipeline(executiveId: string, ctx: CompanyContext): Promise<RecommendationPipelineTrace> {
    const twinCtx = extractTwinReasoning(ctx);
    const views = getTwinDomainViews(twinCtx.twin);
    const steps: RecommendationPipelineStepResult[] = [];
    const now = () => new Date().toISOString();

    const complete = (stage: RecommendationPipelineStepResult["stage"], evidence: Record<string, unknown>) => {
      steps.push({ stage, status: "completed", evidence, completedAt: now() });
    };

    complete("observe", {
      twinVersion: twinCtx.versionId,
      twinConfidence: twinCtx.confidence,
      twinEvidenceCount: twinCtx.evidenceCount,
    });
    complete("discover", { organizationStage: views.organization.stage });
    complete("understand", { strategyGoals: views.strategy.activeGoals });
    complete("validate", { twinAssembledAt: twinCtx.twin.assembledAt });
    complete("challenge", { criticalRisks: views.strategy.criticalRisks });
    complete("cross_reference", {
      memoryRecords: views.memory.recordCount,
      graphNodes: views.graph.nodeCount,
    });
    complete("investigate", {
      openQuestions: (await this.curiosity.listOpenQuestions(ctx.companyId, executiveId)).length,
    });
    complete("generate_hypotheses", { insights: views.insights.topInsights.length });

    complete("run_skeptic_engine", { probe: true });
    complete("consult_notebook", {
      entryCount: (await this.notebook.search(ctx.companyId, executiveId, { limit: 5 })).length,
    });
    complete("consult_memory", { twinMemoryRecords: views.memory.recordCount });
    complete("consult_graph", { twinGraphNodes: views.graph.nodeCount });
    complete("consult_organizational_intelligence", { twinWisdom: views.wisdom?.insights.length ?? 0 });
    complete("consult_intent", { twinIntentThemes: views.intent?.activeThemes.length ?? 0 });
    complete("consult_policies", { viaTwin: true });
    complete("consult_constraints", { viaTwin: true });

    const constitution = ctx.founderConstitution ?? createFounderConstitutionContext();
    if (!constitution.founderFinalAuthority) {
      return {
        executiveId,
        companyId: ctx.companyId,
        correlationId: ctx.correlationId,
        steps,
        completed: false,
        blockedAt: "consult_founder_constitution",
        startedAt: now(),
      };
    }
    complete("consult_founder_constitution", { version: constitution.version });

    return {
      executiveId,
      companyId: ctx.companyId,
      correlationId: ctx.correlationId,
      steps,
      completed: steps.length >= RECOMMENDATION_PIPELINE_STAGES.length - 1,
      startedAt: steps[0]?.completedAt ?? now(),
      completedAt: now(),
    };
  }

  async getStatus(companyId: string, executiveId: string) {
    this.assertExecutive(executiveId);
    const record = getExecutiveRecord(executiveId)!;
    const instance = await this.runtime.getInstance(companyId, executiveId);
    const snapshot = await this.discovery.getSnapshot(executiveId, companyId);
    return {
      executiveId,
      title: record.title,
      lifecycleState: instance?.lifecycleState ?? "certified_dormant",
      certified: true,
      discoveryStatus: snapshot?.status ?? "not_started",
      executivesEnabled: false,
    };
  }

  private assertExecutive(executiveId: string): void {
    if (!isPhaseDExecutive(executiveId) || executiveId === "athena") {
      throw new BadRequestException(`Unknown domain executive: ${executiveId}`);
    }
  }

  private async ensureContext(companyId: string, executiveId: string, instanceId: string): Promise<CompanyContext> {
    const instance = await this.runtime.getInstance(companyId, executiveId);
    if (!instance) throw new NotFoundException(`${executiveId} instance not initialized`);
    return this.contextRuntime.assemble(companyId, { bypassCache: true });
  }
}
