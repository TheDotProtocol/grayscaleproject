import { Injectable } from "@nestjs/common";
import type { CouncilEvidence } from "@grayscale/platform";
import { CouncilStoreService } from "./council-store.service";
import { EventsService } from "../events/events.service";
import { ExecutiveBusService } from "../executive/executive-bus.service";

@Injectable()
export class CouncilEvidenceService {
  constructor(
    private readonly store: CouncilStoreService,
    private readonly events: EventsService,
    private readonly bus: ExecutiveBusService,
  ) {}

  async submit(input: Omit<CouncilEvidence, "id" | "submittedAt">): Promise<CouncilEvidence> {
    const evidence: CouncilEvidence = {
      id: this.store.newId("evidence"),
      ...input,
      submittedAt: new Date().toISOString(),
    };
    this.store.evidence.set(evidence.id, evidence);

    await this.bus.send({
      companyId: input.companyId,
      messageType: "notification",
      fromExecutiveId: input.submittedByExecutiveId,
      subject: `Council evidence: ${input.summary.slice(0, 80)}`,
      payload: { evidenceId: evidence.id, issueId: input.issueId, sourceType: input.sourceType },
      correlationId: input.correlationId,
    });

    await this.events.publish("council.evidence.submitted", input.companyId, {
      evidenceId: evidence.id,
      issueId: input.issueId,
    }, { correlationId: input.correlationId, source: "council-evidence" });

    return evidence;
  }

  listForIssue(issueId: string): CouncilEvidence[] {
    return [...this.store.evidence.values()].filter((e) => e.issueId === issueId);
  }
}
