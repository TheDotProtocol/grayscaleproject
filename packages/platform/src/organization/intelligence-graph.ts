/** Organizational Intelligence Graph — org-owned concepts (Sprint 4) */

export const ORG_INTELLIGENCE_NODE_TYPES = [
  "knowledge",
  "learning",
  "wisdom",
  "attention",
  "capacity",
  "trust",
  "identity",
  "evolution",
  "reflection",
  "autonomy",
] as const;

export type OrgIntelligenceNodeType = (typeof ORG_INTELLIGENCE_NODE_TYPES)[number];

export interface OrgIntelligenceNode {
  nodeId: string;
  companyId: string;
  type: OrgIntelligenceNodeType;
  label: string;
  sourceEngineId: string;
  sourceRecordId: string;
  version: number;
  createdAt: string;
}

export interface OrgIntelligenceEdge {
  edgeId: string;
  companyId: string;
  fromNodeId: string;
  toNodeId: string;
  relationship: string;
  evidenceBacked: boolean;
  createdAt: string;
}

export interface OrgIntelligenceGraph {
  companyId: string;
  nodes: OrgIntelligenceNode[];
  edges: OrgIntelligenceEdge[];
  assembledAt: string;
}

export interface OrgIntelligenceGraphPort {
  upsertNode(input: Omit<OrgIntelligenceNode, "nodeId" | "createdAt">): Promise<OrgIntelligenceNode>;
  linkNodes(input: Omit<OrgIntelligenceEdge, "edgeId" | "createdAt">): Promise<OrgIntelligenceEdge>;
  assemble(companyId: string): Promise<OrgIntelligenceGraph>;
}
