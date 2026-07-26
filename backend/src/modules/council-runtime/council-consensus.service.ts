import { Injectable } from "@nestjs/common";
import type { CouncilConsensus, CouncilMinorityOpinion, CouncilVote } from "@grayscale/platform";
import { CouncilStoreService } from "./council-store.service";
import { CouncilDecisionClassifierService } from "./council-decision-classifier.service";
import { EventsService } from "../events/events.service";

@Injectable()
export class CouncilConsensusService {
  constructor(
    private readonly store: CouncilStoreService,
    private readonly classifier: CouncilDecisionClassifierService,
    private readonly events: EventsService,
  ) {}

  async castVote(input: Omit<CouncilVote, "id" | "castAt">): Promise<CouncilVote> {
    if (input.vote === "reject" && input.evidenceRefs.length === 0) {
      throw new Error("Dissent requires evidence references");
    }
    const vote: CouncilVote = {
      id: this.store.newId("vote"),
      ...input,
      castAt: new Date().toISOString(),
    };
    this.store.votes.set(vote.id, vote);
    await this.events.publish("council.vote.cast", input.companyId, { voteId: vote.id, issueId: input.issueId }, {
      correlationId: input.correlationId,
      source: "council-consensus",
    });
    return vote;
  }

  async recordMinorityOpinion(input: Omit<CouncilMinorityOpinion, "id" | "recordedAt">): Promise<CouncilMinorityOpinion> {
    const opinion: CouncilMinorityOpinion = {
      id: this.store.newId("minority"),
      ...input,
      preserved: true,
      recordedAt: new Date().toISOString(),
    };
    this.store.minorityOpinions.set(opinion.id, opinion);
    return opinion;
  }

  async measureConsensus(sessionId: string, issueId: string): Promise<CouncilConsensus> {
    const issue = this.store.issues.get(issueId);
    if (!issue) throw new Error("Issue not found");

    const votes = [...this.store.votes.values()].filter((v) => v.issueId === issueId);
    const approveCount = votes.filter((v) => v.vote === "approve").length;
    const rejectCount = votes.filter((v) => v.vote === "reject").length;
    const abstainCount = votes.filter((v) => v.vote === "abstain").length;
    const dissentCount = rejectCount;

    let classification;
    try {
      classification = this.classifier.getClassification(issueId);
    } catch {
      classification = null;
    }

    const total = votes.length || 1;
    const score = approveCount / total;
    const evidenceAlignmentScore = votes.filter((v) => v.evidenceRefs.length > 0).length / total;

    let level: CouncilConsensus["level"] = "none";
    if (score >= 0.75 && dissentCount === 0) level = "strong";
    else if (score >= 0.5) level = "weak";

    const founderReviewRequired =
      level === "none" ||
      level === "weak" ||
      (classification?.requirements.founderApprovalRequired ?? false);

    const consensus: CouncilConsensus = {
      id: this.store.newId("consensus"),
      companyId: issue.companyId,
      sessionId,
      issueId,
      level,
      score,
      approveCount,
      rejectCount,
      abstainCount,
      dissentCount,
      evidenceAlignmentScore,
      founderReviewRequired,
      founderReviewReason: founderReviewRequired ? "Weak/no consensus or class requires Founder review" : undefined,
      measuredAt: new Date().toISOString(),
      correlationId: issue.correlationId,
    };

    this.store.consensus.set(consensus.id, consensus);
    await this.events.publish("council.consensus.measured", issue.companyId, {
      consensusId: consensus.id,
      level,
      score,
    }, { correlationId: issue.correlationId, source: "council-consensus" });

    return consensus;
  }
}
