import { Injectable } from "@nestjs/common";
import type {
  CouncilDecision,
  CouncilDeliberationRecord,
  CouncilExplanation,
  CouncilResolution,
} from "@grayscale/platform";
import { isCouncilExplanationComplete } from "@grayscale/platform";
import { CouncilStoreService } from "./council-store.service";
import { CouncilConsensusService } from "./council-consensus.service";
import { EventsService } from "../events/events.service";
import { ExecutiveBusService } from "../executive/executive-bus.service";

@Injectable()
export class CouncilDecisionService {
  constructor(
    private readonly store: CouncilStoreService,
    private readonly consensus: CouncilConsensusService,
    private readonly events: EventsService,
    private readonly bus: ExecutiveBusService,
  ) {}

  async recordDeliberation(input: Omit<CouncilDeliberationRecord, "id" | "recordedAt">): Promise<CouncilDeliberationRecord> {
    const record: CouncilDeliberationRecord = {
      id: this.store.newId("delib"),
      ...input,
      recordedAt: new Date().toISOString(),
    };
    this.store.deliberations.set(record.id, record);

    await this.bus.send({
      companyId: input.companyId,
      messageType: "notification",
      fromExecutiveId: input.executiveId,
      subject: `Council deliberation: ${input.position.slice(0, 60)}`,
      payload: { deliberationId: record.id, issueId: input.issueId, confidence: input.confidence },
      correlationId: input.correlationId,
    });

    await this.events.publish("council.deliberation.recorded", input.companyId, {
      deliberationId: record.id,
      issueId: input.issueId,
    }, { correlationId: input.correlationId, source: "council-decision" });

    return record;
  }

  async proposeResolution(input: Omit<CouncilResolution, "id" | "proposedAt">): Promise<CouncilResolution> {
    const resolution: CouncilResolution = {
      id: this.store.newId("resolution"),
      ...input,
      proposedAt: new Date().toISOString(),
    };
    this.store.resolutions.set(resolution.id, resolution);
    await this.events.publish("council.resolution.proposed", input.companyId, {
      resolutionId: resolution.id,
    }, { correlationId: input.correlationId, source: "council-decision" });
    return resolution;
  }

  async approveDecision(input: Omit<CouncilDecision, "id">): Promise<CouncilDecision> {
    const decision: CouncilDecision = {
      id: this.store.newId("decision"),
      ...input,
    };
    this.store.decisions.set(decision.id, decision);
    await this.events.publish("council.decision.approved", input.companyId, {
      decisionId: decision.id,
      resolutionId: input.resolutionId,
    }, { correlationId: input.correlationId, source: "council-decision" });
    return decision;
  }
}

@Injectable()
export class CouncilExplainabilityService {
  constructor(private readonly store: CouncilStoreService) {}

  async generateExplanation(sessionId: string, issueId: string): Promise<CouncilExplanation> {
    const issue = this.store.issues.get(issueId);
    if (!issue) throw new Error("Issue not found");

    const session = this.store.sessions.get(sessionId);
    const votes = [...this.store.votes.values()].filter((v) => v.issueId === issueId);
    const deliberations = [...this.store.deliberations.values()].filter((d) => d.issueId === issueId);
    const minorities = [...this.store.minorityOpinions.values()].filter((m) => m.issueId === issueId);
    const evidence = [...this.store.evidence.values()].filter((e) => e.issueId === issueId);
    const consensus = [...this.store.consensus.values()].find((c) => c.issueId === issueId);

    const explanation: CouncilExplanation = {
      id: this.store.newId("explanation"),
      companyId: issue.companyId,
      sessionId,
      issueId,
      issueSummary: issue.summary,
      decisionPath: ["issue", "evidence_collection", "discovery", "deliberation", "challenge", "consensus", "explanation"],
      participatingExecutives: deliberations.map((d) => ({ executiveId: d.executiveId, roles: [d.roleAtDeliberation] })),
      evidenceSummary: evidence.map((e) => ({ ref: e.id, sourceType: e.sourceType, summary: e.summary })),
      contradictingEvidence: evidence.filter((e) => e.contradictsPosition).map((e) => ({ ref: e.id, summary: e.summary })),
      voteRecord: votes.map((v) => ({ executiveId: v.executiveId, vote: v.vote, evidenceRefs: v.evidenceRefs })),
      consensusLevel: consensus?.level ?? "none",
      minorityOpinions: minorities.map((m) => ({
        executiveId: m.executiveId,
        position: m.position,
        evidenceRefs: m.evidenceRefs,
        rationale: m.rationale,
      })),
      confidence: deliberations.length
        ? deliberations.reduce((s, d) => s + d.confidence, 0) / deliberations.length
        : 0,
      confidenceSources: deliberations.flatMap((d) => d.confidenceSources),
      policiesEvaluated: [],
      constraintsEvaluated: [],
      constitutionalCompliance: session?.constitutionalCompliance
        ? {
            founderConstitution: session.constitutionalCompliance.founderConstitution,
            councilConstitution: session.constitutionalCompliance.councilConstitution,
            operatingModel: session.constitutionalCompliance.organizationalOperatingModel,
          }
        : {},
      founderReviewRequired: consensus?.founderReviewRequired ?? true,
      founderReviewReason: consensus?.founderReviewReason,
      rollbackPlan: "Revert to prior organizational state; re-open council issue with new evidence.",
      whatCouldMakeThisWrong: "New contradictory evidence or Founder priority shift could invalidate this decision.",
      signalIds: [],
      insightIds: [],
      memoryRefs: evidence.filter((e) => e.sourceType === "memory").map((e) => e.sourceRef),
      graphRefs: evidence.filter((e) => e.sourceType === "graph").map((e) => e.sourceRef),
      correlationId: issue.correlationId,
      generatedAt: new Date().toISOString(),
    };

    if (!isCouncilExplanationComplete(explanation)) {
      throw new Error("Incomplete council explanation");
    }

    this.store.explanations.set(explanation.id, explanation);
    return explanation;
  }
}
