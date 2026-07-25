import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import type { IntelligenceEngine, IntelligenceEngineRegistry } from "@grayscale/platform";

@Injectable()
export class IntelligenceEngineRegistryService
  implements IntelligenceEngineRegistry, OnModuleInit
{
  private readonly logger = new Logger(IntelligenceEngineRegistryService.name);
  private readonly engines = new Map<string, IntelligenceEngine>();

  onModuleInit(): void {
    this.logger.log("Intelligence engine registry ready for dynamic registration");
  }

  register(engine: IntelligenceEngine): void {
    this.engines.set(engine.id, engine);
    this.logger.log(`Registered intelligence engine: ${engine.id} v${engine.version}`);
  }

  unregister(engineId: string): void {
    this.engines.delete(engineId);
  }

  list(): IntelligenceEngine[] {
    return [...this.engines.values()];
  }

  get(engineId: string): IntelligenceEngine | undefined {
    return this.engines.get(engineId);
  }
}
