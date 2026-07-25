import { describe, it, expect } from "vitest";
import { DOMAIN_EVENTS, createPlatformEvent } from "@grayscale/platform";
import { mapEventToMemoryIndex } from "./memory-event.mapper";

describe("mapEventToMemoryIndex", () => {
  it("maps memory.created to note index row", () => {
    const event = createPlatformEvent(
      DOMAIN_EVENTS.MEMORY_CREATED,
      "co-1",
      {
        id: "mem-1",
        title: "Strategy note",
        content: "Long content here",
        tags: ["strategy"],
        source: "manual",
        metadata: {},
        createdAt: "2026-07-25T10:00:00Z",
      },
      { source: "memory-service" },
    );

    const result = mapEventToMemoryIndex(event);
    expect(result.action).toBe("upsert");
    if (result.action === "upsert") {
      expect(result.input.memoryType).toBe("note");
      expect(result.input.sourceTable).toBe("memories");
      expect(result.input.sourceId).toBe("mem-1");
      expect(result.input.title).toBe("Strategy note");
    }
  });

  it("maps github source to git_activity", () => {
    const event = createPlatformEvent(
      DOMAIN_EVENTS.MEMORY_CREATED,
      "co-1",
      {
        id: "mem-2",
        title: "GitHub: fix bug",
        content: "commit body",
        tags: ["github"],
        source: "github",
        metadata: { sha: "abc" },
        createdAt: "2026-07-25T10:00:00Z",
      },
      { source: "memory-service" },
    );

    const result = mapEventToMemoryIndex(event);
    expect(result.action).toBe("upsert");
    if (result.action === "upsert") {
      expect(result.input.memoryType).toBe("git_activity");
    }
  });

  it("maps memory.deleted to remove action", () => {
    const event = createPlatformEvent(
      DOMAIN_EVENTS.MEMORY_DELETED,
      "co-1",
      { id: "mem-1" },
      { source: "memory-service" },
    );

    const result = mapEventToMemoryIndex(event);
    expect(result).toEqual({
      action: "remove",
      sourceTable: "memories",
      sourceId: "mem-1",
    });
  });

  it("maps journal.entry.created", () => {
    const event = createPlatformEvent(
      DOMAIN_EVENTS.JOURNAL_ENTRY_CREATED,
      "co-1",
      {
        id: "j-1",
        userId: "u-1",
        content: "Today we shipped the event store",
        summary: "Shipped event store",
        tags: ["engineering"],
        entryDate: "2026-07-25T10:00:00Z",
      },
      { source: "memory-service" },
    );

    const result = mapEventToMemoryIndex(event);
    expect(result.action).toBe("upsert");
    if (result.action === "upsert") {
      expect(result.input.memoryType).toBe("journal");
      expect(result.input.userId).toBe("u-1");
    }
  });

  it("skips unknown events", () => {
    const event = createPlatformEvent(
      "integration.sync.completed",
      "co-1",
      { provider: "github" },
      { source: "test" },
    );
    expect(mapEventToMemoryIndex(event)).toEqual({ action: "skip" });
  });

  it("maps git.commit.received to git_activity memory", () => {
    const event = createPlatformEvent(
      DOMAIN_EVENTS.GIT_COMMIT_RECEIVED,
      "co-1",
      {
        sha: "abc123",
        message: "fix: normalize commits",
        url: "https://github.com/org/repo/commit/abc123",
        normalizedEntityId: "ent-1",
        provider: "github",
      },
      { source: "integration-platform" },
    );

    const result = mapEventToMemoryIndex(event);
    expect(result.action).toBe("upsert");
    if (result.action === "upsert") {
      expect(result.input.memoryType).toBe("git_activity");
      expect(result.input.sourceTable).toBe("normalized_entity_records");
      expect(result.input.sourceId).toBe("ent-1");
    }
  });
});
