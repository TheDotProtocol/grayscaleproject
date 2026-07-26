import { Injectable } from "@nestjs/common";
import type { RuntimeScheduleMode, RuntimeTask } from "@grayscale/platform";
import { RuntimeStoreService } from "./runtime-store.service";

const MODES: RuntimeScheduleMode[] = ["continuous", "scheduled", "event_driven", "manual", "maintenance", "deferred", "priority"];

/** Runtime scheduler — orchestration only, executives never self-schedule */
@Injectable()
export class RuntimeSchedulerService {
  constructor(private readonly store: RuntimeStoreService) {}

  supportedModes(): RuntimeScheduleMode[] {
    return MODES;
  }

  async schedule(task: Omit<RuntimeTask, "taskId" | "status">): Promise<RuntimeTask> {
    const taskId = this.store.newId("rtask");
    const full: RuntimeTask = { ...task, taskId, status: "pending" };
    this.store.tasks.set(this.store.taskKey(task.companyId, taskId), full);
    return full;
  }

  async list(companyId: string): Promise<RuntimeTask[]> {
    return [...this.store.tasks.values()].filter((t) => t.companyId === companyId);
  }

  async executeNext(companyId: string): Promise<RuntimeTask | undefined> {
    const pending = (await this.list(companyId))
      .filter((t) => t.status === "pending")
      .sort((a, b) => b.priority - a.priority);
    const next = pending[0];
    if (!next) return undefined;
    if (this.store.executedTaskIds.has(next.taskId)) return undefined;
    next.status = "completed";
    this.store.executedTaskIds.add(next.taskId);
    this.store.tasks.set(this.store.taskKey(companyId, next.taskId), next);
    return next;
  }

  queueDepth(companyId: string): number {
    return [...this.store.tasks.values()].filter((t) => t.companyId === companyId && t.status === "pending").length;
  }
}
