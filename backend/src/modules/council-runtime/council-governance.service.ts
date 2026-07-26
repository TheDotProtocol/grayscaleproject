import { Injectable } from "@nestjs/common";
import type {
  CouncilAudit,
  CouncilEscalation,
  CouncilGovernance,
  CouncilHealth,
  CouncilMetrics,
  CouncilOverride,
  CouncilTrust,
} from "@grayscale/platform";
import { CouncilStoreService } from "./council-store.service";
import { EventsService } from "../events/events.service";

@Injectable()
export class CouncilGovernanceService {
  constructor(
    private readonly store: CouncilStoreService,
    private readonly events: EventsService,
  ) {}

  getGovernance(companyId: string): CouncilGovernance {
    return this.store.defaultGovernance(companyId);
  }

  async escalate(input: Omit<CouncilEscalation, "id" | "escalatedAt">): Promise<CouncilEscalation> {
    const escalation: CouncilEscalation = {
      id: this.store.newId("escalation"),
      ...input,
      escalatedAt: new Date().toISOString(),
    };
    this.store.escalations.set(escalation.id, escalation);
    await this.events.publish("council.founder.escalated", input.companyId, {
      escalationId: escalation.id,
      reason: input.reason,
    }, { correlationId: input.correlationId, source: "council-governance" });
    return escalation;
  }

  async recordOverride(input: Omit<CouncilOverride, "id" | "overriddenAt">): Promise<CouncilOverride> {
    const override: CouncilOverride = {
      id: this.store.newId("override"),
      ...input,
      becomesLearning: true,
      overriddenAt: new Date().toISOString(),
    };
    this.store.overrides.set(override.id, override);
    await this.events.publish("council.founder.override", input.companyId, {
      overrideId: override.id,
      type: input.overrideType,
    }, { correlationId: input.correlationId, source: "council-governance" });
    return override;
  }

  getHealth(companyId: string): CouncilHealth {
    const sessions = [...this.store.sessions.values()].filter((s) => s.companyId === companyId);
    const issues = [...this.store.issues.values()].filter((i) => i.companyId === companyId);
    const escalated = issues.filter((i) => i.status === "escalated").length;
    const consensusScores = [...this.store.consensus.values()]
      .filter((c) => c.companyId === companyId)
      .map((c) => c.score);
    const avg = consensusScores.length ? consensusScores.reduce((a, b) => a + b, 0) / consensusScores.length : 0;

    return {
      companyId,
      activeSessions: sessions.filter((s) => s.status === "active").length,
      openIssues: issues.filter((i) => ["open", "deliberating", "evidence_gathering"].includes(i.status)).length,
      escalatedIssues: escalated,
      averageConsensusScore: avg,
      complianceFailures: 0,
      assessedAt: new Date().toISOString(),
    };
  }

  getMetrics(companyId: string, period: { from: string; to: string }): CouncilMetrics {
    const sessions = [...this.store.sessions.values()].filter((s) => s.companyId === companyId);
    const consensus = [...this.store.consensus.values()].filter((c) => c.companyId === companyId);
    const minorities = [...this.store.minorityOpinions.values()].filter((m) => m.companyId === companyId);
    const overrides = [...this.store.overrides.values()].filter((o) => o.companyId === companyId);

    return {
      companyId,
      periodStart: period.from,
      periodEnd: period.to,
      sessionsHeld: sessions.length,
      issuesResolved: [...this.store.issues.values()].filter((i) => i.companyId === companyId && i.status === "resolved").length,
      strongConsensusRate: consensus.length ? consensus.filter((c) => c.level === "strong").length / consensus.length : 0,
      minorityOpinionRate: minorities.length / Math.max(1, consensus.length),
      founderOverrideRate: overrides.length / Math.max(1, sessions.length),
      averageDeliberationRounds: 1,
    };
  }

  getTrustScores(companyId: string): CouncilTrust[] {
    return this.store.defaultMembers(companyId).map((m) => ({
      companyId,
      executiveId: m.executiveId,
      trustScore: m.trustScore ?? 0.7,
      evidenceQualityScore: 0.7,
      participationScore: 0.8,
      dissentQualityScore: 0.75,
      calculatedAt: new Date().toISOString(),
      correlationId: m.correlationId,
    }));
  }

  getAudit(companyId: string, sessionId?: string): CouncilAudit {
    const entries = [...this.store.auditEntries.values()].filter(
      (e) => e.companyId === companyId && (!sessionId || e.sessionId === sessionId),
    );
    return {
      companyId,
      sessionId,
      entries,
      overallCompliant: entries.every((e) => e.passed),
      generatedAt: new Date().toISOString(),
    };
  }
}
