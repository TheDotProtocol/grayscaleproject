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

export type AttentionDomain = string;

export interface AttentionItem {
  id: string;
  label: string;
  domain: AttentionDomain;
  score: number;
  urgency: number;
  source: AttentionPriority["source"];
  evidenceRefs?: string[];
}

export interface AttentionQueue {
  companyId: string;
  items: AttentionItem[];
  capacity: number;
  assembledAt: string;
}

export interface AttentionScore {
  overall: number;
  urgency: number;
  importance: number;
  freshness: number;
  confidence: number;
}

export interface AttentionRule {
  id: string;
  condition: string;
  action: "allocate" | "escalate" | "suppress" | "defer";
  domain?: AttentionDomain;
}

export interface AttentionPolicy {
  companyId: string;
  rules: AttentionRule[];
  escalationThreshold: number;
  version: string;
}

export interface AttentionThreshold {
  domain: AttentionDomain;
  warnAt: number;
  criticalAt: number;
}

export interface AttentionExplanation {
  summary: string;
  factors: Array<{ label: string; weight: number; evidence?: string }>;
  blindSpots?: string[];
  founderInterrupts?: string[];
  executiveInterrupts?: string[];
}

export interface AttentionHistoryEntry {
  capturedAt: string;
  saturationLevel: number;
  topDomains: string[];
  correlationId: string;
}

export interface AttentionHistory {
  companyId: string;
  entries: AttentionHistoryEntry[];
}

export interface AttentionEngineMetrics {
  companyId: string;
  itemsProcessed: number;
  signalsFiltered: number;
  escalationsTriggered: number;
  periodStart: string;
  periodEnd: string;
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
  getQueue?(companyId: string): Promise<AttentionQueue>;
  getHistory?(companyId: string): Promise<AttentionHistory>;
}

/** Alias — ONS specification naming */
export type OrganizationalAttentionPort = OrganizationalAttentionEnginePort;
export type AttentionEngine = OrganizationalAttentionEnginePort;
