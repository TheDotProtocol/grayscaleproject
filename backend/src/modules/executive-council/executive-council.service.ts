import { Injectable } from "@nestjs/common";
import {
  validateCouncilMessage,
  type CouncilDeliberation,
  type CouncilExecutiveId,
  type CouncilMessage,
  type CouncilMessageInput,
  type ExecutiveCouncilPort,
} from "@grayscale/platform";

@Injectable()
export class ExecutiveCouncilService implements ExecutiveCouncilPort {
  private readonly messages: CouncilMessage[] = [];
  private readonly deliberations: CouncilDeliberation[] = [];

  async send(input: CouncilMessageInput): Promise<CouncilMessage> {
    const validation = validateCouncilMessage(input);
    if (!validation.valid) throw new Error(validation.reason);

    const message: CouncilMessage = {
      id: `council-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ...input,
      createdAt: new Date().toISOString(),
    };
    this.messages.push(message);
    return message;
  }

  async list(
    companyId: string,
    filters?: { executiveId?: string; recommendationId?: string; limit?: number },
  ): Promise<CouncilMessage[]> {
    let result = this.messages.filter((m) => m.companyId === companyId);
    if (filters?.executiveId) {
      result = result.filter(
        (m) => m.fromExecutiveId === filters.executiveId || m.toExecutiveId === filters.executiveId,
      );
    }
    if (filters?.recommendationId) {
      result = result.filter((m) => m.recommendationId === filters.recommendationId);
    }
    const limit = filters?.limit ?? 50;
    return result.slice(-limit);
  }

  validateMessage(input: CouncilMessageInput) {
    return validateCouncilMessage(input);
  }

  /** Prepare council deliberation — no executive may dominate without evidence */
  prepareDeliberation(input: {
    companyId: string;
    recommendationId?: string;
    participatingExecutives: CouncilExecutiveId[];
    correlationId: string;
  }): CouncilDeliberation {
    const deliberation: CouncilDeliberation = {
      id: `delib-${Date.now()}`,
      companyId: input.companyId,
      recommendationId: input.recommendationId,
      mode: "synthesis",
      participatingExecutives: input.participatingExecutives,
      consensusReached: false,
      minorityOpinions: [],
      correlationId: input.correlationId,
      createdAt: new Date().toISOString(),
    };
    this.deliberations.push(deliberation);
    return deliberation;
  }

  listDeliberations(companyId: string): CouncilDeliberation[] {
    return this.deliberations.filter((d) => d.companyId === companyId);
  }
}
