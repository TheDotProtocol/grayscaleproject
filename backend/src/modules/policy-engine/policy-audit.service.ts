import { Injectable } from "@nestjs/common";
import type { PolicyAuditEntry } from "@grayscale/platform";
import { PolicyEngineStoreService } from "./policy-engine-store.service";

@Injectable()
export class PolicyAuditService {
  constructor(private readonly store: PolicyEngineStoreService) {}

  async record(entry: Omit<PolicyAuditEntry, "entryId" | "recordedAt">): Promise<PolicyAuditEntry> {
    const full: PolicyAuditEntry = { ...entry, entryId: this.store.newId("paud"), recordedAt: new Date().toISOString() };
    this.store.audit.set(full.entryId, full);
    return full;
  }

  async list(companyId: string): Promise<PolicyAuditEntry[]> {
    return [...this.store.audit.values()].filter((e) => e.companyId === companyId);
  }
}
