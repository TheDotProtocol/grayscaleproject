import type { PlatformEvent } from "../events/envelope.js";
import type { OperatorIdentityProfile } from "./identity-engine.js";
import type { ExecutiveCognitiveProfile } from "./cognitive-model.js";
import type { DiscoverySnapshot } from "./discovery-engine.js";
import type { OrganizationalIntelligenceContext } from "../organization/context.js";
import type { IntentContext } from "../intent/intent-engine.js";
import type { TemporalIntelligenceContext } from "../temporal/temporal-engine.js";
import type { OrganizationalSignalSnapshot } from "../signals/signal-bus.js";
import type { OrganizationalInsightSnapshot } from "../insights/insight-engine.js";
import type { ContextRuntimeMetadata } from "../context-runtime/runtime.js";
import type { FounderConstitutionContext } from "./founder-constitution.js";
import type { MemoryRecord } from "../memory/types.js";
import type { GraphSummary } from "../graph/ports.js";
import type { StrategicIntelligenceContext } from "../intelligence/context.js";
import type { CompanyOperatingMode } from "../intelligence/types.js";

/** Unified company context — the only input future executives receive */

export interface CompanyProfile {
  id: string;
  name: string;
  slug: string;
  stage: string;
  industry?: string;
  metadata: Record<string, unknown>;
}

export interface FounderProfileContext {
  userId: string;
  name: string;
  email: string;
  bio?: string;
  timezone: string;
  preferences: Record<string, unknown>;
}

export interface ProjectSummary {
  id: string;
  name: string;
  status: string;
  source: "graph" | "legacy";
}

export interface TaskSummary {
  id: string;
  title: string;
  status: string;
  projectId?: string;
}

export interface BillSummary {
  id: string;
  name: string;
  amountCents: number;
  currency: string;
  dueDate: string;
  isPaid: boolean;
  category?: string;
}

export interface CashPosition {
  totalUnpaidCents: number;
  totalOverdueCents: number;
  currency: string;
  runwayMonths?: number;
}

export interface PulseSummary {
  recentCount: number;
  healthScore: number;
  categories: Record<string, number>;
}

export interface MissionStatus {
  activeGoals: number;
  openRecommendations: number;
  pendingDecisions: number;
  blockedObjectives: number;
  criticalRisks: number;
}

export interface PluginStatus {
  id: string;
  name: string;
  version: string;
  hooks: string[];
  source: string;
}

export interface InfrastructureStatus {
  databaseConnected: boolean;
  eventStoreHealthy: boolean;
  graphNodeCount: number;
  memoryRecordCount: number;
}

export interface SecurityStatus {
  executivesEnabled: boolean;
  activeIntegrations: number;
  disconnectedIntegrations: number;
}

export interface IntegrationStatus {
  id: string;
  provider: string;
  status: string;
  lastSyncAt?: string;
}

export interface TimelineEntry {
  id: string;
  title: string;
  description?: string;
  occurredAt: string;
  category?: string;
}

export interface CompanyContext {
  companyId: string;
  assembledAt: string;
  correlationId: string;

  company: CompanyProfile;
  founder?: FounderProfileContext;
  operatingMode: CompanyOperatingMode;

  goals: StrategicIntelligenceContext["goals"];
  objectives: StrategicIntelligenceContext["objectives"];
  projects: ProjectSummary[];
  tasks: TaskSummary[];

  timeline: TimelineEntry[];
  memory: MemoryRecord[];
  graph: GraphSummary;
  strategy: StrategicIntelligenceContext;

  recommendations: StrategicIntelligenceContext["openRecommendations"];
  decisions: StrategicIntelligenceContext["pendingDecisions"];
  risks: StrategicIntelligenceContext["topRisks"];
  opportunities: StrategicIntelligenceContext["topOpportunities"];

  bills: BillSummary[];
  cashPosition: CashPosition;

  pulse: PulseSummary;
  missionStatus: MissionStatus;
  plugins: PluginStatus[];

  infrastructure: InfrastructureStatus;
  security: SecurityStatus;
  integrations: IntegrationStatus[];

  recentEvents: PlatformEvent[];

  /** Sprint 2 — assembled by platform, read-only to executives (ADR-014) */
  identity?: OperatorIdentityProfile;
  cognitiveModel?: ExecutiveCognitiveProfile;
  discovery?: DiscoverySnapshot;

