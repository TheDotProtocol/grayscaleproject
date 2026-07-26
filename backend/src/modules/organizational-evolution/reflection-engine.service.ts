import { Injectable } from "@nestjs/common";
import type { OrganizationalReflectionPort, ReflectionCategory, ReflectionObservation } from "@grayscale/platform";
import { EventsService } from "../events/events.service";

@Injectable()
export class ReflectionEngineService implements OrganizationalReflectionPort {
  readonly engineId = "organizational-reflection" as const;
  private readonly observations = new Map<string, ReflectionObservation>();

  constructor(private readonly events: EventsService) {}

  async reflect(input: Omit<ReflectionObservation, "id" | "version" | "createdAt" | "updatedAt">): Promise<ReflectionObservation> {
    const now = new Date().toISOString();
    const obs: ReflectionObservation = { ...input, id: crypto.randomUUID(), version: 1, createdAt: now, updatedAt: now };
    this.observations.set(obs.id, obs);
    return obs;
  }

  async list(companyId: string, filters?: { category?: ReflectionCategory }): Promise<ReflectionObservation[]> {
    return [...this.observations.values()]
      .filter((o) => o.companyId === companyId)
      .filter((o) => (filters?.category ? o.category === filters.category : true));
  }

  async getMetrics(companyId: string) {
    const items = await this.list(companyId);
    const byCategory: Record<string, number> = {};
    for (const o of items) byCategory[o.category] = (byCategory[o.category] ?? 0) + 1;
    return {
      companyId,
      totalObservations: items.length,
      byCategory,
      averageConfidence: items.length ? items.reduce((s, o) => s + o.confidence, 0) / items.length : 0,
      computedAt: new Date().toISOString(),
    };
  }

  async runPeriodicReflection(companyId: string): Promise<ReflectionObservation[]> {
    const now = new Date().toISOString();
    const periodStart = new Date(Date.now() - 30 * 86400000).toISOString();
    const categories: ReflectionCategory[] = [
      "failed_assumptions",
      "forecast_inaccuracy",
      "attention_drift",
      "recurring_bottlenecks",
    ];
    const created: ReflectionObservation[] = [];
    for (const category of categories) {
      const obs = await this.reflect({
        companyId,
        category,
        observation: `Periodic reflection: ${category.replace(/_/g, " ")} — observation only, no recommendation`,
        evidence: [{ type: "reflection", sourceId: companyId, summary: "Periodic organizational self-evaluation", recordedAt: now }],
        confidence: 0.65,
        periodStart,
        periodEnd: now,
        correlationId: crypto.randomUUID(),
      });
      created.push(obs);
    }
    await this.events.publish("organizational-reflection.completed", companyId, { count: created.length });
    return created;
  }
}
