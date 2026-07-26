import { Injectable } from "@nestjs/common";
import type { StrategyEvolutionPort, StrategyEvolutionProposal } from "@grayscale/platform";
import { EventsService } from "../events/events.service";

@Injectable()
export class StrategyEvolutionService implements StrategyEvolutionPort {
  readonly engineId = "strategy-evolution" as const;
  private readonly proposals = new Map<string, StrategyEvolutionProposal>();

  constructor(private readonly events: EventsService) {}

  async propose(
    input: Omit<StrategyEvolutionProposal, "id" | "version" | "status" | "createdAt" | "updatedAt">,
  ): Promise<StrategyEvolutionProposal> {
    const now = new Date().toISOString();
    const proposal: StrategyEvolutionProposal = {
      ...input,
      id: crypto.randomUUID(),
      version: 1,
      status: "proposed",
      createdAt: now,
      updatedAt: now,
    };
    this.proposals.set(proposal.id, proposal);
    await this.events.publish("strategy-evolution.proposed", proposal.companyId, {
      proposalId: proposal.id,
      correlationId: proposal.correlationId,
    });
    return proposal;
  }

  async list(companyId: string, filters?: { status?: StrategyEvolutionProposal["status"] }): Promise<StrategyEvolutionProposal[]> {
    return [...this.proposals.values()]
      .filter((p) => p.companyId === companyId)
      .filter((p) => (filters?.status ? p.status === filters.status : true));
  }

  async get(id: string): Promise<StrategyEvolutionProposal | null> {
    return this.proposals.get(id) ?? null;
  }
}
