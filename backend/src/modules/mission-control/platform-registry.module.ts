import { Module } from "@nestjs/common";
import { PlatformServiceRegistryService } from "./platform-service-registry.service";

@Module({
  providers: [PlatformServiceRegistryService],
  exports: [PlatformServiceRegistryService],
})
export class PlatformRegistryModule {}
