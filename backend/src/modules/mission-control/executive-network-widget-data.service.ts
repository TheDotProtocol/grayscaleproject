import { Injectable } from "@nestjs/common";
import { ExecutiveNetworkService } from "../executive-network/executive-network.service";
import { CouncilCollaborationService } from "../council-runtime/council-collaboration.service";
import { OrganizationalTwinService } from "../twin-runtime/organizational-twin.service";
import { CouncilWidgetDataService } from "./council-widget-data.service";

@Injectable()
export class ExecutiveNetworkWidgetDataService {
  constructor(
    private readonly network: ExecutiveNetworkService,
    private readonly collaboration: CouncilCollaborationService,
    private readonly twin: OrganizationalTwinService,
    private readonly council: CouncilWidgetDataService,
  ) {}

  getNetworkOverview(companyId: string) {
    return this.network.assemble(companyId);
  }

  getHealth(companyId: string) {
    return this.network.assemble(companyId).then((n) =>
      n.nodes.map((node) => ({ executiveId: node.executiveId, certified: node.certified, state: node.lifecycleState })),
    );
  }

  getTrust(companyId: string) {
    return this.network.assemble(companyId).then((n) => n.nodes.flatMap((node) => node.trustEdges));
  }

  getParticipation(companyId: string) {
    return this.collaboration.getParticipation(companyId);
  }

  getConfidence(companyId: string) {
    return this.collaboration.getParticipation(companyId).then((p) =>
      p.map((x) => ({ executiveId: x.executiveId, confidence: x.averageConfidence })),
    );
  }

  getWorkload(companyId: string) {
    return this.collaboration.getParticipation(companyId).then((p) =>
      p.map((x) => ({ executiveId: x.executiveId, sessions: x.sessionsParticipated, votes: x.votesCast })),
    );
  }

  getRelationships(companyId: string) {
    return this.network.assemble(companyId).then((n) => n.nodes.map((node) => ({ executiveId: node.executiveId, trust: node.trustEdges })));
  }

  getDependencies(companyId: string) {
    return this.network.assemble(companyId).then((n) => n.nodes.flatMap((node) => node.dependencies));
  }

  getCoverage(companyId: string) {
    return this.network.getCoverage(companyId);
  }

  getCollaboration(companyId: string) {
    return this.collaboration.getMetrics(companyId);
  }

  getConsensus(companyId: string) {
    return this.council.getConsensus(companyId);
  }

  getReplay(companyId: string) {
    return this.council.getHistory(companyId);
  }

  getCapacity(companyId: string) {
    return this.twin.getHealth(companyId);
  }

  getDecisionConfidence(companyId: string) {
    return this.council.getDecisionClassification(companyId);
  }

  getDecisionEvolution(companyId: string) {
    return this.twin.getEvolution(companyId);
  }
}
