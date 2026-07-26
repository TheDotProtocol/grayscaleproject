import { describe, it, expect, beforeEach, vi } from "vitest";
import { CouncilStoreService } from "./council-store.service";
import { CouncilDecisionClassifierService } from "./council-decision-classifier.service";
import { CouncilSessionService } from "./council-session.service";
import { CouncilConsensusService } from "./council-consensus.service";

describe("CouncilSessionService", () => {
  let store: CouncilStoreService;
  let classifier: CouncilDecisionClassifierService;
  let sessions: CouncilSessionService;
  let events: { publish: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    store = new CouncilStoreService();
    events = { publish: vi.fn().mockResolvedValue(undefined) };
    classifier = new CouncilDecisionClassifierService(store, events as never);
    sessions = new CouncilSessionService(store, classifier, events as never);
  });

  it("opens session with constitutional compliance", async () => {
    const session = await sessions.openSession({
      companyId: "co-1",
      title: "Q3 Review",
      participatingExecutiveIds: ["athena"],
      correlationId: "c1",
    });
    expect(session.constitutionalCompliance.founderConstitution).toBe(true);
  });

  it("requires decision class before deliberation", async () => {
    const session = await sessions.openSession({
      companyId: "co-1",
      title: "Test",
      participatingExecutiveIds: ["athena"],
      correlationId: "c1",
    });
    const issue = await sessions.openIssue({
      companyId: "co-1",
      sessionId: session.id,
      title: "Budget",
      summary: "Review budget",
      domain: "finance",
      decisionClass: "financial",
      initiatingExecutiveId: "athena",
      correlationId: "c2",
    });
    expect(issue.decisionClass).toBe("financial");
    expect(issue.classification).toBeDefined();
  });
});

describe("CouncilConsensusService", () => {
  it("measures consensus deterministically", async () => {
    const store = new CouncilStoreService();
    const events = { publish: vi.fn().mockResolvedValue(undefined) };
    const classifier = new CouncilDecisionClassifierService(store, events as never);
    const consensus = new CouncilConsensusService(store, classifier, events as never);

    store.issues.set("issue-1", {
      id: "issue-1",
      companyId: "co-1",
      sessionId: "s1",
      title: "T",
      summary: "S",
      domain: "d",
      decisionClass: "operational",
      status: "open",
      urgency: "medium",
      initiatingExecutiveId: "athena",
      correlationId: "c1",
      openedAt: new Date().toISOString(),
    });

    await consensus.castVote({
      companyId: "co-1",
      sessionId: "s1",
      issueId: "issue-1",
      executiveId: "athena",
      vote: "approve",
      evidenceRefs: ["mem-1"],
      rationale: "Evidence supports",
      correlationId: "c1",
    });

    const result = await consensus.measureConsensus("s1", "issue-1");
    expect(result.approveCount).toBe(1);
    expect(result.level).toBe("strong");
  });
});
