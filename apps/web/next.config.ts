import type { NextConfig } from "next";
import path from "path";
import fs from "fs";

/** Load monorepo root .env into process.env for API routes (DEV_AUTH_*, API_URL) */
function loadRootEnv() {
  const envPath = path.join(__dirname, "../../.env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadRootEnv();

const nextConfig: NextConfig = {
  transpilePackages: ["@grayscale/shared"],
  poweredByHeader: false,
  outputFileTracingIncludes: {
    "/docs": ["../../docs/public/**/*"],
    "/docs/*": ["../../docs/public/**/*"],
  },
};

export default nextConfig;
