import { Injectable } from "@nestjs/common";
import type { QuickActionsPort, QuickActionDefinition } from "@grayscale/platform";

const QUICK_ACTIONS: QuickActionDefinition[] = [
  { id: "quick.goal.create", name: "Create Goal", target: "goals", actionId: "goal.create", permission: "intelligence.goals.write", description: "Add a strategic goal" },
  { id: "quick.note.create", name: "Create Note", target: "notes", actionId: "task.create", permission: "timeline.write", description: "Capture a note via timeline" },
  { id: "quick.meeting.schedule", name: "Schedule Meeting", target: "meetings", actionId: "meeting.schedule", permission: "timeline.write", description: "Schedule a meeting" },
  { id: "quick.plugin.install", name: "Install Plugin", target: "plugins", actionId: "plugin.install", permission: "platform.plugins.write", description: "Install a platform plugin" },
  { id: "quick.integration.sync", name: "Retry Sync", target: "sync", actionId: "integration.retry-sync", permission: "platform.integrations.sync", description: "Retry integration sync" },
  { id: "quick.report.brief", name: "Generate Brief", target: "reports", actionId: "brief.refresh", permission: "operations.dashboard", description: "Refresh founder brief" },
  { id: "quick.simulation.run", name: "Run Simulation", target: "simulation", actionId: "simulation.run", permission: "operations.dashboard", description: "Start organizational simulation" },
  { id: "quick.forecast.generate", name: "Generate Forecast", target: "forecasts", actionId: "forecast.generate", permission: "operations.dashboard", description: "Generate organizational forecast" },
  { id: "quick.council.start", name: "Start Council", target: "council", actionId: "council.start", permission: "operations.dashboard", description: "Open executive council session" },
];

@Injectable()
export class QuickActionsService implements QuickActionsPort {
  list(): QuickActionDefinition[] {
    return QUICK_ACTIONS;
  }
}
