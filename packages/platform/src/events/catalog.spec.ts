import { describe, it, expect } from "vitest";
import {
  getEventVersion,
  isKnownEventType,
  listEventsByCategory,
  EVENT_CATALOG,
} from "./catalog.js";
import { createPlatformEvent } from "./envelope.js";

describe("EVENT_CATALOG", () => {
  it("includes core platform events", () => {
    expect(EVENT_CATALOG["memory.created"]).toBeDefined();
    expect(EVENT_CATALOG["recommendation.generated"]).toBeDefined();
    expect(EVENT_CATALOG["knowledge.relationship.created"]).toBeDefined();
    expect(EVENT_CATALOG["plugin.installed"]).toBeDefined();
  });

  it("returns version for known types", () => {
    expect(getEventVersion("memory.created")).toBe(1);
    expect(getEventVersion("unknown.event")).toBe(1);
  });

  it("validates known event types", () => {
    expect(isKnownEventType("task.completed")).toBe(true);
    expect(isKnownEventType("not.real")).toBe(false);
  });

  it("lists events by category", () => {
    const billing = listEventsByCategory("billing");
    expect(billing).toContain("bill.due");
    expect(billing.length).toBeGreaterThan(0);
  });
});

describe("createPlatformEvent", () => {
  it("creates versioned envelope with correlation metadata", () => {
    const event = createPlatformEvent(
      "project.created",
      "co-1",
      { name: "Alpha" },
      { source: "test", correlationId: "corr-1", traceId: "trace-1" },
    );
    expect(event.id).toBeDefined();
    expect(event.version).toBe(1);
    expect(event.metadata.correlationId).toBe("corr-1");
    expect(event.metadata.traceId).toBe("trace-1");
    expect(event.type).toBe("project.created");
  });
});
