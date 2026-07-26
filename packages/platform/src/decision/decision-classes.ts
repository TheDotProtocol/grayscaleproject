/** Organizational Decision Model — decision classification (Sprint 3 Phase B, ADR-036) */

export const DECISION_MODEL_VERSION = "1.0.0";

export const DECISION_CLASSES = [
  "strategic",
  "operational",
  "financial",
  "technology",
  "security",
  "compliance",
  "legal",
  "people",
  "product",
  "customer",
  "infrastructure",
  "emergency",
  "innovation",
  "growth",
  "risk",
  "partnership",
  "investment",
  "acquisition",
  "governance",
] as const;

export type DecisionClass = (typeof DECISION_CLASSES)[number];

export type OrganizationalImpactLevel = "low" | "medium" | "high" | "critical";

export interface DecisionClassRequirements {
  decisionClass: DecisionClass;
  label: string;
  requiredExecutives: string[];
  founderApprovalRequired: boolean;
  councilQuorum: number;
  minimumConfidenceThreshold: number;
  requiredEvidenceTypes: string[];
  requiredExplainability: boolean;
  requiredSimulations: boolean;
  requiredRiskAssessment: boolean;
  requiredRollbackStrategy: boolean;
  automationEligible: boolean;
  auditRetentionDays: number;
  organizationalImpactLevel: OrganizationalImpactLevel;
}

export interface ClassifiedDecision {
  decisionClass: DecisionClass;
  requirements: DecisionClassRequirements;
  classifiedAt: string;
  correlationId: string;
}

export interface OrganizationalDecision {
  id: string;
  companyId: string;
  sessionId: string;
  issueId: string;
  decisionClass: DecisionClass;
  title: string;
  summary: string;
  version: number;
  status: "draft" | "pending_founder" | "approved" | "rejected" | "deferred";
  correlationId: string;
  createdAt: string;
}

