import { Injectable } from "@nestjs/common";
import type { ExecutiveCouncilContextFields } from "@grayscale/platform";
import { CouncilGovernanceService } from "./council-governance.service";
import { CouncilSessionService } from "./council-session.service";
import { CouncilStoreService } from "./council-store.service";

/** Assembles read-only council snapshots into CompanyContext — no duplicated storage */
@Injectable()
export class CouncilContextAssemblerService {
  constructor(
    private readonly governance: CouncilGovernanceService,
    private readonly sessions: CouncilSessionService,
    private readonly store: CouncilStoreService,
  ) {}

  assemble(companyId: string): ExecutiveCouncilContextFields {
    const gov = this.store.defaultGovernance(companyId);
    const members = this.store.defaultMembers(companyId);
    const health = this.governance.getHealth(companyId);

    const activeCouncilSessions = this.sessions
      .listSessions(companyId)
      .filter((s) => s.status === "active")
      .map((s) => ({
        id: s.id,
        title: s.title,
        status: s.status,
        startedAt: s.startedAt,
      }));

    const openIssues = this.sessions.listIssues(companyId).filter((i) =>
      ["open", "deliberating", "evidence_gathering"].includes(i.status),
    );

    const pendingVotes = openIssues.map((issue) => ({
      sessionId: issue.sessionId,
      issueId: issue.id,
      title: issue.title,
      votesCast: [...this.store.votes.values()].filter((v) => v.issueId === issue.id).length,
    }));

    const organizationalConsensus = [...this.store.consensus.values()]
      .filter((c) => c.companyId === companyId)
      .slice(-5)
      .map((c) => ({
        sessionId: c.sessionId,
        issueId: c.issueId,
        level: c.level,
        score: c.score,
        measuredAt: c.measuredAt,
      }));

    return {
      executiveCouncil: {
        memberCount: members.length,
        governanceVersion: gov.version,
        assembledAt: new Date().toISOString(),
      },
      councilHealth: health,
      activeCouncilSessions,
      organizationalConsensus,
      pendingVotes,
    };
  }
}
