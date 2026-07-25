import type { ExecutivePermissionAction } from "./permissions.js";

/** Executive capability framework — declarative, composable */

export const EXECUTIVE_CAPABILITIES = [
  "ReadMemory",
  "ReadGraph",
  "ReadStrategy",
  "ReadContext",
  "CreateRecommendation",
  "ApproveDecision",
  "RejectDecision",
  "CreateGoal",
  "UpdateObjective",
  "SendNotification",
  "ScheduleMeeting",
  "ReadEvents",
  "PublishEvent",
  "RequestApproval",
  "DelegateTask",
  "EscalateIssue",
] as const;

export type ExecutiveCapability = (typeof EXECUTIVE_CAPABILITIES)[number];

export interface CapabilityDeclaration {
  capability: ExecutiveCapability;
  description: string;
  requiredPermissions: ExecutivePermissionAction[];
  version: number;
}

export interface ExecutiveCapabilityRegistryPort {
  register(executiveId: string, capabilities: CapabilityDeclaration[]): void;
  list(executiveId: string): CapabilityDeclaration[];
  has(executiveId: string, capability: ExecutiveCapability): boolean;
  discover(companyId: string): { executiveId: string; capabilities: ExecutiveCapability[] }[];
}