/** Deterministic decision class registry — council classifies BEFORE deliberation */
export const DECISION_CLASS_REGISTRY: Record<DecisionClass, DecisionClassRequirements> = {
  strategic: {
    decisionClass: "strategic",
    label: "Strategic",
    requiredExecutives: ["athena"],
    founderApprovalRequired: true,
    councilQuorum: 2,
    minimumConfidenceThreshold: 0.65,
    requiredEvidenceTypes: ["memory", "graph", "strategy"],
    requiredExplainability: true,
    requiredSimulations: false,
    requiredRiskAssessment: true,
    requiredRollbackStrategy: true,
    automationEligible: false,
    auditRetentionDays: 2555,
    organizationalImpactLevel: "critical",
  },
  operational: {
    decisionClass: "operational",
    label: "Operational",
    requiredExecutives: ["athena", "navigator"],
    founderApprovalRequired: false,
    councilQuorum: 2,
    minimumConfidenceThreshold: 0.55,
    requiredEvidenceTypes: ["memory", "signal"],
    requiredExplainability: true,
    requiredSimulations: false,
    requiredRiskAssessment: true,
    requiredRollbackStrategy: true,
    automationEligible: false,
    auditRetentionDays: 1095,
    organizationalImpactLevel: "medium",
  },
  financial: {
    decisionClass: "financial",
    label: "Financial",
    requiredExecutives: ["ledger", "athena"],
    founderApprovalRequired: true,
    councilQuorum: 2,
    minimumConfidenceThreshold: 0.7,
    requiredEvidenceTypes: ["memory", "strategy", "graph"],
    requiredExplainability: true,
    requiredSimulations: false,
    requiredRiskAssessment: true,
    requiredRollbackStrategy: true,
    automationEligible: false,
    auditRetentionDays: 2555,
    organizationalImpactLevel: "high",
  },
  technology: {
    decisionClass: "technology",
    label: "Technology",
    requiredExecutives: ["forge", "sentinel"],
    founderApprovalRequired: false,
    councilQuorum: 2,
    minimumConfidenceThreshold: 0.6,
    requiredEvidenceTypes: ["memory", "graph"],
    requiredExplainability: true,
    requiredSimulations: false,
    requiredRiskAssessment: true,
    requiredRollbackStrategy: true,
    automationEligible: false,
    auditRetentionDays: 1095,
    organizationalImpactLevel: "high",
  },
  security: {
    decisionClass: "security",
    label: "Security",
    requiredExecutives: ["sentinel"],
    founderApprovalRequired: true,
    councilQuorum: 2,
    minimumConfidenceThreshold: 0.75,
    requiredEvidenceTypes: ["memory", "signal", "constraint"],
    requiredExplainability: true,
    requiredSimulations: false,
    requiredRiskAssessment: true,
    requiredRollbackStrategy: true,
    automationEligible: false,
    auditRetentionDays: 2555,
    organizationalImpactLevel: "critical",
  },
  compliance: {
    decisionClass: "compliance",
    label: "Compliance",
    requiredExecutives: ["sentinel", "ledger"],
    founderApprovalRequired: true,
    councilQuorum: 2,
    minimumConfidenceThreshold: 0.75,
    requiredEvidenceTypes: ["policy", "constraint", "memory"],
    requiredExplainability: true,
    requiredSimulations: false,
    requiredRiskAssessment: true,
    requiredRollbackStrategy: true,
    automationEligible: false,
    auditRetentionDays: 2555,
    organizationalImpactLevel: "critical",
  },
  legal: {
    decisionClass: "legal",
    label: "Legal",
    requiredExecutives: ["ledger"],
    founderApprovalRequired: true,
    councilQuorum: 2,
    minimumConfidenceThreshold: 0.8,
    requiredEvidenceTypes: ["memory", "policy"],
    requiredExplainability: true,
    requiredSimulations: false,
    requiredRiskAssessment: true,
    requiredRollbackStrategy: true,
    automationEligible: false,
    auditRetentionDays: 2555,
    organizationalImpactLevel: "critical",
  },
  people: {
    decisionClass: "people",
    label: "People",
    requiredExecutives: ["athena", "navigator"],
    founderApprovalRequired: true,
    councilQuorum: 2,
    minimumConfidenceThreshold: 0.65,
    requiredEvidenceTypes: ["memory"],
    requiredExplainability: true,
    requiredSimulations: false,
    requiredRiskAssessment: true,
    requiredRollbackStrategy: true,
    automationEligible: false,
    auditRetentionDays: 1825,
    organizationalImpactLevel: "high",
  },
  product: {
    decisionClass: "product",
    label: "Product",
    requiredExecutives: ["athena", "forge"],
    founderApprovalRequired: false,
    councilQuorum: 2,
    minimumConfidenceThreshold: 0.6,
    requiredEvidenceTypes: ["memory", "graph", "signal"],
    requiredExplainability: true,
    requiredSimulations: false,
    requiredRiskAssessment: true,
    requiredRollbackStrategy: true,
    automationEligible: false,
    auditRetentionDays: 1095,
    organizationalImpactLevel: "medium",
  },
  customer: {
    decisionClass: "customer",
    label: "Customer",
    requiredExecutives: ["mercury", "athena"],
    founderApprovalRequired: false,
    councilQuorum: 2,
    minimumConfidenceThreshold: 0.6,
    requiredEvidenceTypes: ["memory", "signal"],
    requiredExplainability: true,
    requiredSimulations: false,
    requiredRiskAssessment: true,
    requiredRollbackStrategy: true,
    automationEligible: false,
    auditRetentionDays: 1095,
    organizationalImpactLevel: "medium",
  },
  infrastructure: {
    decisionClass: "infrastructure",
    label: "Infrastructure",
    requiredExecutives: ["forge", "sentinel"],
    founderApprovalRequired: false,
    councilQuorum: 2,
    minimumConfidenceThreshold: 0.65,
    requiredEvidenceTypes: ["memory", "graph"],
    requiredExplainability: true,
    requiredSimulations: false,
    requiredRiskAssessment: true,
    requiredRollbackStrategy: true,
    automationEligible: false,
    auditRetentionDays: 1095,
    organizationalImpactLevel: "high",
  },
  emergency: {
    decisionClass: "emergency",
    label: "Emergency",
    requiredExecutives: ["athena", "sentinel"],
    founderApprovalRequired: true,
    councilQuorum: 1,
    minimumConfidenceThreshold: 0.5,
    requiredEvidenceTypes: ["signal", "memory"],
    requiredExplainability: true,
    requiredSimulations: false,
    requiredRiskAssessment: true,
    requiredRollbackStrategy: true,
    automationEligible: false,
    auditRetentionDays: 2555,
    organizationalImpactLevel: "critical",
  },
  innovation: {
    decisionClass: "innovation",
    label: "Innovation",
    requiredExecutives: ["athena", "forge"],
    founderApprovalRequired: false,
    councilQuorum: 2,
    minimumConfidenceThreshold: 0.55,
    requiredEvidenceTypes: ["memory", "insight"],
    requiredExplainability: true,
    requiredSimulations: true,
    requiredRiskAssessment: true,
    requiredRollbackStrategy: true,
    automationEligible: false,
    auditRetentionDays: 1095,
    organizationalImpactLevel: "medium",
  },
  growth: {
    decisionClass: "growth",
    label: "Growth",
    requiredExecutives: ["athena", "mercury"],
    founderApprovalRequired: true,
    councilQuorum: 2,
    minimumConfidenceThreshold: 0.65,
    requiredEvidenceTypes: ["memory", "strategy", "signal"],
    requiredExplainability: true,
    requiredSimulations: true,
    requiredRiskAssessment: true,
    requiredRollbackStrategy: true,
    automationEligible: false,
    auditRetentionDays: 1825,
    organizationalImpactLevel: "high",
  },
  risk: {
    decisionClass: "risk",
    label: "Risk",
    requiredExecutives: ["athena", "sentinel"],
    founderApprovalRequired: true,
    councilQuorum: 2,
    minimumConfidenceThreshold: 0.7,
    requiredEvidenceTypes: ["memory", "strategy", "constraint"],
    requiredExplainability: true,
    requiredSimulations: false,
    requiredRiskAssessment: true,
    requiredRollbackStrategy: true,
    automationEligible: false,
    auditRetentionDays: 2555,
    organizationalImpactLevel: "critical",
  },
  partnership: {
    decisionClass: "partnership",
    label: "Partnership",
    requiredExecutives: ["athena", "mercury"],
    founderApprovalRequired: true,
    councilQuorum: 2,
    minimumConfidenceThreshold: 0.7,
    requiredEvidenceTypes: ["memory", "graph"],
    requiredExplainability: true,
    requiredSimulations: true,
    requiredRiskAssessment: true,
    requiredRollbackStrategy: true,
    automationEligible: false,
    auditRetentionDays: 1825,
    organizationalImpactLevel: "high",
  },
  investment: {
    decisionClass: "investment",
    label: "Investment",
    requiredExecutives: ["ledger", "athena"],
    founderApprovalRequired: true,
    councilQuorum: 2,
    minimumConfidenceThreshold: 0.75,
    requiredEvidenceTypes: ["memory", "strategy"],
    requiredExplainability: true,
    requiredSimulations: true,
    requiredRiskAssessment: true,
    requiredRollbackStrategy: true,
    automationEligible: false,
    auditRetentionDays: 2555,
    organizationalImpactLevel: "critical",
  },
  acquisition: {
    decisionClass: "acquisition",
    label: "Acquisition",
    requiredExecutives: ["ledger", "athena", "sentinel"],
    founderApprovalRequired: true,
    councilQuorum: 3,
    minimumConfidenceThreshold: 0.8,
    requiredEvidenceTypes: ["memory", "strategy", "graph"],
    requiredExplainability: true,
    requiredSimulations: true,
    requiredRiskAssessment: true,
    requiredRollbackStrategy: true,
    automationEligible: false,
    auditRetentionDays: 2555,
    organizationalImpactLevel: "critical",
  },
  governance: {
    decisionClass: "governance",
    label: "Governance",
    requiredExecutives: ["athena"],
    founderApprovalRequired: true,
    councilQuorum: 2,
    minimumConfidenceThreshold: 0.7,
    requiredEvidenceTypes: ["policy", "constraint", "memory"],
    requiredExplainability: true,
    requiredSimulations: false,
    requiredRiskAssessment: true,
    requiredRollbackStrategy: true,
    automationEligible: false,
    auditRetentionDays: 2555,
    organizationalImpactLevel: "critical",
  },
};

export function classifyDecision(
  decisionClass: DecisionClass,
  correlationId: string,
): ClassifiedDecision {
  return {
    decisionClass,
    requirements: DECISION_CLASS_REGISTRY[decisionClass],
    classifiedAt: new Date().toISOString(),
    correlationId,
  };
}

export function isValidDecisionClass(value: string): value is DecisionClass {
  return (DECISION_CLASSES as readonly string[]).includes(value);
}
