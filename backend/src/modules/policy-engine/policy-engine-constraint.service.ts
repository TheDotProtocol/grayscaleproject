import { Injectable } from "@nestjs/common";
import type { PolicyConstraintSnapshot } from "@grayscale/platform";
import { ConstraintService } from "../intelligence/constraint.service";

@Injectable()
export class PolicyEngineConstraintService {
  constructor(private readonly constraints: ConstraintService) {}

  async assess(companyId: string): Promise<PolicyConstraintSnapshot> {
    const list = await this.constraints.list(companyId);
    const violations = this.constraints.evaluateConstraints(list, {});
    return {
      companyId,
      constraints: list.map((c) => ({
        id: c.id,
        type: c.type,
        limit: c.limit,
        currentUsage: c.currentUsage,
        isHard: c.isHard,
      })),
      violationCount: violations.length,
      assessedAt: new Date().toISOString(),
    };
  }
}
