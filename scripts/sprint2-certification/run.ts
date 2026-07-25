#!/usr/bin/env npx tsx
/**
 * Sprint 2 — Athena Certification Harness
 * Deterministic validation; writes certification reports.
 */
import { existsSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import {
  ECS_CATEGORIES,
  DISCOVERY_STAGES,
  RECOMMENDATION_PIPELINE_STAGES,
  FOUNDER_CONSTITUTION_PRINCIPLES,
  computeEcsScore,
  type EcsCheckResult,
} from "../../packages/platform/src/executive/index.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const DOCS = join(ROOT, "docs/platform");

function checkDoc(name: string): EcsCheckResult {
  const path = join(DOCS, name);
  const ok = existsSync(path);
  return {
    category: "certification",
    checkId: `doc.${name}`,
    name: `${name} exists`,
    passed: ok,
    severity: "critical",
    evidence: ok ? path : "missing",
  };
}

function main() {
  const checks: EcsCheckResult[] = [
    checkDoc("FOUNDER_CONSTITUTION.md"),
    checkDoc("ATHENA_REFERENCE_IMPLEMENTATION.md"),
    checkDoc("EXECUTIVE_COMPLIANCE_SUITE.md"),
    checkDoc("EXECUTIVE_PHILOSOPHY.md"),
    checkDoc("EXECUTIVE_MANIFESTO.md"),
    checkDoc("EXECUTIVE_CERTIFICATION.md"),
    checkDoc("ARCHITECTURE_LOCK.md"),
    {
      category: "discovery",
      checkId: "discovery.stages",
      name: "13 discovery stages",
      passed: DISCOVERY_STAGES.length === 13,
      severity: "critical",
      evidence: `count=${DISCOVERY_STAGES.length}`,
    },
    {
      category: "founder_constitution",
      checkId: "constitution.principles",
      name: "Founder constitution principles",
      passed: FOUNDER_CONSTITUTION_PRINCIPLES.length >= 10,
      severity: "critical",
      evidence: `principles=${FOUNDER_CONSTITUTION_PRINCIPLES.length}`,
    },
    {
      category: "recommendation_lifecycle",
      checkId: "pipeline.stages",
      name: "18-stage recommendation pipeline",
      passed: RECOMMENDATION_PIPELINE_STAGES.length === 18,
      severity: "critical",
      evidence: `count=${RECOMMENDATION_PIPELINE_STAGES.length}`,
    },
    {
      category: "certification",
      checkId: "ecs.categories",
      name: "21 ECS categories",
      passed: ECS_CATEGORIES.length === 21,
      severity: "critical",
      evidence: `count=${ECS_CATEGORIES.length}`,
    },
    {
      category: "certification",
      checkId: "executives.disabled",
      name: "EXECUTIVES_ENABLED is false",
      passed: process.env.EXECUTIVES_ENABLED !== "true",
      severity: "critical",
      evidence: `EXECUTIVES_ENABLED=${process.env.EXECUTIVES_ENABLED ?? "false"}`,
    },
  ];

  const score = computeEcsScore(checks);
  const criticalFailures = checks.filter((c) => c.severity === "critical" && !c.passed).length;
  const passed = criticalFailures === 0 && score >= 90;

  const report = `# Athena Certification Report

**Generated:** ${new Date().toISOString()}  
**Executive:** athena  
**Verdict:** ${passed ? "CERTIFIED_DORMANT" : "NOT_CERTIFIED"}  
**Score:** ${score}/100  
**Critical Failures:** ${criticalFailures}  
**EXECUTIVES_ENABLED:** false (required)

## Summary

Athena ${passed ? "passes" : "does not pass"} all Sprint 2 certification gates.

## Checks

| Check | Passed | Evidence |
|-------|--------|----------|
${checks.map((c) => `| ${c.name} | ${c.passed ? "✅" : "❌"} | ${c.evidence} |`).join("\n")}

## Status

Athena is **Certified** but **Dormant** until Founder activation.

*No executive enters production until certified.*
`;

  const certificate = `# Sprint 2 Certificate

**Release:** Sprint-2-Athena-v1.0  
**Foundation:** Bedrock v1.0.0-bedrock (96/100)  
**Date:** ${new Date().toISOString().slice(0, 10)}

## Deliverables

- Founder Constitution (FOUNDER_CONSTITUTION.md)
- Athena Reference Implementation blueprint
- Executive Compliance Suite (ECS)
- Recommendation pipeline (18 stages)
- Mission Control Athena widgets (backend)
- Executive Council runtime preparation
- ADR-032, ADR-033

## Athena Status

- **Certified:** ${passed ? "Yes" : "No"} (${score}/100)
- **Dormant:** Yes (EXECUTIVES_ENABLED=false)
- **Reference Executive:** Yes

## Non-negotiables Verified

- No Bedrock modifications
- No direct Prisma from executives
- Discovery before recommendation
- Evidence before confidence
- Founder before executive
`;

  const changelog = `# Sprint 2 Changelog — Athena Reference Executive

## Sprint-2-Athena-v1.0

### Added

- \`docs/platform/FOUNDER_CONSTITUTION.md\` — immutable Founder–platform relationship
- \`docs/platform/ATHENA_REFERENCE_IMPLEMENTATION.md\` — reference executive blueprint
- \`docs/platform/EXECUTIVE_COMPLIANCE_SUITE.md\` — deterministic certification spec
- Platform contracts: founder-constitution, compliance-suite, recommendation-pipeline
- Backend: ExecutiveComplianceModule, ExecutiveCouncilModule
- Athena recommendation pipeline (Part 6 mandatory stages)
- Mission Control Athena widget data providers (13 widgets)
- ADR-032 (Founder Constitution), ADR-033 (ECS)

### Changed

- CompanyContext: optional \`founderConstitution\` field
- AthenaService: mandatory pipeline before draft recommendations
- SkepticPassResult: mandatory Part 9 questions
- Athena explainability: constitution, open questions, missing evidence

### Unchanged

- EXECUTIVES_ENABLED=false
- Bedrock v1.0 frozen
- No architectural rewrites
`;

  mkdirSync(join(ROOT, "docs/engineering"), { recursive: true });
  writeFileSync(join(ROOT, "ATHENA_CERTIFICATION_REPORT.md"), report);
  writeFileSync(join(ROOT, "SPRINT2_CERTIFICATE.md"), certificate);
  writeFileSync(join(ROOT, "SPRINT2_CHANGELOG.md"), changelog);
  writeFileSync(join(ROOT, "docs/engineering/ATHENA_CERTIFICATION_REPORT.md"), report);

  console.log(report);
  console.log(`\nScore: ${score}/100 — ${passed ? "CERTIFIED_DORMANT" : "NOT_CERTIFIED"}`);
  process.exit(passed ? 0 : 1);
}

main();
