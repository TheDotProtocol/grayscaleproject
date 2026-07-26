import { Injectable } from "@nestjs/common";
import type { EngineEvidenceRef, MemoryEvolutionLayer, MemoryEvolutionPort } from "@grayscale/platform";
import { EventsService } from "../events/events.service";

@Injectable()
export class MemoryEvolutionService implements MemoryEvolutionPort {
  readonly engineId = "memory-evolution" as const;
  private readonly layers = new Map<string, MemoryEvolutionLayer>();

  constructor(private readonly events: EventsService) {}

  async evolve(input: Omit<MemoryEvolutionLayer, "id" | "version" | "createdAt" | "updatedAt">): Promise<MemoryEvolutionLayer> {
    const now = new Date().toISOString();
    const layer: MemoryEvolutionLayer = {
      ...input,
      id: crypto.randomUUID(),
      version: 1,
      createdAt: now,
      updatedAt: now,
    };
    this.layers.set(layer.id, layer);
    await this.events.publish("memory-evolution.layer.created", layer.companyId, {
      layerId: layer.id,
      stage: layer.stage,
      sourceMemoryId: layer.sourceMemoryId,
      correlationId: layer.correlationId,
    });
    return layer;
  }

  async getLayers(companyId: string, filters?: { stage?: MemoryEvolutionLayer["stage"]; sourceMemoryId?: string }): Promise<MemoryEvolutionLayer[]> {
    return [...this.layers.values()]
      .filter((l) => l.companyId === companyId)
      .filter((l) => (filters?.stage ? l.stage === filters.stage : true))
      .filter((l) => (filters?.sourceMemoryId ? l.sourceMemoryId === filters.sourceMemoryId : true));
  }

  async getTimeline(companyId: string, limit = 50): Promise<MemoryEvolutionLayer[]> {
    return [...this.layers.values()]
      .filter((l) => l.companyId === companyId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  }

  async getIntegrity(companyId: string): Promise<{ immutableMemoryPreserved: boolean; layerCount: number }> {
    const layerCount = [...this.layers.values()].filter((l) => l.companyId === companyId).length;
    return { immutableMemoryPreserved: true, layerCount };
  }
}

export function defaultEvolutionEvidence(sourceId: string, summary: string): EngineEvidenceRef {
  return { type: "memory_evolution", sourceId, summary, recordedAt: new Date().toISOString() };
}
