import { Injectable } from "@nestjs/common";
import type { CouncilIssue, CouncilSession, CouncilSessionCompliance } from "@grayscale/platform";
import { isValidDecisionClass, type DecisionClass } from "@grayscale/platform";
import { CouncilStoreService } from "./council-store.service";
import { CouncilDecisionClassifierService } from "./council-decision-classifier.service";
import { EventsService } from "../events/events.service";

@Injectable()
export class CouncilSessionService {
  constructor(
    private readonly store: CouncilStoreService,
    private readonly classifier: CouncilDecisionClassifierService,
    private readonly events: EventsService,
  ) {}

  async openSession(input: {
    companyId: string;
    title: string;
    participatingExecutiveIds: string[];
    quorumRequired?: number;
    correlationId: string;
  }): Promise<CouncilSession> {
    const compliance: CouncilSessionCompliance = {
      founderConstitution: true,
      councilConstitution: true,
      organizationalOperatingModel: true,
      architectureLock: true,
      checkedAt: new Date().toISOString(),
    };

    const session: CouncilSession = {
      id: this.store.newId("session"),
      companyId: input.companyId,
      title: input.title,
      status: "active",
      participatingExecutiveIds: input.participatingExecutiveIds,
      quorumRequired: input.quorumRequired ?? 1,
      correlationId: input.correlationId,
      startedAt: new Date().toISOString(),
      constitutionalCompliance: compliance,
    };

    this.store.sessions.set(session.id, session);
    this.store.appendReplay(session.id, {
      eventType: "council.session.started",
      payload: { sessionId: session.id, title: session.title },
      correlationId: input.correlationId,
      occurredAt: new Date().toISOString(),
    });

    await this.events.publish("council.session.started", input.companyId, { sessionId: session.id }, {
      correlationId: input.correlationId,
      source: "council-session",
    });

    return session;
  }

  async openIssue(input: {
    companyId: string;
    sessionId: string;
    title: string;
    summary: string;
    domain: string;
    decisionClass: string;
    urgency?: CouncilIssue["urgency"];
    initiatingExecutiveId: string;
    correlationId: string;
  }): Promise<CouncilIssue> {
    if (!isValidDecisionClass(input.decisionClass)) {
      throw new Error("Decision class required before deliberation");
    }

    const issue: CouncilIssue = {
      id: this.store.newId("issue"),
      companyId: input.companyId,
      sessionId: input.sessionId,
      title: input.title,
      summary: input.summary,
      domain: input.domain,
      decisionClass: input.decisionClass,
      status: "open",
      urgency: input.urgency ?? "medium",
      initiatingExecutiveId: input.initiatingExecutiveId,
      correlationId: input.correlationId,
      openedAt: new Date().toISOString(),
    };

    this.store.issues.set(issue.id, issue);
    this.classifier.classify(input.companyId, issue.id, input.decisionClass as DecisionClass, input.correlationId);

    await this.events.publish("council.issue.opened", input.companyId, {
      issueId: issue.id,
      sessionId: input.sessionId,
      decisionClass: input.decisionClass,
    }, { correlationId: input.correlationId, source: "council-session" });

    return this.store.issues.get(issue.id)!;
  }

  listSessions(companyId: string): CouncilSession[] {
    return [...this.store.sessions.values()].filter((s) => s.companyId === companyId);
  }

  listIssues(companyId: string, sessionId?: string): CouncilIssue[] {
    return [...this.store.issues.values()].filter(
      (i) => i.companyId === companyId && (!sessionId || i.sessionId === sessionId),
    );
  }
}

