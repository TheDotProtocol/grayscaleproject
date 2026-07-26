import { Injectable } from "@nestjs/common";
import type {
  EngineLinkRef,
  LearningRecordType,
  OrganizationalLearningEnginePort,
  OrganizationalLearningRecord,
} from "@grayscale/platform";
import { EventsService } from "../events/events.service";

@Injectable()
export class OrganizationalLearningEngineService implements OrganizationalLearningEnginePort {
  readonly engineId = "organizational-learning" as const;
  private readonly records = new Map<string, OrganizationalLearningRecord>();

  constructor(private readonly events: EventsService) {}

  async record(
    input: Omit<OrganizationalLearningRecord, "id" | "version" | "createdAt" | "updatedAt">,
  ): Promise<OrganizationalLearningRecord> {
    const now = new Date().toISOString();
    const record: OrganizationalLearningRecord = {
      ...input,
      id: crypto.randomUUID(),
      version: 1,
      confidence: input.confidence ?? 0.7,
      validationStatus: input.validationStatus ?? "pending",
      createdAt: now,
      updatedAt: now,
    };
    this.records.set(record.id, record);
    await this.events.publish("organizational-learning.recorded", record.companyId, {
      learningId: record.id,
      type: record.type,
      source: record.source ?? "organization",
    });
    return record;
  }

  async get(id: string): Promise<OrganizationalLearningRecord | null> {
    return this.records.get(id) ?? null;
  }

  async list(companyId: string, filters?: { type?: LearningRecordType; limit?: number }): Promise<OrganizationalLearningRecord[]> {
    const items = [...this.records.values()]
      .filter((r) => r.companyId === companyId)
      .filter((r) => (filters?.type ? r.type === filters.type : true))
      .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt));
    return items.slice(0, filters?.limit ?? 100);
  }

  async linkRecord(id: string, links: EngineLinkRef): Promise<OrganizationalLearningRecord> {
    const record = this.records.get(id);
    if (!record) throw new Error("Learning record not found");
    const updated = { ...record, links: { ...record.links, ...links }, updatedAt: new Date().toISOString() };
    this.records.set(id, updated);
    await this.events.publish("organizational-learning.linked", record.companyId, { learningId: id });
    return updated;
  }

  async getTimeline(companyId: string, limit = 50): Promise<OrganizationalLearningRecord[]> {
    return this.list(companyId, { limit });
  }

  async validate(id: string): Promise<OrganizationalLearningRecord> {
    const record = this.records.get(id);
    if (!record) throw new Error("Learning record not found");
    const updated = { ...record, validationStatus: "validated" as const, updatedAt: new Date().toISOString() };
    this.records.set(id, updated);
    await this.events.publish("organizational-learning.validated", record.companyId, { learningId: id });
    return updated;
  }

  getHealth(companyId: string) {
    const items = [...this.records.values()].filter((r) => r.companyId === companyId);
    const validated = items.filter((r) => r.validationStatus === "validated").length;
    return {
      total: items.length,
      validated,
      pending: items.filter((r) => r.validationStatus === "pending").length,
      healthScore: items.length ? Math.round((validated / items.length) * 100) : 100,
    };
  }
}
