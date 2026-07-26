import { Injectable } from "@nestjs/common";
import type { CouncilScheduleMode, CouncilScheduleTask, CouncilSchedulerPort, CouncilSchedulerStatus } from "@grayscale/platform";
import { COUNCIL_RUNTIME_VERSION } from "@grayscale/platform";
import { EventsService } from "../events/events.service";
import { RuntimeSchedulerService } from "../runtime/runtime-scheduler.service";
import { CouncilStoreService } from "./council-store.service";
import { CouncilSessionService } from "./council-session.service";

const MODES: CouncilScheduleMode[] = [
  "continuous",
  "scheduled",
  "event_driven",
  "manual",
  "founder_requested",
  "emergency",
  "policy_triggered",
];

/** Council scheduling — owned by Organizational Runtime, executives never create councils */
@Injectable()
export class CouncilSchedulerService implements CouncilSchedulerPort {
  private readonly tasks = new Map<string, CouncilScheduleTask>();

  constructor(
    private readonly store: CouncilStoreService,
    private readonly sessions: CouncilSessionService,
    private readonly runtimeScheduler: RuntimeSchedulerService,
    private readonly events: EventsService,
  ) {}

  supportedModes(): CouncilScheduleMode[] {
    return MODES;
  }

  async schedule(input: Omit<CouncilScheduleTask, "taskId" | "status">): Promise<CouncilScheduleTask> {
    const taskId = this.store.newId("csched");
    const task: CouncilScheduleTask = { ...input, taskId, status: "pending" };
    this.tasks.set(taskId, task);

    await this.runtimeScheduler.schedule({
      companyId: input.companyId,
      runtimeId: "council",
      mode: input.mode === "continuous" ? "continuous" : input.mode === "scheduled" ? "scheduled" : "event_driven",
      priority: input.priority,
      label: `council:${input.mode}`,
      correlationId: input.correlationId,
      scheduledAt: input.scheduledAt,
    });

    await this.events.publish("council.scheduled", input.companyId, { taskId, mode: input.mode }, {
      correlationId: input.correlationId,
    });

    return task;
  }

  async list(companyId: string): Promise<CouncilScheduleTask[]> {
    return [...this.tasks.values()].filter((t) => t.companyId === companyId);
  }

  async getStatus(companyId: string): Promise<CouncilSchedulerStatus> {
    const activeSessions = this.sessions.listSessions(companyId).filter((s) => s.status === "active").length;
    const pending = [...this.tasks.values()].filter((t) => t.companyId === companyId && t.status === "pending");
    return {
      companyId,
      modes: MODES,
      queueDepth: pending.length,
      activeSessions,
      nextScheduledAt: pending.sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))[0]?.scheduledAt,
      runtimeOwned: true,
    };
  }

  async openScheduledSession(companyId: string, mode: CouncilScheduleMode, correlationId: string) {
    const members = this.store.defaultMembers(companyId);
    return this.sessions.openSession({
      companyId,
      title: `Council session (${mode})`,
      participatingExecutiveIds: members.map((m) => m.executiveId),
      correlationId,
      scheduleMode: mode,
    });
  }

  version() {
    return COUNCIL_RUNTIME_VERSION;
  }
}
