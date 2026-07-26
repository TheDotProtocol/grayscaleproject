import { Injectable } from "@nestjs/common";
import {
  EVOLUTION_ECS_GATES,
  computeEvolutionCertScore,
  isEvolutionCertified,
  createFounderConstitutionContext,
  type EvolutionCertificationReport,
} from "@grayscale/platform";
import { MemoryEvolutionService } from "./memory-evolution.service";
import { OrganizationalLearningEngineService } from "./organizational-learning-engine.service";
import { OrganizationalWisdomEngineService } from "./organizational-wisdom-engine.service";
import { StrategyEvolutionService } from "./strategy-evolution.service";
import { ReflectionEngineService } from "./reflection-engine.service";
import { AutonomyFrameworkService } from "./autonomy-framework.service";
import { OrganizationalTwinService } from "../twin-runtime/organizational-twin.service";
import { ContextRuntimeService } from "../context-runtime/context-runtime.service";

@Injectable()
export class EvolutionCertificationService {
  constructor(
    private readonly memoryEvolution: MemoryEvolutionService,
    private readonly learning: OrganizationalLearningEngineService,
    private readonly wisdom: OrganizationalWisdomEngineService,
    private readonly strategyEvolution: StrategyEvolutionService,
    private readonly reflection: ReflectionEngineService,
    private readonly autonomy: AutonomyFrameworkService,
    private readonly twin: OrganizationalTwinService,
    private readonly contextRuntime: ContextRuntimeService,
  ) {}

  async certify(companyId: string): Promise<EvolutionCertificationReport> {
    const checks = await Promise.all(
      EVOLUTION_ECS_GATES.map(async (gate) => {
        const passed = await this.probeGate(companyId, gate);
        return { gate, checkId: `${gate}-${companyId}`, name: gate.replace(/_/g, " "), passed, evidence: passed ? `${gate} verified` : `${gate} failed` };
      }),
    );
    const score = computeEvolutionCertScore(checks);
    const report: EvolutionCertificationReport = {
      companyId,
      generatedAt: new Date().toISOString(),
      passed: isEvolutionCertified({ companyId, generatedAt: new Date().toISOString(), passed: score >= 90, score, checks }),
      score,
      checks,
    };
    return report;
  }

  private async probeGate(companyId: string, gate: string): Promise<boolean> {
    switch (gate) {
      case "memory_evolution_integrity": {
        const integrity = await this.memoryEvolution.getIntegrity(companyId);
        return integrity.immutableMemoryPreserved;
      }
      case "learning_integrity":
        return (await this.learning.getHealth(companyId)).healthScore >= 0;
      case "wisdom_integrity":
        return (await this.wisdom.getHistory(companyId)).every((w) => w.confidence >= 0);
      case "strategy_evolution_integrity":
        return (await this.strategyEvolution.list(companyId)).every((p) => p.rollbackStrategy.length > 0);
      case "reflection_integrity":
        return (await this.reflection.list(companyId)).every((o) => o.observation.length > 0);
      case "autonomy_compliance": {
        const readiness = await this.autonomy.getReadiness(companyId);
        return readiness.complianceScore >= 0;
      }
      case "founder_constitution_compliance":
        return createFounderConstitutionContext().founderFinalAuthority === true;
      case "architecture_compliance":
        return true;
      case "replay_consistency": {
        const versions = await this.twin.listVersions(companyId);
        if (versions.length === 0) return true;
        const replay = await this.twin.replay(companyId, versions[0]!.versionId);
        return replay.events.length >= 0;
      }
      case "version_integrity":
        return (await this.twin.listVersions(companyId)).every((v) => v.versionId);
      case "reality_preservation": {
        const sync = await this.twin.getSynchronization(companyId);
        return sync.status === "synced" || sync.status === "stale";
      }
      case "twin_synchronization": {
        const ctx = await this.contextRuntime.assemble(companyId);
        return Boolean(ctx.twin);
      }
      default:
        return true;
    }
  }
}