  /** Sprint 2 Phase A.2 — organizational intelligence (ADR-015–022) */
  organizationalIntelligence?: OrganizationalIntelligenceContext;

  /** Sprint 2 Phase A.4 — intent, temporal, signals, insights (ADR-023–027) */
  intent?: IntentContext;
  temporal?: TemporalIntelligenceContext;
  signals?: OrganizationalSignalSnapshot;
  insights?: OrganizationalInsightSnapshot;
  contextRuntime?: ContextRuntimeMetadata;

  /** Founder Constitution — immutable principles inherited by all executives */
  founderConstitution?: FounderConstitutionContext;

  /** Sprint 3 Phase B — organizational attention (read-only to executives) */
  attention?: import("../attention/attention-engine.js").OrganizationalAttention;

  /** Sprint 3 Phase B / ONS — alias and derived read-only snapshots */
  organizationalAttention?: import("../attention/attention-engine.js").OrganizationalAttention;
  attentionHealth?: import("../attention/attention-engine.js").AttentionHealth;

  /** Sprint 3 Phase C — Living Organizational Twin (read-only to executives) */
  twin?: import("../twin/twin-model.js").OrganizationalTwin;

  /** Sprint 3 Phase B / ONS — alias and derived twin snapshots */
  organizationalTwin?: import("../twin/twin-model.js").OrganizationalTwin;
  twinHealth?: import("../twin/twin-model.js").TwinHealth;
  twinState?: import("../twin/twin-model.js").TwinPresentState;

  /** Sprint 3 Phase B / ONS — signal correlation snapshot */
  signalCorrelation?: import("../signals/signal-correlation.js").SignalCorrelationSnapshot;

  /** Sprint 3 Phase B / ONS — organizational homeostasis */
  homeostasis?: import("../homeostasis/homeostasis-engine.js").OrganizationalHomeostasis;

  /** Sprint 3 Phase B / ONS — alias */
  organizationalHomeostasis?: import("../homeostasis/homeostasis-engine.js").OrganizationalHomeostasis;

  /** Sprint 3 Phase C — simulation context (read-only, assembled) */
  simulation?: import("../simulation/simulation-runtime-ports.js").SimulationContextSnapshot;
  activeSimulations?: import("../simulation/simulation-engine.js").SimulationHistoryEntry[];
  simulationHealth?: import("../simulation/simulation-runtime-ports.js").SimulationHealth;
  simulationHistory?: import("../simulation/simulation-engine.js").SimulationHistoryEntry[];
  simulationCapabilities?: import("../simulation/simulation-runtime-ports.js").SimulationCapabilities;
  simulationMetrics?: { totalSessions: number; completedSessions: number; averageDurationMs: number };

  /** Sprint 3 Phase D — organizational reasoning stack (read-only, assembled) */
  foresight?: import("../foresight/foresight-engine.js").OrganizationalForesight;
  organizationalForesight?: import("../foresight/foresight-engine.js").OrganizationalForesight;
  antifragility?: import("../antifragility/antifragility-engine.js").OrganizationalAntifragility;
  decisionEconomy?: import("../decision-economy/decision-economy-engine.js").OrganizationalDecisionEconomy;
  alignment?: import("../alignment/alignment-engine.js").OrganizationalAlignment;
  organizationalAlignment?: import("../alignment/alignment-engine.js").OrganizationalAlignment;
  scenarioPlanning?: import("../scenario/scenario-planning.js").ScenarioPlanningSnapshot;
  forecast?: import("../forecast/forecast-engine.js").ForecastContextSnapshot;
  forecastContext?: import("../forecast/forecast-engine.js").ForecastContextSnapshot;

  /** Sprint 3 Phase A alignment — read-only council snapshots (assembled from runtime, not duplicated) */
  executiveCouncil?: import("../council/context-snapshot.js").ExecutiveCouncilSnapshot;
  councilHealth?: import("../council/governance.js").CouncilHealth;
  activeCouncilSessions?: import("../council/context-snapshot.js").CouncilSessionSummary[];
  organizationalConsensus?: import("../council/context-snapshot.js").OrganizationalConsensusSummary[];
  pendingVotes?: import("../council/context-snapshot.js").PendingVoteSummary[];
}

export interface CompanyContextAssemblerPort {
  assemble(companyId: string, options?: { correlationId?: string; founderUserId?: string }): Promise<CompanyContext>;
}
