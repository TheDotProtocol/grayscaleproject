import { Module, OnModuleInit } from "@nestjs/common";
import { PluginsService } from "./plugins.service";

@Module({
  providers: [PluginsService],
  exports: [PluginsService],
})
export class PluginsModule implements OnModuleInit {
  constructor(private readonly plugins: PluginsService) {}

  onModuleInit(): void {
    this.plugins.registerCorePlugins();
  }
}
