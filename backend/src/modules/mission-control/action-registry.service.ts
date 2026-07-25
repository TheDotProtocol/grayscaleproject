import { Injectable } from "@nestjs/common";
import type { PlatformActionDefinition, ActionCategory } from "@grayscale/platform";

export const PLATFORM_ACTIONS: PlatformActionDefinition[] = [
  {
    id: "recommendation.approve",
    name: "Approve Recommendation",
    category: "recommendation",
    capabilityId: "intelligence.recommendations",
    permission: "intelligence.recommendations.write",
    inputSchema: { type: "object", required: ["recommendationId", "actorId"], properties: { recommendationId: { type: "string" }, actorId: { type: "string" } } },
  },
  {
    id: "recommendation.reject",
    name: "Reject Recommendation",
    category: "recommendation",
    capabilityId: "intelligence.recommendations",
    permission: "intelligence.recommendations.write",
    inputSchema: { type: "object", required: ["recommendationId", "actorId"], properties: { recommendationId: { type: "string" }, actorId: { type: "string" } } },
  },
  {
    id: "goal.create",
    name: "Create Goal",
    category: "goal",
    capabilityId: "intelligence.goals",
    permission: "intelligence.goals.write",
    inputSchema: { type: "object", required: ["title"], properties: { title: { type: "string" }, description: { type: "string" } } },
  },
  {
    id: "task.create",
    name: "Create Task",
    category: "task",
    capabilityId: "timeline.create",
    permission: "timeline.write",
    inputSchema: { type: "object", required: ["title"], properties: { title: { type: "string" }, description: { type: "string" } } },
  },
  {
    id: "meeting.schedule",
    name: "Schedule Meeting",
    category: "meeting",
    capabilityId: "timeline.create",
    permission: "timeline.write",
    inputSchema: { type: "object", required: ["title"], properties: { title: { type: "string" }, occurredAt: { type: "string" } } },
  },
  {
    id: "plugin.install",
    name: "Install Plugin",
    category: "plugin",
    capabilityId: "plugin.install",
    permission: "platform.plugins.write",
    inputSchema: { type: "object", properties: { pluginId: { type: "string", default: "io.grayscale.github" } } },
  },
  {
    id: "integration.retry-sync",
    name: "Retry Integration Sync",
    category: "integration",
    capabilityId: "integration.sync",
    permission: "platform.integrations.sync",
    inputSchema: { type: "object", required: ["provider"], properties: { provider: { type: "string" } } },
  },
  {
    id: "brief.refresh",
    name: "Refresh Founder Brief",
    category: "quick",
    capabilityId: "operations.dashboard",
    permission: "operations.dashboard",
    inputSchema: { type: "object", properties: {} },
  },
];

@Injectable()
export class ActionRegistryService {
  list(filters?: { category?: ActionCategory }): PlatformActionDefinition[] {
    if (filters?.category) {
      return PLATFORM_ACTIONS.filter((a) => a.category === filters.category);
    }
    return PLATFORM_ACTIONS;
  }

  get(actionId: string): PlatformActionDefinition | undefined {
    return PLATFORM_ACTIONS.find((a) => a.id === actionId);
  }
}
