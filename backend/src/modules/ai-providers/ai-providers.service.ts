import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AiProvidersService {
  constructor(private readonly prisma: PrismaService) {}

  list(companyId: string) {
    return this.prisma.aiProviderConfig.findMany({ where: { companyId } });
  }

  upsert(
    companyId: string,
    data: { provider: string; model: string; isDefault?: boolean; isEnabled?: boolean },
  ) {
    return this.prisma.aiProviderConfig.upsert({
      where: { companyId_provider: { companyId, provider: data.provider } },
      create: { companyId, ...data },
      update: data,
    });
  }
}
