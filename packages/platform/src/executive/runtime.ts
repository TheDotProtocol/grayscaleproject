import type { ExecutiveCapability } from "./capabilities.js";
import type { ExecutiveLifecycleState } from "./lifecycle.js";
import type { CompanyContext } from "./context.js";
import type { CreateExecutiveOutputInput, ExecutiveOutput } from "./explainability.js";
import type { ExecutiveInboxItem, CreateInboxItemInput, InboxSummary } from "./inbox.js";
import type { ExecutivePermission } from "./permissions.js";

/** Executive identity — metadata only, no personality */

export interface ExecutiveIdentity {
  id: string;
  name: string;
  title: string;
  department: string;
  description: string;
}

export interface ExecutiveHealth {
  executiveId: string;
  instanceId: string;
  lifecycleState: ExecutiveLifecycleState;
  healthy: boolean;
  lastContextAt?: string;
  lastActivityAt?: string;
  pendingMessages: number;
  blockedItems: number;
  issues: string[];
}

export interface ExecutiveInstance {
  id: string;
  companyId: string;
  executiveId: string;
  lifecycleState: ExecutiveLifecycleState;
  capabilities: ExecutiveCapability[];
  permissions: ExecutivePermission[];
  metadata: Record<string, unknown>;
  lastContextAt?: string;
  lastActivityAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InitializeExecutiveInput {
  companyId: string;
  executiveId: string;
  capabilities?: ExecutiveCapability[];
  permissions?: ExecutivePermission[];
  metadata?: Record<string, unknown>;
}

export interface ExecutionRequest {
  companyId: string;
  instanceId: string;
  executiveId: string;
  requestType: string;
  payload: Record<string, unknown>;
  correlationId: string;
  traceId?: string;
  requiresApproval?: boolean;
}

export interface ExecutiveRuntimePort {
  isEnabled(): boolean;
  initialize(input: InitializeExecutiveInput): Promise<ExecutiveInstance>;
  getInstance(companyId: string, executiveId: string): Promise<ExecutiveInstance | null>;
  listInstances(companyId: string): Promise<ExecutiveInstance[]>;
  injectContext(instanceId: string): Promise<CompanyContext>;
  transition(instanceId: string, toState: ExecutiveLifecycleState, reason: string): Promise<ExecutiveInstance>;
  getHealth(instanceId: string): Promise<ExecutiveHealth>;
  submitExecutionRequest(request: ExecutionRequest): Promise<{ accepted: boolean; reason: string }>;
  recordOutput(input: CreateExecutiveOutputInput): Promise<ExecutiveOutput>;
}

export interface ExecutiveInboxPort {
  enqueue(input: CreateInboxItemInput): Promise<ExecutiveInboxItem>;
  move(itemId: string, toQueue: ExecutiveInboxItem["queue"]): Promise<ExecutiveInboxItem>;
  list(instanceId: string, queue?: ExecutiveInboxItem["queue"]): Promise<ExecutiveInboxItem[]>;
  summary(instanceId: string): Promise<InboxSummary>;
}
