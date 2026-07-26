/** Twin Explainability — contracts (Sprint 3 Phase B / ONS alignment) */

export interface TwinExplainabilityEvidence {
  source: string;
  sourceType: string;
  summary: string;
  weight: number;
}

export interface TwinExplainability {
  companyId: string;
  versionId: string;
  assembledAt: string;
  evidenceConsidered: TwinExplainabilityEvidence[];
  confidenceBreakdown: Record<string, number>;
  attentionInfluence?: string;
  signalInfluence?: string[];
  councilInfluence?: string;
  founderConstitutionRefs: string[];
  operatingModelRefs: string[];
  rejectedAlternatives: string[];
  rollbackStrategy?: string;
  expectedOrganizationalImpact: string;
}

export interface TwinExplainabilityPort {
  explain(companyId: string, versionId?: string): Promise<TwinExplainability>;
}
