import { Injectable } from "@nestjs/common";
import type { PolicyHistory } from "@grayscale/platform";
import { PolicyEngineStoreService } from "./policy-engine-store.service";

@Injectable()
export class PolicyHistoryService {
  constructor(private readonly store: PolicyEngineStoreService) {}

  async record(
    companyId: string,
    entry: Omit<PolicyHistory["entries"][0], "entryId" | "immutable" | "recordedAt">,
  ): Promise<void> {
    const list = this.store.history.get(companyId) ?? [];
    list.push({
      ...entry,
      entryId: this.store.newId("phist"),
      immutable: true,
      recordedAt: new Date().toISOString(),
    });
    this.store.history.set(companyId, list);
  }

  async getHistory(companyId: string): Promise<PolicyHistory> {
    const entries = this.store.history.get(companyId) ?? [];
    return {
      companyId,
      entries,
      from: entries[0]?.recordedAt ?? new Date().toISOString(),
      to: new Date().toISOString(),
    };
  }
}
