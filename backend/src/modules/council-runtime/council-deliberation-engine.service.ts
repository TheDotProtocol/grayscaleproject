import { Injectable } from "@nestjs/common";
import {
  DELIBERATION_STAGES,
  type DeliberationStage,
  type ExecutiveDeliberationPort,
  type ExecutiveDeliberationProposal,
  nextDeliberationStage,
  isDeliberationComplete,
  COUNCIL_RUNTIME_VERSION,
} from "@grayscale/platform";
import { EventsService } from "../events/events.service";
import { CouncilStoreService } from "./council-store.service";
import { CouncilMemoryService } from "./council-memory.service";

/** Deterministic 12-stage deliberation — executives never skip stages */
@Injectable()
export class CouncilDeliberationEngineService implements ExecutiveDeliberationPort {
  constructor(
    private readonly store: CouncilStoreService,
    private readonly memory: CouncilMemoryService,
    private readonly events: EventsService,
  ) {}

  canSkipStage(_stage: DeliberationStage): false {
    return false;
  }

  async startProposal(input: {
    companyId: string;
    sessionId: string;
    issueId: string;
    initiatingExecutiveId: string;
    correlationId: string;
  }): Promise<ExecutiveDeliberationProposal> {
    const firstStage = DELIBERATION_STAGES[0]!;
    const now = new Date().toISOString();
    const proposal: ExecutiveDeliberationProposal = {
      proposalId: this.store.newId("prop"),
      companyId: input.companyId,
      sessionId: input.sessionId,
      issueId: input.issueId,
      initiatingExecutiveId: input.initiatingExecutiveId,
      currentStage: firstStage,
      currentStageIndex: 0,
      completedStages: [],
      stageRecords: [{
        stage: firstStage,
        stageIndex: 0,
        startedAt: now,
        success: true,
        evidence: ["observation-initiated"],
        correlationId: input.correlationId,
      }],
      status: "in_progress",
      correlationId: input.correlationId,
      version: COUNCIL_RUNTIME_VERSION,
      createdAt: now,
      updatedAt: now,
    };

    this.store.proposals.set(proposal.proposalId, proposal);
    await this.memory.append({
      companyId: input.companyId,
      sessionId: input.sessionId,
      issueId: input.issueId,
      entryType: "minutes",
      refId: proposal.proposalId,
      summary: `Deliberation started at ${firstStage}`,
      payload: { stage: firstStage },
      correlationId: input.correlationId,
    });

    await this.events.publish("council.deliberation.started", input.companyId, {
      proposalId: proposal.proposalId,
      stage: firstStage,
    }, { correlationId: input.correlationId });

    return proposal;
  }

  async advanceStage(proposalId: string, evidence: string[] = []): Promise<ExecutiveDeliberationProposal> {
    const proposal = this.store.proposals.get(proposalId);
    if (!proposal) throw new Error("Proposal not found");

    const now = new Date().toISOString();
    const currentRecord = proposal.stageRecords.find((r) => r.stage === proposal.currentStage && !r.completedAt);
    if (currentRecord) {
      currentRecord.completedAt = now;
      currentRecord.success = true;
      currentRecord.evidence = evidence.length ? evidence : currentRecord.evidence;
    }

    if (!proposal.completedStages.includes(proposal.currentStage)) {
      proposal.completedStages.push(proposal.currentStage);
    }

    const next = nextDeliberationStage(proposal.currentStage);
    if (!next) {
      proposal.status = "completed";
      proposal.updatedAt = now;
      await this.events.publish("council.deliberation.completed", proposal.companyId, { proposalId }, {
        correlationId: proposal.correlationId,
      });
      return proposal;
    }

    proposal.currentStage = next;
    proposal.currentStageIndex = DELIBERATION_STAGES.indexOf(next);
    proposal.stageRecords.push({
      stage: next,
      stageIndex: proposal.currentStageIndex,
      startedAt: now,
      success: true,
      evidence: evidence.length ? evidence : [`stage-${next}-entered`],
      correlationId: proposal.correlationId,
    });
    proposal.updatedAt = now;

    await this.events.publish("council.deliberation.stage.advanced", proposal.companyId, {
      proposalId,
      stage: next,
      stageIndex: proposal.currentStageIndex,
    }, { correlationId: proposal.correlationId });

    if (isDeliberationComplete(proposal.completedStages) && proposal.currentStage === "certification") {
      proposal.status = "completed";
    }

    this.store.proposals.set(proposalId, proposal);
    return proposal;
  }

  async getProposal(proposalId: string): Promise<ExecutiveDeliberationProposal | null> {
    return this.store.proposals.get(proposalId) ?? null;
  }

  async listActive(companyId: string): Promise<ExecutiveDeliberationProposal[]> {
    return [...this.store.proposals.values()].filter(
      (p) => p.companyId === companyId && p.status === "in_progress",
    );
  }
}
