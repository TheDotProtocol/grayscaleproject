import { Injectable } from "@nestjs/common";
import type { OrganizationalAlignment } from "@grayscale/platform";
import { ALIGNMENT_ENGINE_VERSION } from "@grayscale/platform";
import { IntentEngineService } from "./intent-engine.service";
import { AttentionEngineService } from "./attention-engine.service";
import { StrategyEngineService } from "../intelligence/strategy-engine.service";
import { alignmentScore } from "./organizational-reasoning.util";

function intentThemes(intentCtx: Awaited<ReturnType<IntentEngineService["getContext"]>>): string[] {
  return intentCtx.rootIntents.map((n) => n.intent.title);
}

/** Alignment Engine — explainable alignment scores (deterministic) */
@Injectable()
export class AlignmentEngineService {
  constructor(
    private readonly intent: IntentEngineService,
    private readonly attention: AttentionEngineService,
    private readonly strategy: StrategyEngineService,
  ) {}

  async assess(companyId: string): Promise<OrganizationalAlignment> {
    const [intentCtx, attn, strategyCtx] = await Promise.all([
      this.intent.getContext(companyId),
      this.attention.assemble(companyId),
      this.strategy.buildContext(companyId),
    ]);

    const themes = intentThemes(intentCtx);
    const drift = attn.drift?.driftScore ?? 0;
    const goalCount = strategyCtx.goals.length;
    const objectiveCount = strategyCtx.objectives.length;
    const projectFocus = attn.strategicFocus.themes.length;

    const visionMission = alignmentScore(0.85, "Intent themes present", themes, []);
    const missionStrategy = alignmentScore(goalCount > 0 ? 0.8 : 0.5, "Goals mapped to mission", [`goals:${goalCount}`], goalCount === 0 ? ["no_goals"] : []);
    const strategyObjectives = alignmentScore(objectiveCount > 0 && goalCount > 0 ? 0.75 : 0.45, "Objectives under goals", [`objectives:${objectiveCount}`], objectiveCount === 0 ? ["no_objectives"] : []);
    const objectivesProjects = alignmentScore(projectFocus > 0 ? 0.7 : 0.4, "Project attention allocation", [`projects:${projectFocus}`], projectFocus === 0 ? ["no_project_focus"] : []);
    const projectsExecution = alignmentScore(1 - drift, "Execution matches declared focus", attn.drift?.declaredFocus ?? [], attn.drift?.actualFocus ?? []);
    const executionResults = alignmentScore(0.65, "Results tracking via pulse/mission", [`pulse_health:${attn.insights.driftWarnings.length}`], []);
    const founderOrganization = alignmentScore(1 - attn.saturation.level, "Founder bandwidth vs org load", [`saturation:${attn.saturation.level}`], attn.saturation.level > 0.7 ? ["founder_overload"] : []);
    const executivesFounder = alignmentScore(attn.executiveAttention.length > 0 ? 0.7 : 0.5, "Executive attention distribution", attn.executiveAttention.map((e) => e.executiveId), []);
    const cultureDecisions = alignmentScore(1 - attn.decisionCongestion.congestionScore, "Decision culture health", [`congestion:${attn.decisionCongestion.congestionScore}`], []);
    const identityExecution = alignmentScore(0.72, "Identity-intent coherence", themes, []);
    const intentOutcomes = alignmentScore(1 - drift * 0.5, "Intent-outcome chain integrity", themes, drift > 0.3 ? ["intent_drift"] : []);

    const scores = [visionMission, missionStrategy, strategyObjectives, objectivesProjects, projectsExecution, executionResults, founderOrganization, executivesFounder, cultureDecisions, identityExecution, intentOutcomes];

    return {
      companyId,
      assembledAt: new Date().toISOString(),
      version: ALIGNMENT_ENGINE_VERSION,
      visionMission,
      missionStrategy,
      strategyObjectives,
      objectivesProjects,
      projectsExecution,
      executionResults,
      founderOrganization,
      executivesFounder,
      cultureDecisions,
      identityExecution,
      intentOutcomes,
      overallAlignment: scores.reduce((s, x) => s + x.score, 0) / scores.length,
    };
  }
}
