import { Injectable } from "@nestjs/common";
import type { PolicyApprovalSnapshot } from "@grayscale/platform";
import { PolicyEngineStoreService } from "./policy-engine-store.service";

@Injectable()
export class PolicyApprovalService {
  constructor(private readonly store: PolicyEngineStoreService) {}

  async getQueue(companyId: string): Promise<PolicyApprovalSnapshot> {
    const pending = this.store.approvals.get(companyId) ?? [];
    return {
      companyId,
      pending,
      completed: 0,
      assessedAt: new Date().toISOString(),
    };
  }

  async routeApproval(input: {
    companyId: string;
    actionRef: string;
    kind: "founder" | "council" | "executive";
    correlationId: string;
  }): Promise<{ approvalId: string }> {
    const approvalId = this.store.newId("appr");
    const list = this.store.approvals.get(input.companyId) ?? [];
    list.push({
      approvalId,
      kind: input.kind,
      actionRef: input.actionRef,
      requestedAt: new Date().toISOString(),
    });
    this.store.approvals.set(input.companyId, list);
    return { approvalId };
  }
}
