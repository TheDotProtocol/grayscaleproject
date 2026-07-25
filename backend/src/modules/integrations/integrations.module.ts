import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { IntegrationsService } from "./integrations.service";
import { IntegrationsController } from "./integrations.controller";
import { EventsModule } from "../events/events.module";
import { CredentialVaultService } from "../integration-platform/credential-vault.service";

@Module({
  imports: [PrismaModule, EventsModule],
  controllers: [IntegrationsController],
  providers: [IntegrationsService, CredentialVaultService],
  exports: [IntegrationsService, CredentialVaultService],
})
export class IntegrationsModule {}
