import { Injectable } from "@nestjs/common";
import type { DecisionPolicy, PolicyCategory, PolicyRule } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PolicyService {
  constructor(private readonly prisma: PrismaService) {}

  async listActive(companyId: string): Promise<DecisionPolicy[]> {
    const rows = await this.prisma.decisionPolicy.findMany({
      where: { companyId, isActive: true },
    });
    return rows.map((r) => ({
      id: r.id,
      companyId: r.companyId,
      name: r.name,
      category: r.category as PolicyCategory,
      rules: (r.rules as unknown as PolicyRule[]) ?? [],
      isActive: r.isActive,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  async create(
    companyId: string,
    name: string,
    category: PolicyCategory,
    rules: PolicyRule[],
  ): Promise<DecisionPolicy> {
    const row = await this.prisma.decisionPolicy.create({
      data: { companyId, name, category, rules: rules as object },
    });
    return {
      id: row.id,
      companyId,
      name: row.name,
      category: row.category as PolicyCategory,
      rules: (row.rules as unknown as PolicyRule[]) ?? [],
      isActive: row.isActive,
      createdAt: row.createdAt.toISOString(),
    };
  }

  /** Rule-based policy evaluation — no LLM */
  evaluatePolicies(
    policies: DecisionPolicy[],
    context: {
      estimatedCostCents?: number;
      requiresApproval?: boolean;
      department?: string;
    },
  ): string[] {
    const violations: string[] = [];

    for (const policy of policies) {
      for (const rule of policy.rules) {
        if (this.ruleMatches(rule, context)) {
          if (rule.severity === "blocking" || rule.severity === "warning") {
            violations.push(`${policy.name}: ${rule.action}`);
          }
        }
      }
    }

    return violations;
  }

  private ruleMatches(
    rule: PolicyRule,
    context: { estimatedCostCents?: number; requiresApproval?: boolean; department?: string },
  ): boolean {
    switch (rule.condition) {
      case "cost_exceeds_10000":
        return (context.estimatedCostCents ?? 0) > 1_000_000;
      case "requires_founder_approval":
        return context.requiresApproval === true;
      case "high_cost_department":
        return (context.estimatedCostCents ?? 0) > 500_000 && !!context.department;
      default:
        return false;
    }
  }
}
