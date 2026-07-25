/** Security Observatory — AIP-40 */

export const SECURITY_FINDING_TYPES = [
  "auth_failure",
  "authz_failure",
  "token_misuse",
  "rate_limit_violation",
  "credential_rotation",
  "sandbox_violation",
  "dependency_vulnerability",
  "secret_expiration",
  "csp_violation",
  "audit_integrity",
] as const;

export type SecurityFindingType = (typeof SECURITY_FINDING_TYPES)[number];

export interface SecurityFinding {
  id: string;
  type: SecurityFindingType;
  severity: "info" | "warning" | "error" | "critical";
  title: string;
  description: string;
  count: number;
  evidence: Record<string, unknown>;
  detectedAt: string;
}

export interface SecurityHealthSnapshot {
  score: number;
  status: "secure" | "attention" | "compromised";
  findings: SecurityFinding[];
  computedAt: string;
}

export interface SecurityObservatoryPort {
  assess(companyId?: string): Promise<SecurityHealthSnapshot>;
}
