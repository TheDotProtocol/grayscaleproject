import { Injectable } from "@nestjs/common";
import type { CompanyContextAssemblerPort } from "@grayscale/platform";
import { ContextRuntimeService } from "../context-runtime/context-runtime.service";

@Injectable()
export class CompanyContextService implements CompanyContextAssemblerPort {
  constructor(private readonly contextRuntime: ContextRuntimeService) {}

  assemble(
    companyId: string,
    options?: { correlationId?: string; founderUserId?: string },
  ) {
    return this.contextRuntime.assemble(companyId, options);
  }
}
