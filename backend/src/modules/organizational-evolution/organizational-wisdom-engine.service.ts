import { Injectable } from "@nestjs/common";
import type { OrganizationalWisdomEnginePort, WisdomRecord } from "@grayscale/platform";
import { EventsService } from "../events/events.service";

@Injectable()
export class OrganizationalWisdomEngineService implements OrganizationalWisdomEnginePort {
  readonly engineId = "organizational-wisdom" as const;
  private readonly records = new Map<string, WisdomRecord>();

  constructor(private readonly events: EventsService) {}

  async listApproved(companyId: string): Promise<WisdomRecord[]> {
    return [...this.records.values()].filter((r) => r.companyId === companyId && r.approvalStatus === "approved");
  }

  async get(id: string): Promise<WisdomRecord | null> {
    return this.records.get(id) ?? null;
  }

  async propose(input: Omit<WisdomRecord, "id" | "version" | "approvalStatus" | "versionHistory" | "createdAt" | "updatedAt">): Promise<WisdomRecord> {
    const now = new Date().toISOString();
    const record: WisdomRecord = {
      ...input,
      id: crypto.randomUUID(),
      version: 1,
      approvalStatus: "draft",
      versionHistory: [{ version: 1, changedAt: now, summary: "Initial proposal" }],
      createdAt: now,
      updatedAt: now,
    };
    this.records.set(record.id, record);
    await this.events.publish("organizational-wisdom.proposed", record.companyId, { wisdomId: record.id });
    return record;
  }

  async approve(id: string, approverId: string): Promise<WisdomRecord> {
    const record = this.records.get(id);
    if (!record) throw new Error("Wisdom record not found");
    const now = new Date().toISOString();
    const updated: WisdomRecord = {
      ...record,
      approvalStatus: "approved",
      approvedBy: approverId,
      approvedAt: now,
      updatedAt: now,
      versionHistory: [...record.versionHistory, { version: record.version, changedAt: now, summary: "Approved" }],
    };
    this.records.set(id, updated);
    await this.events.publish("organizational-wisdom.approved", record.companyId, { wisdomId: id, approverId });
    return updated;
  }

  async getHistory(companyId: string): Promise<WisdomRecord[]> {
    return [...this.records.values()]
      .filter((r) => r.companyId === companyId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  getGrowth(companyId: string) {
    const items = [...this.records.values()].filter((r) => r.companyId === companyId);
    const approved = items.filter((r) => r.approvalStatus === "approved").length;
    return { total: items.length, approved, growthScore: approved * 10 + items.length };
  }
}
