import { Injectable } from "@nestjs/common";
import type {
  OrganizationalIntelligenceAssemblerPort,
  OrganizationalIntelligenceContext,
} from "@grayscale/platform";

@Injectable()
export class OrganizationalIntelligenceAssemblerService implements OrganizationalIntelligenceAssemblerPort {
  async assemble(companyId: string, _options?: { founderUserId?: string }): Promise<OrganizationalIntelligenceContext> {
    return {
      companyId,
      assembledAt: new Date().toISOString(),
    };
  }
}
