import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { Logger } from "@nestjs/common";
import { SyncOrchestratorService } from "./sync-orchestrator.service";
import type { ConnectorProviderId } from "@grayscale/platform";

@Processor("integration-sync")
export class SyncProcessor extends WorkerHost {
  private readonly logger = new Logger(SyncProcessor.name);

  constructor(private readonly sync: SyncOrchestratorService) {
    super();
  }

  async process(job: Job<{ companyId: string; provider: ConnectorProviderId }>) {
    this.logger.log(`Processing sync job ${job.id} provider=${job.data.provider}`);
    return this.sync.runSync(job.data.companyId, job.data.provider);
  }
}
