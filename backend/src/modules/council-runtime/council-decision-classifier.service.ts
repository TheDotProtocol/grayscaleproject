import { Injectable, NotFoundException } from "@nestjs/common";
import { classifyDecision, isValidDecisionClass, type ClassifiedDecision, type DecisionClass } from "@grayscale/platform";
import { CouncilStoreService } from "./council-store.service";
import { EventsService } from "../events/events.service";

@Injectable()
export class CouncilDecisionClassifierService {
  constructor(
    private readonly store: CouncilStoreService,
    private readonly events: EventsService,
  ) {}

  classify(companyId: string, issueId: string, decisionClass: DecisionClass, correlationId: string): ClassifiedDecision {
    if (!isValidDecisionClass(decisionClass)) {
      throw new Error(`Invalid decision class: ${decisionClass}`);
    }
    const classified = classifyDecision(decisionClass, correlationId);
    this.store.classifications.set(issueId, classified);

    const issue = this.store.issues.get(issueId);
    if (issue) {
      this.store.issues.set(issueId, {
        ...issue,
        decisionClass,
        classification: { decisionClass, classifiedAt: classified.classifiedAt, correlationId },
      });
    }

    void this.events.publish(
      "council.issue.classified",
      companyId,
      { issueId, decisionClass, requirements: classified.requirements },
      { correlationId, source: "council-classifier" },
    );

    return classified;
  }

  getClassification(issueId: string): ClassifiedDecision {
    const c = this.store.classifications.get(issueId);
    if (!c) throw new NotFoundException("Decision not classified");
    return c;
  }
}
