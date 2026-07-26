import { Injectable } from "@nestjs/common";
import type { AutonomyActionRecord, AutonomyPolicy, OrganizationalAutonomyPort } from "@grayscale/platform";
import { EventsService } from "../events/events.service";

@Injectable()
export class AutonomyFrameworkService implements OrganizationalAutonomyPort {
  readonly engineId = "organizational-autonomy" as const;
  private readonly policies = new Map<string, AutonomyPolicy>();
  private readonly actions = new Map<string, AutonomyActionRecord>();

  constructor(private readonly events: EventsService) {}

  async proposePolicy(input: Omit<AutonomyPolicy, "id" | "version" | "status" | "createdAt" | "updatedAt">): Promise<AutonomyPolicy> {
    const now = new Date().toISOString();
    const policy: AutonomyPolicy = { ...input, id: crypto.randomUUID(), version: 1, status: "draft", createdAt: now, updatedAt: now };
    this.policies.set(policy.id, policy);
    return policy;
  }

  async approvePolicy(id: string, approverId: string): Promise<AutonomyPolicy> {
    const policy = this.policies.get(id);
    if (!policy) throw new Error("Autonomy policy not found");
    const updated = { ...policy, status: "approved" as const, approvedBy: approverId, approvedAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    this.policies.set(id, updated);
    await this.events.publish("organizational-autonomy.policy.approved", policy.companyId, { policyId: id, approverId });
    return updated;
  }

  async listPolicies(companyId: string): Promise<AutonomyPolicy[]> {
    return [...this.policies.values()].filter((p) => p.companyId === companyId);
  }

  async recordAction(input: Omit<AutonomyActionRecord, "actionId" | "occurredAt">): Promise<AutonomyActionRecord> {
    const action: AutonomyActionRecord = { ...input, actionId: crypto.randomUUID(), occurredAt: new Date().toISOString() };
    this.actions.set(action.actionId, action);
    await this.events.publish("organizational-autonomy.action.recorded", action.companyId, { actionId: action.actionId });
    return action;
  }

  async getReadiness(companyId: string) {
    const policies = await this.listPolicies(companyId);
    const approved = policies.filter((p) => p.status === "approved").length;
    const suspended = policies.filter((p) => p.status === "suspended").length;
    const actionsRecorded = [...this.actions.values()].filter((a) => a.companyId === companyId).length;
    const complianceScore = approved > 0 ? 85 : 0;
    return {
      companyId,
      approvedPolicies: approved,
      suspendedPolicies: suspended,
      actionsRecorded,
      complianceScore,
      readyForAutonomy: approved > 0 && complianceScore >= 80,
      computedAt: new Date().toISOString(),
    };
  }
}
