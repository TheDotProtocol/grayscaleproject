import { Injectable } from "@nestjs/common";
import {
  EXECUTIVE_REGISTRY,
  EXECUTIVE_SPECIALIZATIONS,
  PHASE_D_EXECUTIVE_IDS,
  type ExecutiveCollaborationRecord,
  type ExecutiveDependency,
  type ExecutiveNetwork,
  type ExecutiveNetworkPort,
  type ExecutiveTrustEdge,
  type ExecutiveCoverage,
} from "@grayscale/platform";
import { EventsService } from "../events/events.service";

@Injectable()
export class ExecutiveNetworkService implements ExecutiveNetworkPort {
  private readonly collaborations = new Map<string, ExecutiveCollaborationRecord>();

  constructor(private readonly events: EventsService) {}

  async assemble(companyId: string): Promise<ExecutiveNetwork> {
    const nodes = PHASE_D_EXECUTIVE_IDS.map((id) => {
      const record = EXECUTIVE_REGISTRY[id];
      const spec = EXECUTIVE_SPECIALIZATIONS[id]!;
      return {
        executiveId: id,
        title: record.title,
        lifecycleState: "certified_dormant" as const,
        certified: true,
        councilMember: true,
        dependencies: spec.dependsOn.map((dep) => ({
          fromExecutiveId: id,
          toExecutiveId: dep,
          dependencyType: "operational" as const,
          sharedDomains: spec.domains.filter((d) => EXECUTIVE_SPECIALIZATIONS[dep]?.domains.includes(d)),
          bidirectional: false,
        })),
        trustEdges: spec.dependsOn.map((dep) => ({
          fromExecutiveId: id,
          toExecutiveId: dep,
          trustScore: 0.75,
          collaborationCount: 0,
          evidenceBacked: true,
        })),
        coverage: {
          executiveId: id,
          domainsCovered: spec.domains,
          decisionClassesCovered: spec.decisionClasses,
          coveragePercent: Math.round((spec.domains.length / 6) * 100),
        },
      };
    });

    const sharedResponsibilities = specDomainsGrouped();

    return {
      companyId,
      assembledAt: new Date().toISOString(),
      version: "1.0.0",
      nodes,
      collaborationFrequency: {},
      sharedResponsibilities,
      sharedRisks: ["operational", "financial", "security"],
      sharedOpportunities: ["growth", "innovation"],
    };
  }

  async getDependencies(companyId: string, executiveId: string): Promise<ExecutiveDependency[]> {
    const network = await this.assemble(companyId);
    const node = network.nodes.find((n) => n.executiveId === executiveId);
    return node?.dependencies ?? [];
  }

  async getTrustEdges(companyId: string, executiveId: string): Promise<ExecutiveTrustEdge[]> {
    const network = await this.assemble(companyId);
    const node = network.nodes.find((n) => n.executiveId === executiveId);
    return node?.trustEdges ?? [];
  }

  async recordCollaboration(
    input: Omit<ExecutiveCollaborationRecord, "collaborationId" | "occurredAt">,
  ): Promise<ExecutiveCollaborationRecord> {
    const record: ExecutiveCollaborationRecord = {
      collaborationId: `collab-${Date.now()}`,
      occurredAt: new Date().toISOString(),
      ...input,
    };
    this.collaborations.set(record.collaborationId, record);
    await this.events.publish("executive.network.collaboration", input.companyId, record, {
      correlationId: input.correlationId,
    });
    return record;
  }

  async getCollaborationHistory(
    companyId: string,
    filters?: { executiveId?: string },
  ): Promise<ExecutiveCollaborationRecord[]> {
    return [...this.collaborations.values()].filter((c) => {
      if (c.companyId !== companyId) return false;
      if (filters?.executiveId && !c.participantIds.includes(filters.executiveId)) return false;
      return true;
    });
  }

  async getCoverage(companyId: string): Promise<ExecutiveCoverage[]> {
    const network = await this.assemble(companyId);
    return network.nodes.map((n) => n.coverage);
  }
}

function specDomainsGrouped() {
  const domainMap = new Map<string, string[]>();
  for (const id of PHASE_D_EXECUTIVE_IDS) {
    for (const d of EXECUTIVE_SPECIALIZATIONS[id]!.domains) {
      const list = domainMap.get(d) ?? [];
      list.push(id);
      domainMap.set(d, list);
    }
  }
  return [...domainMap.entries()]
    .filter(([, ids]) => ids.length > 1)
    .map(([domain, executiveIds]) => ({ domain, executiveIds }));
}
