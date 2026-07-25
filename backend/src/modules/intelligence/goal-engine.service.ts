import { Injectable } from "@nestjs/common";
import type { IntelligenceEngine, CreateGoalInput, Goal } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";
import { EventsService } from "../events/events.service";
import { rowToGoal } from "./intelligence.mapper";

@Injectable()
export class GoalEngineService implements IntelligenceEngine {
  readonly id = "goals";
  readonly name = "Goal Engine";
  readonly version = 1;

  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventsService,
  ) {}

  async contribute(companyId: string) {
    const goals = await this.listActive(companyId);
    return {
      engineId: this.id,
      data: { goals, count: goals.length },
      computedAt: new Date().toISOString(),
    };
  }

  async listActive(companyId: string): Promise<Goal[]> {
    const rows = await this.prisma.goal.findMany({
      where: { companyId, status: "active" },
      orderBy: { priorityWeight: "desc" },
    });
    return rows.map(rowToGoal);
  }

  async create(input: CreateGoalInput): Promise<Goal> {
    const row = await this.prisma.goal.create({
      data: {
        companyId: input.companyId,
        scope: input.scope,
        department: input.department,
        title: input.title,
        description: input.description,
        successCriteria: (input.successCriteria ?? []) as object,
        priorityWeight: input.priorityWeight ?? 0.5,
        ownerId: input.ownerId,
        deadline: input.deadline ? new Date(input.deadline) : undefined,
      },
    });
    await this.events.publish(
      "goal.created",
      input.companyId,
      { goalId: row.id, title: row.title },
      { source: "intelligence" },
    );
    return rowToGoal(row);
  }
}
