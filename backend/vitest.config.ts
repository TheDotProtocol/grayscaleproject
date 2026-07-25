import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.spec.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      include: ["src/modules/auth/**", "src/modules/pulse/**"],
    },
  },
  resolve: {
    alias: {
      "@grayscale/shared": path.resolve(__dirname, "../packages/shared/src/index.ts"),
    },
  },
});
