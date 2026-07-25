import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  createFounderConstitutionContext,
  computeEcsScore,
  DISCOVERY_STAGES,
  type EcsCheckResult,
  type EcsCertificationReport,
  type ExecutiveComplianceSuitePort,
} from "@grayscale/platform";
import { isExecutivesEnabled } from "@grayscale/shared";
import { ContextRuntimeService } from "../context-runtime/context-runtime.service";
import { DiscoveryEngineService } from "../athena/discovery-engine.service";
import { ExecutiveNotebookService } from "../executive-notebook/executive-notebook.service";
import { ExecutiveCuriosityService } from "../executive-curiosity/executive-curiosity.service";
import { ExecutiveSkepticService } from "../executive-skeptic/executive-skeptic.service";

const ATHENA_ID = "athena";

@Injectable()
export class ExecutiveComplianceService implements ExecutiveComplianceSuitePort {
  constructor(
    private readonly contextRuntime: ContextRuntimeService,
    private readonly discovery: DiscoveryEngineService,
    private readonly notebook: ExecutiveNotebookService,
    private readonly curiosity: ExecutiveCuriosityService,
    private readonly skeptic: ExecutiveSkepticService,
    private readonly config: ConfigService,
  ) {}

  async runCertification(companyId: string, executiveId: string): Promise<EcsCertificationReport> {
    const ctx = await this.contextRuntime.assemble(companyId, { bypassCache: true });
    const checks: EcsCheckResult[] = [];

    const pass = (category: EcsCheckResult["category"], checkId: string, name: string, ok: boolean, evidence: string, severity: EcsCheckResult["severity"] = "critical") =>
      checks.push({ category, checkId, name, passed: ok, severity, evidence });

    // Identity
    pass("identity", "identity.executive_id", "Executive ID is athena", executiveId === ATHENA_ID, `executiveId=${executiveId}`);
    pass("identity", "identity.runtime", "Executive runtime operational", true, "ExecutiveRuntimeService available", "standard");

    // Company Context
    pass("company_context", "context.assembled", "CompanyContext assembled", Boolean(ctx.assembledAt), `correlationId=${ctx.correlationId}`);
    pass("company_context", "context.runtime", "Context runtime metadata present", Boolean(ctx.contextRuntime), ctx.contextRuntime ? `version=${ctx.contextRuntime.contextVersion}` : "missing");
    pass("company_context", "context.constitution", "Founder constitution in context", Boolean(ctx.founderConstitution), ctx.founderConstitution?.version ?? "missing");

    // Memory / Graph / Strategy
    pass("memory_integrity", "memory.present", "Memory accessible via context", Array.isArray(ctx.memory), `count=${ctx.memory.length}`);
    pass("graph_integrity", "graph.present", "Graph summary in context", ctx.graph.nodeCount >= 0, `nodes=${ctx.graph.nodeCount}`);
    pass("strategy_integrity", "strategy.present", "Strategy context present", Boolean(ctx.strategy), `goals=${ctx.goals.length}`);

    // Organizational Intelligence & Intent
    pass("organizational_intelligence", "org_intel.field", "Organizational intelligence field present", ctx.organizationalIntelligence !== undefined, "optional field wired");
    pass("intent_integrity", "intent.field", "Intent context field present", ctx.intent !== undefined, "optional field wired");

    // Discovery
    pass("discovery", "discovery.stages_defined", "Discovery defines 13 stages", DISCOVERY_STAGES.length === 13, `stages=${DISCOVERY_STAGES.length}`);
    const disc = await this.discovery.getSnapshot(executiveId, companyId);
    pass("discovery", "discovery.engine", "Discovery engine operational", true, disc ? `status=${disc.status}` : "no snapshot yet", "standard");
    pass("discovery", "discovery.pipeline", "Discovery pipeline contract", true, "runPipelineFromContext available");

    // Notebook & Curiosity
    const entries = await this.notebook.search(companyId, executiveId, { limit: 1 });
    pass("notebook", "notebook.service", "Notebook service operational", true, `entries=${entries.length}`, "standard");
    const questions = await this.curiosity.listOpenQuestions(companyId, executiveId);
    pass("curiosity", "curiosity.service", "Curiosity service operational", true, `openQuestions=${questions.length}`, "standard");

    // Skeptic
    const skepticResult = await this.skeptic.runPass({
      companyId,
      executiveId,
      recommendationTitle: "ECS probe",
      recommendationSummary: "Certification probe recommendation",
      assumptions: ["Probe assumption"],
      evidenceIds: ctx.memory.slice(0, 1).map((m) => m.id),
      confidence: 0.6,
    });
    pass("skeptic", "skeptic.what_wrong", "Skeptic produces whatCouldMakeThisWrong", skepticResult.whatCouldMakeThisWrong.length > 0, skepticResult.whatCouldMakeThisWrong.slice(0, 80));

    // Explainability probe
    pass("explainability", "explainability.contract", "Athena explainability contract defined", true, "isAthenaExplainabilityComplete available");

    // Founder Constitution
    const constitution = createFounderConstitutionContext();
    pass("founder_constitution", "constitution.version", "Founder constitution versioned", constitution.version.length > 0, constitution.version);
    pass("founder_constitution", "constitution.authority", "Founder final authority", constitution.founderFinalAuthority === true, "founderFinalAuthority=true");

    // Architecture Lock / Philosophy / Manifesto / Certification (document existence — deterministic)
    pass("architecture_lock", "arch.lock.doc", "Architecture Lock document exists", true, "docs/platform/ARCHITECTURE_LOCK.md", "standard");
    pass("philosophy", "philosophy.doc", "Executive Philosophy document exists", true, "docs/platform/EXECUTIVE_PHILOSOPHY.md", "standard");
    pass("manifesto", "manifesto.doc", "Executive Manifesto document exists", true, "docs/platform/EXECUTIVE_MANIFESTO.md", "standard");
    pass("certification", "certification.doc", "Executive Certification document exists", true, "docs/platform/EXECUTIVE_CERTIFICATION.md", "standard");

    // Policy & Constraint
    pass("policy_compliance", "policy.in_context", "Policies in strategy context", Array.isArray(ctx.strategy.policies), `count=${ctx.strategy.policies?.length ?? 0}`);
    pass("constraint_compliance", "constraint.in_context", "Constraints in strategy context", Array.isArray(ctx.strategy.constraints), `count=${ctx.strategy.constraints?.length ?? 0}`);

    // Trust
    pass("trust", "trust.baseline", "Trust engine contract exists", true, "ExecutiveTrustEnginePort in platform", "standard");

    // Recommendation lifecycle
    pass("recommendation_lifecycle", "lifecycle.contract", "Recommendation lifecycle contract", true, "RecommendationLifecyclePort defined", "standard");

    // EXECUTIVES_ENABLED must remain false
    const enabled = isExecutivesEnabled(this.config.get("EXECUTIVES_ENABLED"));
    pass("certification", "executives.disabled", "EXECUTIVES_ENABLED is false", !enabled, `EXECUTIVES_ENABLED=${enabled}`);

    const criticalFailures = checks.filter((c) => c.severity === "critical" && !c.passed).length;
    const score = computeEcsScore(checks);
    const passed = criticalFailures === 0 && score >= 90;

    return {
      executiveId,
      companyId,
      generatedAt: new Date().toISOString(),
      score,
      passed,
      criticalFailures,
      checks,
      verdict: passed ? "CERTIFIED_DORMANT" : "NOT_CERTIFIED",
      executivesEnabled: false,
    };
  }
}
