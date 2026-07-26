import { Injectable } from "@nestjs/common";
import { ExecutiveCouncilRuntimeService } from "../council-runtime/executive-council-runtime.service";
import { CouncilAttentionService } from "../council-runtime/council-history.service";
import { CouncilSessionService } from "../council-runtime/council-session.service";
import { CouncilCertificationService } from "../council-runtime/council-certification.service";
import { CouncilDecisionClassifierService } from "../council-runtime/council-decision-classifier.service";
import { CouncilStoreService } from "../council-runtime/council-store.service";

@Injectable()
export class CouncilWidgetDataService {
  constructor(
    private readonly runtime: ExecutiveCouncilRuntimeService,
    private readonly sessions: CouncilSessionService,
    private readonly attention: CouncilAttentionService,
    private readonly certification: CouncilCertificationService,
    private readonly classifier: CouncilDecisionClassifierService,
    private readonly store: CouncilStoreService,
  ) {}

  getCouncilFeed(companyId: string) {
    return this.sessions.listSessions(companyId);
  }

  getSessions(companyId: string) {
    return this.sessions.listSessions(companyId);
  }

  getDeliberations(companyId: string) {
    return [...this.store.deliberations.values()].filter((d) => d.companyId === companyId);
  }

  async getConsensus(companyId: string) {
    const consensus = [...this.store.consensus.values()].filter((c) => c.companyId === companyId);
    const latest = consensus.at(-1);
    return latest ?? { score: 0, level: "none" };
  }

  getMinorityOpinions(companyId: string) {
    return [...this.store.minorityOpinions.values()].filter((m) => m.companyId === companyId);
  }

  getParticipation(companyId: string) {
    return this.runtime.getMembers(companyId);
  }

  getHealth(companyId: string) {
    return this.runtime.getHealth(companyId);
  }

  getTrust(companyId: string) {
    return this.runtime.getTrustScores(companyId);
  }

  getDecisions(companyId: string) {
    return [...this.store.decisions.values()].filter((d) => d.companyId === companyId);
  }

  getDecisionQueue(companyId: string) {
    return this.sessions.listIssues(companyId).filter((i) =>
      ["open", "deliberating", "evidence_gathering"].includes(i.status),
    );
  }

  getDecisionClassification(companyId: string) {
    return [...this.store.issues.values()]
      .filter((i) => i.companyId === companyId)
      .map((i) => ({ issueId: i.id, decisionClass: i.decisionClass, classification: i.classification }));
  }

  getAttention(companyId: string) {
    return this.attention.getAttention(companyId);
  }

  getEscalations(companyId: string) {
    return [...this.store.escalations.values()].filter((e) => e.companyId === companyId);
  }

  getOverrides(companyId: string) {
    return [...this.store.overrides.values()].filter((o) => o.companyId === companyId);
  }

  getHistory(companyId: string) {
    return this.runtime.getHistory(companyId);
  }

  getAudit(companyId: string) {
    return this.runtime.getAudit(companyId);
  }

  getTimeline(companyId: string) {
    return this.runtime.getHistory(companyId);
  }

  getMetrics(companyId: string) {
    const now = new Date();
    return this.runtime.getMetrics(companyId, {
      from: new Date(now.getTime() - 30 * 86400000).toISOString(),
      to: now.toISOString(),
    });
  }

  getCertification(companyId: string) {
    return this.certification.runCouncilCertification(companyId);
  }
}
