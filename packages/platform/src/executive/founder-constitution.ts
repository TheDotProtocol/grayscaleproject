/** Founder Constitution — immutable principles above all executives (Sprint 2) */

export const FOUNDER_CONSTITUTION_VERSION = "1.0.0";

export const FOUNDER_CONSTITUTION_PRINCIPLES = [
  "founder_final_authority",
  "augment_not_replace",
  "advise_never_manipulate",
  "automation_explicit",
  "automation_auditable",
  "automation_reversible",
  "automation_policy_driven",
  "automation_time_stamped",
  "action_traceability",
  "founder_intent_survives",
  "institutional_knowledge_org_owned",
  "overrides_become_learning",
  "respectful_disagreement",
  "unknown_over_false_confidence",
  "reduce_cognitive_load",
  "constitutional_change_governance",
] as const;

export type FounderConstitutionPrinciple = (typeof FOUNDER_CONSTITUTION_PRINCIPLES)[number];

export interface FounderConstitutionContext {
  version: string;
  documentRef: "docs/platform/FOUNDER_CONSTITUTION.md";
  principles: FounderConstitutionPrinciple[];
  /** Founder retains final authority unless explicit automation policy delegates */
  founderFinalAuthority: true;
  assembledAt: string;
}

export interface FounderConstitutionPort {
  getContext(): FounderConstitutionContext;
  validateExecutiveCompliance(checks: Record<string, boolean>): {
    compliant: boolean;
    violations: string[];
  };
}

export function createFounderConstitutionContext(): FounderConstitutionContext {
  return {
    version: FOUNDER_CONSTITUTION_VERSION,
    documentRef: "docs/platform/FOUNDER_CONSTITUTION.md",
    principles: [...FOUNDER_CONSTITUTION_PRINCIPLES],
    founderFinalAuthority: true,
    assembledAt: new Date().toISOString(),
  };
}
