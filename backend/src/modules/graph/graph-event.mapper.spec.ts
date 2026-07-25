import { describe, it, expect } from "vitest";
import { DOMAIN_EVENTS, createPlatformEvent } from "@grayscale/platform";
import { mapEventToGraphProjection } from "./graph-event.mapper";

describe("mapEventToGraphProjection", () => {
  it("maps memory.created to graph node upsert", () => {
    const event = createPlatformEvent(
      DOMAIN_EVENTS.MEMORY_CREATED,
      "co-1",
      { id: "mem-1", title: "Note", content: "body", source: "manual" },
      { source: "api", userId: "u-1" },
    );
    const results = mapEventToGraphProjection(event);
    const upsert = results.find((r) => r.action === "upsert_node");
    expect(upsert?.action).toBe("upsert_node");
    if (upsert?.action === "upsert_node") {
      expect(upsert.input.nodeType).toBe("memory");
      expect(upsert.input.sourceId).toBe("mem-1");
    }
  });

  it("maps github memory to git_commit node", () => {
    const event = createPlatformEvent(
      DOMAIN_EVENTS.MEMORY_CREATED,
      "co-1",
      { id: "mem-2", title: "GitHub: fix", content: "x", source: "github" },
      { source: "api" },
    );
    const results = mapEventToGraphProjection(event);
    const upsert = results.find((r) => r.action === "upsert_node");
    if (upsert?.action === "upsert_node") {
      expect(upsert.input.nodeType).toBe("git_commit");
    }
  });

  it("maps knowledge node with decision type", () => {
    const event = createPlatformEvent(
      DOMAIN_EVENTS.KNOWLEDGE_NODE_CREATED,
      "co-1",
      {
        id: "kn-1",
        label: "Use PostgreSQL",
        nodeType: "decision",
        content: "Why we chose Postgres",
      },
      { source: "api" },
    );
    const results = mapEventToGraphProjection(event);
    const upsert = results.find((r) => r.action === "upsert_node");
    if (upsert?.action === "upsert_node") {
      expect(upsert.input.nodeType).toBe("decision");
    }
  });

  it("maps integration.connected to integration node", () => {
    const event = createPlatformEvent(
      DOMAIN_EVENTS.INTEGRATION_CONNECTED,
      "co-1",
      { integrationId: "int-1", provider: "github" },
      { source: "integrations" },
    );
    const results = mapEventToGraphProjection(event);
    const upsert = results.find((r) => r.action === "upsert_node");
    if (upsert?.action === "upsert_node") {
      expect(upsert.input.nodeType).toBe("integration");
      expect(upsert.input.sourceId).toBe("int-1");
    }
  });

  it("maps git.commit.received to git_commit node", () => {
    const event = createPlatformEvent(
      DOMAIN_EVENTS.GIT_COMMIT_RECEIVED,
      "co-1",
      { sha: "abc123", message: "fix: auth", url: "https://github.com/x/y/commit/abc123" },
      { source: "integration-platform" },
    );
    const results = mapEventToGraphProjection(event);
    const upsert = results.find((r) => r.action === "upsert_node");
    if (upsert?.action === "upsert_node") {
      expect(upsert.input.nodeType).toBe("git_commit");
    }
  });
});
