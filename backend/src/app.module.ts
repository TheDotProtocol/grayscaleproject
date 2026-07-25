import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { BullModule } from "@nestjs/bullmq";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { MemoryModule } from "./modules/memory/memory.module";
import { TimelineModule } from "./modules/timeline/timeline.module";
import { BillingModule } from "./modules/billing/billing.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { KnowledgeModule } from "./modules/knowledge/knowledge.module";
import { AgentsModule } from "./modules/agents/agents.module";
import { EventsModule } from "./modules/events/events.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { AiProvidersModule } from "./modules/ai-providers/ai-providers.module";
import { IntegrationsModule } from "./modules/integrations/integrations.module";
import { HealthModule } from "./modules/health/health.module";
import { PulseModule } from "./modules/pulse/pulse.module";
import { PluginsModule } from "./modules/plugins/plugins.module";
import { GraphModule } from "./modules/graph/graph.module";
import { IntelligenceModule } from "./modules/intelligence/intelligence.module";
import { ExecutiveModule } from "./modules/executive/executive.module";
import { ContextRuntimeModule } from "./modules/context-runtime/context-runtime.module";
import { IntegrationPlatformModule } from "./modules/integration-platform/integration-platform.module";
import { MissionControlModule } from "./modules/mission-control/mission-control.module";
import { PlatformOperationsModule } from "./modules/platform-operations/platform-operations.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", "../.env"],
    }),
    BullModule.forRoot({
      connection: {
        url: process.env.REDIS_URL ?? "redis://localhost:6379",
      },
    }),
    PrismaModule,
    HealthModule,
    PulseModule,
    PluginsModule,
    GraphModule,
    IntelligenceModule,
    ExecutiveModule,
    ContextRuntimeModule,
    IntegrationPlatformModule,
    MissionControlModule,
    PlatformOperationsModule,
    AuthModule,
    MemoryModule,
    TimelineModule,
    BillingModule,
    NotificationsModule,
    KnowledgeModule,
    AgentsModule,
    EventsModule,
    DashboardModule,
    AiProvidersModule,
    IntegrationsModule,
  ],
})
export class AppModule {}
