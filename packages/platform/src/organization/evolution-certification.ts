/** Organizational Evolution Certification — Sprint 4 */

export const EVOLUTION_ECS_GATES = [
  "memory_evolution_integrity",
  "learning_integrity",
  "wisdom_integrity",
  "strategy_evolution_integrity",
  "reflection_integrity",
  "autonomy_compliance",
  "founder_constitution_compliance",
  "architecture_compliance",
  "replay_consistency",
  "version_integrity",
  "reality_preservation",
  "twin_synchronization",
] as const;

export type EvolutionEcsGate = (typeof EVOLUTION_ECS_GATES)[number];

export interface EvolutionCertCheck {
  gate: EvolutionEcsGate;
  checkId: string;
  name: string;
  passed: boolean;
  evidence: string;
}

export interface EvolutionCertificationReport {
  companyId: string;
  generatedAt: string;
  passed: boolean;
  score: number;
  checks: EvolutionCertCheck[];
}

export function computeEvolutionCertScore(checks: EvolutionCertCheck[]): number {
  if (checks.length === 0) return 0;
  const passed = checks.filter((c) => c.passed).length;
  return Math.round((passed / checks.length) * 100);
}

export function isEvolutionCertified(report: EvolutionCertificationReport): boolean {
  return report.score >= 90 && report.checks.every((c) => c.passed || !isCriticalGate(c.gate));
}

function isCriticalGate(gate: EvolutionEcsGate): boolean {
  return [
    "memory_evolution_integrity",
    "reality_preservation",
    "founder_constitution_compliance",
    "architecture_compliance",
    "twin_synchronization",
  ].includes(gate);
}
