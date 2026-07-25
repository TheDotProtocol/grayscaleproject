import { describe, it, expect } from "vitest";
import { GraphValidationService } from "./graph-validation.service";
import type { GraphNode } from "@grayscale/platform";

const baseNode = (overrides: Partial<GraphNode>): GraphNode => ({
  id: "n-1",
  companyId: "co-1",
  nodeType: "memory",
  displayName: "Test",
  lifecycleStatus: "active",
  source: "event",
  schemaVersion: 1,
  version: 1,
  metadata: {},
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

describe("GraphValidationService", () => {
  const validation = new GraphValidationService();

  it("allows CREATED from user to memory", async () => {
    const result = await validation.validateEdge(
      "co-1",
      baseNode({ id: "u-1", nodeType: "user" }),
      baseNode({ id: "m-1", nodeType: "memory" }),
      "CREATED",
    );
    expect(result.valid).toBe(true);
  });

  it("rejects self-referencing edges", async () => {
    const node = baseNode({ id: "same" });
    const result = await validation.validateEdge("co-1", node, node, "RELATED_TO");
    expect(result.valid).toBe(false);
  });

  it("allows DEPENDS_ON from task to task", async () => {
    const result = await validation.validateEdge(
      "co-1",
      baseNode({ id: "t-1", nodeType: "task" }),
      baseNode({ id: "t-2", nodeType: "task" }),
      "DEPENDS_ON",
    );
    expect(result.valid).toBe(true);
  });

  it("allows REQUIRES from plugin to integration", async () => {
    const result = await validation.validateEdge(
      "co-1",
      baseNode({ id: "p-1", nodeType: "plugin" }),
      baseNode({ id: "i-1", nodeType: "integration" }),
      "REQUIRES",
    );
    expect(result.valid).toBe(true);
  });

  it("allows SUPPORTS from document to decision", async () => {
    const result = await validation.validateEdge(
      "co-1",
      baseNode({ id: "d-1", nodeType: "document" }),
      baseNode({ id: "dec-1", nodeType: "decision" }),
      "SUPPORTS",
    );
    expect(result.valid).toBe(true);
  });
});
