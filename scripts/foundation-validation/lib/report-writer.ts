import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

function projectRoot(): string {
  const cwd = process.cwd();
  return cwd.endsWith("backend") ? join(cwd, "..") : cwd;
}

const RESULTS_DIR = join(projectRoot(), "scripts/foundation-validation/results");
const DOCS_DIR = join(projectRoot(), "docs/engineering/validation");

export function ensureDirs() {
  for (const dir of [RESULTS_DIR, DOCS_DIR]) {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  }
}

export function writeJson(name: string, data: unknown) {
  ensureDirs();
  writeFileSync(join(RESULTS_DIR, `${name}.json`), JSON.stringify(data, null, 2));
}

export function writeReport(filename: string, content: string) {
  ensureDirs();
  writeFileSync(join(DOCS_DIR, filename), content);
}

export function verdictBanner(verdict: "FOUNDATION CERTIFIED — READY FOR SPRINT 2" | "NOT CERTIFIED", score: number) {
  const status = verdict.startsWith("FOUNDATION CERTIFIED") ? "✅" : "❌";
  return `
## Final Foundation Verdict

${status} **${verdict}**

**Validation Score:** ${score}/100  
**Generated:** ${new Date().toISOString()}
`;
}
