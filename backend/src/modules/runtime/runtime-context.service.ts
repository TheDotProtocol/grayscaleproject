import { Injectable } from "@nestjs/common";
import type { OrganizationalRuntimeSnapshot } from "@grayscale/platform";
import { RuntimeCoordinatorService } from "./runtime-coordinator.service";

@Injectable()
export class RuntimeContextService {
  constructor(private readonly coordinator: RuntimeCoordinatorService) {}

  async assemble(companyId: string): Promise<OrganizationalRuntimeSnapshot> {
    return this.coordinator.getSnapshot(companyId);
  }
}
