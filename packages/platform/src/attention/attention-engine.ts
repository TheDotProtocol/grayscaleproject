/** Organizational Attention Engine — contracts (Sprint 3 Phase B, ADR-038) */

export const ATTENTION_ENGINE_VERSION = "1.0.0";

export interface AttentionAllocation {
  domain: string;
  weight: number;
  executiveId?: string;
  projectId?: string;
  departmentId?: string;
}

export interface AttentionPriority {
  id: string;
  label: string;
  weight: number;
  source: "intent" | "goal" | "signal" | "founder" | "council";
}

export interface AttentionBudget {
  totalCapacity: number;
  allocated: number;
  remaining: number;
  unit: "cognitive_slots";
}

export interface AttentionSaturation {
  level: number;
  status: "healthy" | "elevated" | "critical" | "overload";
}

export interface AttentionDebt {
  deferredItems: number;
  oldestDeferredDays: number;
  domains: string[];
}

export interface AttentionDrift {
  declaredFocus: string[];
  actualFocus: string[];
  driftScore: number;
  detectedAt: string;
}

export interface ExecutiveAttention {
  executiveId: string;
  allocatedWeight: number;
  openIssues: number;
  meetingLoad: number;
}

export interface DepartmentAttention {
  departmentId: string;
  allocatedWeight: number;
  congestion: number;
}

export interface ProjectAttention {
  projectId: string;
  allocatedWeight: number;
  priorityRank: number;
}

export interface MeetingLoad {
  hoursScheduled: number;
  hoursRemaining: number;
  loadRatio: number;
}

export interface CommunicationLoad {
  pendingMessages: number;
  councilSessions: number;
  loadRatio: number;
}

export interface DecisionCongestion {
  openDecisions: number;
  pendingCouncilIssues: number;
  congestionScore: number;
}

export interface ContextSwitching {
  switchesLast24h: number;
  averageFocusDurationMinutes: number;
}

export interface StrategicFocus {
  themes: string[];
  coveragePercent: number;
}

export interface OperationalNoise {
  noiseScore: number;
  sources: string[];
}

export interface AttentionTrend {
  direction: "increasing" | "stable" | "decreasing";
  domain: string;
  delta: number;
}

/** Contract only — implementation in Sprint 3 Phase C Digital Twin */
export interface AttentionForecast {
  horizonDays: number;
  projectedSaturation: number;
  assumptions: string[];
  generatedAt: string;
}

export interface AttentionInsights {
  summary: string;
  recommendations: string[];
  driftWarnings: string[];
}

export interface OrganizationalAttention {
  companyId: string;
  assembledAt: string;
  version: string;
  allocations: AttentionAllocation[];
  priorities: AttentionPriority[];
  budget: AttentionBudget;
  saturation: AttentionSaturation;
  debt: AttentionDebt;
  drift?: AttentionDrift;
  executiveAttention: ExecutiveAttention[];
  strategicFocus: StrategicFocus;
  operationalNoise: OperationalNoise;
  decisionCongestion: DecisionCongestion;
  contextSwitching: ContextSwitching;
  meetingLoad: MeetingLoad;
  communicationLoad: CommunicationLoad;
  trends: AttentionTrend[];
  insights: AttentionInsights;
  forecast?: AttentionForecast;
}

export interface AttentionSnapshot {
  companyId: string;
  capturedAt: string;
  attention: OrganizationalAttention;
  correlationId: string;
}

export interface AttentionHealth {
  companyId: string;
  score: number;
  saturation: AttentionSaturation;
  driftDetected: boolean;
  assessedAt: string;
}

export interface OrganizationalAttentionEnginePort {
  assemble(companyId: string): Promise<OrganizationalAttention>;
  getSnapshot(companyId: string): Promise<AttentionSnapshot>;
  getHealth(companyId: string): Promise<AttentionHealth>;
}
