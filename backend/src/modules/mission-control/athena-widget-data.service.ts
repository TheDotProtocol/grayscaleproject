import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createFounderConstitutionContext } from "@grayscale/platform";
import { isExecutivesEnabled } from "@grayscale/shared";
import { ContextRuntimeService } from "../context-runtime/context-runtime.service";
import { DiscoveryEngineService } from "../athena/discovery-engine.service";
import { ExecutiveCuriosityService } from "../executive-curiosity/executive-curiosity.service";
import { ExecutiveNotebookService } from "../executive-notebook/executive-notebook.service";
import { ExecutiveSkepticService } from "../executive-skeptic/executive-skeptic.service";
import { ExecutiveRuntimeService } from "../executive/executive-runtime.service";
import { ExecutiveComplianceService } from "../executive-compliance/executive-compliance.service";
import { AthenaService } from "../athena/athena.service";

const ATHENA_ID = "athena";

@Injectable()
export class AthenaWidgetDataService {
  constructor(
    private readonly athena: AthenaService,
    private readonly contextRuntime: ContextRuntimeService,
    private readonly discovery: DiscoveryEngineService,
    private readonly notebook: ExecutiveNotebookService,
    private readonly curiosity: ExecutiveCuriosityService,
    private readonly skeptic: ExecutiveSkepticService,
    private readonly runtime: ExecutiveRuntimeService,
    private readonly compliance: ExecutiveComplianceService,
    private readonly config: ConfigService,
  ) {}

  async getStatus(companyId: string) {
    const instance = await this.runtime.getInstance(companyId, ATHENA_ID);
    const snapshot = await this.discovery.getSnapshot(ATHENA_ID, companyId);
    return {
      executiveId: ATHENA_ID,
      role: "Chief Executive Strategist",
      canonicalIdentity: ATHENA_ID,
      instanceId: instance?.id ?? null,
      lifecycleState: instance?.lifecycleState ?? "uninitialized",
      executivesEnabled: isExecutivesEnabled(this.config.get("EXECUTIVES_ENABLED")),
      discoveryStatus: snapshot?.status ?? "not_started",
      eligibleForRecommendation: snapshot?.eligibleForRecommendation ?? false,
      certification: "Sprint-2",
    };
  }

  async getDiscoveryProgress(companyId: string) {
    const snapshot = await this.discovery.getSnapshot(ATHENA_ID, companyId);
    if (!snapshot) return { status: "not_started", stages: [] };
    return {
      status: snapshot.status,
      currentStage: snapshot.currentStage,
      stages: snapshot.stages,
      overallConfidence: snapshot.overallConfidence,
      eligibleForRecommendation: snapshot.eligibleForRecommendation,
    };
  }

  async getCertificationProgress(companyId: string) {
    const report = await this.compliance.runCertification(companyId, ATHENA_ID);
    return {
      score: report.score,
      passed: report.passed,
      verdict: report.verdict,
      criticalFailures: report.criticalFailures,
      categories: [...new Set(report.checks.map((c) => c.category))].map((cat) => ({
        category: cat,
        passed: report.checks.filter((c) => c.category === cat && c.passed).length,
        total: report.checks.filter((c) => c.category === cat).length,
      })),
    };
  }

  async getNotebookActivity(companyId: string) {
    const entries = await this.notebook.search(companyId, ATHENA_ID, { limit: 20 });
    return { count: entries.length, recent: entries.slice(0, 10) };
  }

  async getCuriosityInvestigations(companyId: string) {
    const [questions, investigations] = await Promise.all([
      this.curiosity.listOpenQuestions(companyId, ATHENA_ID),
      this.curiosity.listInvestigations(companyId, ATHENA_ID),
    ]);
    return { openQuestions: questions, investigations };
  }

  async getSkepticChallenges(companyId: string) {
    const ctx = await this.contextRuntime.assemble(companyId);
    const result = await this.skeptic.runPass({
      companyId,
      executiveId: ATHENA_ID,
      recommendationTitle: "Health probe",
      recommendationSummary: "Mission Control skeptic health check",
      assumptions: ["Context reflects current state"],
      evidenceIds: ctx.memory.slice(0, 1).map((m) => m.id),
      confidence: 0.5,
    });
    return {
      passed: result.passed,
      challenges: result.challenges,
      mandatoryQuestions: result.mandatoryQuestions,
    };
  }

  async getExecutiveHealth(companyId: string) {
    const [status, cert] = await Promise.all([
      this.getStatus(companyId),
      this.getCertificationProgress(companyId),
    ]);
    return {
      healthy: cert.passed && !status.executivesEnabled,
      status,
      certificationScore: cert.score,
    };
  }

  async getConstitutionCompliance(companyId: string) {
    const ctx = await this.contextRuntime.assemble(companyId);
    const constitution = ctx.founderConstitution ?? createFounderConstitutionContext();
    return {
      version: constitution.version,
      principles: constitution.principles,
      founderFinalAuthority: constitution.founderFinalAuthority,
      compliant: Boolean(ctx.founderConstitution),
    };
  }

  async getAutomationReadiness(companyId: string) {
    const ctx = await this.contextRuntime.assemble(companyId);
    return {
      executivesEnabled: isExecutivesEnabled(this.config.get("EXECUTIVES_ENABLED")),
      policyCount: ctx.strategy.policies?.length ?? 0,
      constraintCount: ctx.strategy.constraints?.length ?? 0,
      ready: false,
      reason: "EXECUTIVES_ENABLED=false — Athena certified but dormant",
    };
  }

  async getFounderOverrides(companyId: string) {
    const ctx = await this.contextRuntime.assemble(companyId);
    return {
      overrides: ctx.organizationalIntelligence?.recentLearnings ?? [],
      note: "Founder overrides become organizational learning per Founder Constitution",
    };
  }

  async getRecommendationLifecycle(companyId: string) {
    const instance = await this.runtime.getInstance(companyId, ATHENA_ID);
    if (!instance) return { outputs: [] };
    return { instanceId: instance.id, lifecycleState: instance.lifecycleState };
  }

  async getExplainability(companyId: string) {
    const ctx = await this.contextRuntime.assemble(companyId);
    return {
      events: ctx.recentEvents.slice(0, 5),
      memory: ctx.memory.slice(0, 5),
      graph: ctx.graph,
      signals: ctx.signals,
      insights: ctx.insights,
      organizationalDna: ctx.organizationalIntelligence?.organizationalDna,
      founderDna: ctx.organizationalIntelligence?.founderDna,
      emotion: ctx.organizationalIntelligence?.emotional,
      culture: ctx.organizationalIntelligence?.culture,
      wisdom: ctx.organizationalIntelligence?.approvedWisdom,
      learning: ctx.organizationalIntelligence?.recentLearnings,
      trust: ctx.organizationalIntelligence?.reputation,
      identity: ctx.identity,
      intent: ctx.intent,
      policies: ctx.strategy.policies,
      constraints: ctx.strategy.constraints,
      constitution: ctx.founderConstitution,
      pipeline: await this.athena.getPipelineTrace(companyId),
    };
  }

  async getTrustScore(companyId: string) {
    const cert = await this.getCertificationProgress(companyId);
    return {
      trustScore: cert.score / 100,
      certificationScore: cert.score,
      passed: cert.passed,
    };
  }
}
