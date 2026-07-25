import { Injectable } from "@nestjs/common";
import type { IntelligenceEngine, CreateObjectiveInput, Objective } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";
import { rowToObjective } from "./intelligence.mapper";

@Injectable()
export class ObjectiveEngineService implements IntelligenceEngine {
  readonly id = "objectives";
  readonly name = "Objective Engine";
  readonly version = 1;

  constructor(private readonly prisma: PrismaService) {}

  async contribute(companyId: string) {
    const objectives = await this.listByCompany(companyId);
    const blocked = objectives.filter((o) => o.status === "blocked");
    return {
      engineId: this.id,
      data: { objectives, blockedCount: blocked.length },
      computedAt: new Date().toISOString(),
    };
  }

  async listByCompany(companyId: string): Promise<Objective[]> {
    const rows = await this.prisma.objective.findMany({
      where: { companyId },
      orderBy: { updatedAt: "desc" },
    });
    return rows.map(rowToObjective);
  }

  async create(input: CreateObjectiveInput): Promise<Objective> {
    const row = await this.prisma.objective.create({
      data: {
        companyId: input.companyId,
        goalId: input.goalId,
        title: input.title,
        description: input.description,
        ownerId: input.ownerId,
        deadline: input.deadline ? new Date(input.deadline) : undefined,
      },
    });
    return rowToObjective(row);
  }
}
