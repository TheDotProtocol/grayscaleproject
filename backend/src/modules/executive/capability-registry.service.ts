import { Injectable } from "@nestjs/common";
import type {
  ExecutiveCapabilityRegistryPort,
  CapabilityDeclaration,
  ExecutiveCapability,
} from "@grayscale/platform";

@Injectable()
export class CapabilityRegistryService implements ExecutiveCapabilityRegistryPort {
  private readonly registry = new Map<string, CapabilityDeclaration[]>();

  register(executiveId: string, capabilities: CapabilityDeclaration[]): void {
    const existing = this.registry.get(executiveId) ?? [];
    const merged = [...existing];
    for (const cap of capabilities) {
      const idx = merged.findIndex((c) => c.capability === cap.capability);
      if (idx >= 0) merged[idx] = cap;
      else merged.push(cap);
    }
    this.registry.set(executiveId, merged);
  }

  list(executiveId: string): CapabilityDeclaration[] {
    return [...(this.registry.get(executiveId) ?? [])];
  }

  has(executiveId: string, capability: ExecutiveCapability): boolean {
    return this.list(executiveId).some((c) => c.capability === capability);
  }

  discover(companyId: string): { executiveId: string; capabilities: ExecutiveCapability[] }[] {
    void companyId;
    return [...this.registry.entries()].map(([executiveId, caps]) => ({
      executiveId,
      capabilities: caps.map((c) => c.capability),
    }));
  }
}
