/** Graph analytics — interfaces only (Sprint 2+) */
export interface GraphAnalyticsPort {
  centrality(companyId: string, nodeId: string): Promise<number>;
  hubDetection(companyId: string, limit?: number): Promise<{ nodeId: string; degree: number }[]>;
  relationshipDensity(companyId: string): Promise<number>;
  communityDetection(companyId: string): Promise<{ communityId: string; nodeIds: string[] }[]>;
  knowledgeCoverage(companyId: string): Promise<number>;
  riskClusters(companyId: string): Promise<{ clusterId: string; nodeIds: string[]; reason: string }[]>;
}

export interface GraphAnalyticsSnapshot {
  companyId: string;
  computedAt: string;
  centralityTop: { nodeId: string; score: number }[];
  density: number;
  coverage: number;
}
