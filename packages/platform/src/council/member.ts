import type { CouncilRole } from "./constitution.js";
import type { CouncilExecutiveId } from "../executive/executive-council.js";

export interface CouncilMember {
  executiveId: CouncilExecutiveId | string;
  companyId: string;
  roles: CouncilRole[];
  domains: string[];
  votingWeight: number;
  trustScore?: number;
  certified: boolean;
  activeFrom: string;
  activeUntil?: string;
  correlationId: string;
}

export interface CouncilResponsibility {
  id: string;
  companyId: string;
  executiveId: string;
  domain: string;
  scope: string;
  temporary: boolean;
  expiresAt?: string;
  transferredFrom?: string;
  correlationId: string;
  assignedAt: string;
}

export interface CouncilEvolution {
  id: string;
  companyId: string;
  changeType: "add_member" | "remove_member" | "role_change" | "temporary_assignment";
  executiveId: string;
  previousRoles?: CouncilRole[];
  newRoles?: CouncilRole[];
  effectiveAt: string;
  adrRef?: string;
  correlationId: string;
}
