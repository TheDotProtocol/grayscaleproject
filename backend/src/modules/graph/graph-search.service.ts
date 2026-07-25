import { Injectable } from "@nestjs/common";
import type { GraphSearchPort, GraphNodeQuery, GraphNode } from "@grayscale/platform";
import { GraphNodeService } from "./graph-node.service";

@Injectable()
export class GraphSearchService implements GraphSearchPort {
  constructor(private readonly nodes: GraphNodeService) {}

  searchNodes(companyId: string, query: GraphNodeQuery): Promise<GraphNode[]> {
    return this.nodes.find(companyId, query);
  }
}
