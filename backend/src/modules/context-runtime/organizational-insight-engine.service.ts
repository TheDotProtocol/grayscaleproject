import { Injectable } from "@nestjs/common";
import type {
  OrganizationalInsight,
  OrganizationalInsightEnginePort,
  OrganizationalInsightSnapshot,
} from "@grayscale/platform";

@Injectable()
export class OrganizationalInsightEngineService implements OrganizationalInsightEnginePort {
  readonly engineId = "organizational-insight" as const;

  private readonly insights = new Map<string, OrganizationalInsight[]>();

  async generateFromSignals(companyId: string, signalIds: string[]): Promise<OrganizationalInsight[]> {
    return (this.insights.get(companyId) ?? []).filter((i) =>
      i.derivedFromSignalIds.some((id) => signalIds.includes(id)),
    );
  }

  async getSnapshot(companyId: string): Promise<OrganizationalInsightSnapshot> {
    return {
      companyId,
      assembledAt: new Date().toISOString(),
      insights: this.insights.get(companyId) ?? [],
    };
  }

  async record(input: Omit<OrganizationalInsight, "id" | "generatedAt" | "isRecommendation">): Promise<OrganizationalInsight> {
    const record: OrganizationalInsight = {
      ...input,
      id: crypto.randomUUID(),
      generatedAt: new Date().toISOString(),
      isRecommendation: false,
    };
    const list = this.insights.get(input.companyId) ?? [];
    list.push(record);
    this.insights.set(input.companyId, list);
    return record;
  }
}
