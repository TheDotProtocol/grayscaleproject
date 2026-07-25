/** Platform Readiness Report — AIP-38 (expanded) */

export const READINESS_SECTION_IDS = [
  "engineering",
  "operations",
  "security",
  "scalability",
  "mission_control",
  "documentation",
  "testing",
  "architecture",
  "performance",
  "recovery",
  "governance",
  "platform_evolution",
] as const;

export type ReadinessSectionId = (typeof READINESS_SECTION_IDS)[number];

export type ReadinessSectionStatus = "pass" | "warn" | "fail";
export type PlatformReadinessVerdict = "READY FOR SPRINT 2" | "NOT READY";

export interface ReadinessCriterion {
  id: string;
  description: string;
  status: ReadinessSectionStatus;
  evidence: string;
}

export interface ReadinessSection {
  id: ReadinessSectionId;
  name: string;
  score: number;
  status: ReadinessSectionStatus;
  criteria: ReadinessCriterion[];
}

export interface ReadinessBlocker {
  id: string;
  severity: "critical" | "major";
  title: string;
  remediation: string;
}

export interface PlatformReadinessReport {
  id: string;
  version: number;
  generatedAt: string;
  verdict: PlatformReadinessVerdict;
  sections: ReadinessSection[];
  blockers: ReadinessBlocker[];
  overallScore: number;
  minimumScore: number;
  executiveCertificationRequired: boolean;
}

export interface ReadinessReportPort {
  generate(): Promise<PlatformReadinessReport>;
  getLatest(): Promise<PlatformReadinessReport | null>;
  getById(id: string): Promise<PlatformReadinessReport | null>;
}
