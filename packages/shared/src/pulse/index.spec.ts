import { describe, it, expect } from "vitest";
import {
  DOMAIN_EVENTS,
  PULSE_EVENTS,
  domainEventToPulse,
  createDomainEvent,
} from "@grayscale/shared";

describe("domainEventToPulse", () => {
  it("maps memory.created to project.updated", () => {
    const event = createDomainEvent(
      DOMAIN_EVENTS.MEMORY_CREATED,
      "company-1",
      { title: "New doc" },
      { source: "memory" },
    );
    const pulse = domainEventToPulse(event);
    expect(pulse?.type).toBe(PULSE_EVENTS.PROJECT_UPDATED);
    expect(pulse?.category).toBe("project");
    expect(pulse?.title).toBe("Project updated");
  });

  it("maps bill.due_soon to bill.due with warning severity", () => {
    const event = createDomainEvent(
      DOMAIN_EVENTS.BILL_DUE_SOON,
      "company-1",
      { name: "AWS" },
      { source: "billing" },
    );
    const pulse = domainEventToPulse(event);
    expect(pulse?.type).toBe(PULSE_EVENTS.BILL_DUE);
    expect(pulse?.severity).toBe("warning");
  });

  it("maps bill.overdue to critical bill.due", () => {
    const event = createDomainEvent(
      DOMAIN_EVENTS.BILL_OVERDUE,
      "company-1",
      { name: "Rent" },
      { source: "billing" },
    );
    const pulse = domainEventToPulse(event);
    expect(pulse?.severity).toBe("critical");
  });

  it("maps integration.sync.failed to integration.failed", () => {
    const event = createDomainEvent(
      DOMAIN_EVENTS.INTEGRATION_SYNC_FAILED,
      "company-1",
      { provider: "github" },
      { source: "integrations" },
    );
    const pulse = domainEventToPulse(event);
    expect(pulse?.type).toBe(PULSE_EVENTS.INTEGRATION_FAILED);
    expect(pulse?.severity).toBe("critical");
  });

  it("maps agent.recommendation.created to ai.recommendation.created", () => {
    const event = createDomainEvent(
      DOMAIN_EVENTS.AGENT_RECOMMENDATION_CREATED,
      "company-1",
      { title: "Expand to EU" },
      { source: "agents" },
    );
    const pulse = domainEventToPulse(event);
    expect(pulse?.type).toBe(PULSE_EVENTS.AI_RECOMMENDATION_CREATED);
    expect(pulse?.category).toBe("ai");
  });

  it("maps sprint.completed pulse", () => {
    const event = createDomainEvent(
      DOMAIN_EVENTS.SPRINT_COMPLETED,
      "company-1",
      { sprintNumber: 1 },
      { source: "mission-control" },
    );
    const pulse = domainEventToPulse(event);
    expect(pulse?.type).toBe(PULSE_EVENTS.SPRINT_COMPLETED);
    expect(pulse?.severity).toBe("success");
  });

  it("returns null for unmapped domain events", () => {
    const event = createDomainEvent(
      DOMAIN_EVENTS.NOTIFICATION_CREATED,
      "company-1",
      {},
      { source: "notifications" },
    );
    expect(domainEventToPulse(event)).toBeNull();
  });
});
