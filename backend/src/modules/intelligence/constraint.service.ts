import { Injectable } from "@nestjs/common";
import type { StrategicConstraint, ConstraintType } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ConstraintService {
  constructor(private readonly prisma: PrismaService) {}

  async list(companyId: string): Promise<StrategicConstraint[]> {
    const rows = await this.prisma.strategicConstraint.findMany({
      where: { companyId },
    });
    return rows.map((r) => ({
      id: r.id,
      companyId: r.companyId,
      type: r.type as ConstraintType,
      limit: r.limitValue,
      unit: r.unit,
      currentUsage: r.currentUsage,
      isHard: r.isHard,
    }));
  }

  async upsert(
    companyId: string,
    type: ConstraintType,
    limit: number,
    unit: string,
    isHard = true,
  ): Promise<StrategicConstraint> {
    const existing = await this.prisma.strategicConstraint.findFirst({
      where: { companyId, type },
    });

    const row = existing
      ? await this.prisma.strategicConstraint.update({
          where: { id: existing.id },
          data: { limitValue: limit, unit, isHard },
        })
      : await this.prisma.strategicConstraint.create({
          data: { companyId, type, limitValue: limit, unit, isHard },
        });

    return {
      id: row.id,
      companyId,
      type: row.type as ConstraintType,
      limit: row.limitValue,
      unit: row.unit,
      currentUsage: row.currentUsage,
      isHard: row.isHard,
    };
  }

  evaluateConstraints(
    constraints: StrategicConstraint[],
    proposal: {
      estimatedCostCents?: number;
      engineeringCost?: number;
    },
  ): string[] {
    const violations: string[] = [];

    for (const c of constraints) {
      const usage = this.proposalUsage(c.type, proposal, c.currentUsage);
      if (usage > c.limit) {
        violations.push(
          `${c.type}: usage ${usage}${c.unit} exceeds limit ${c.limit}${c.unit}${c.isHard ? " (hard)" : ""}`,
        );
      }
    }

    return violations;
  }

  private proposalUsage(
    type: ConstraintType,
    proposal: { estimatedCostCents?: number; engineeringCost?: number },
    current: number,
  ): number {
    switch (type) {
      case "budget":
        return current + (proposal.estimatedCostCents ?? 0) / 100;
      case "engineering_capacity":
        return current + (proposal.engineeringCost ?? 0);
      default:
        return current;
    }
  }
}
