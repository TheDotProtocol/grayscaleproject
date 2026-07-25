import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";
import { EventsService } from "../events/events.service";
import {
  AgentRuntime,
  createExecutiveAgent,
  createProviderAdapter,
} from "@grayscale/agents";
import { EXECUTIVE_LIST, DOMAIN_EVENTS, isExecutivesEnabled } from "@grayscale/shared";
import { MemoryQueryService } from "../memory/memory-query.service";

@Injectable()
export class AgentsService {
  private runtime: AgentRuntime;

  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventsService,
    private readonly memoryQuery: MemoryQueryService,
    private readonly config: ConfigService,
  ) {
    const adapter = createProviderAdapter({
      openaiApiKey: this.config.get("OPENAI_API_KEY"),
      ollamaBaseUrl: this.config.get("OLLAMA_BASE_URL"),
    });
    this.runtime = new AgentRuntime(adapter);
  }

  listExecutives() {
    return EXECUTIVE_LIST;
  }

  async runAgent(
    companyId: string,
    userId: string,
    executiveId: string,
    prompt: string,
  ) {
    if (!isExecutivesEnabled(this.config.get("EXECUTIVES_ENABLED"))) {
      throw new ServiceUnavailableException(
        "Executive execution is disabled. The Executive Runtime Framework is active but EXECUTIVES_ENABLED=false. Enable in Sprint 2+.",
      );
    }

    const executive = EXECUTIVE_LIST.find((e) => e.id === executiveId);
    if (!executive) throw new Error(`Unknown executive: ${executiveId}`);

    const run = await this.prisma.agentRun.create({
      data: { companyId, executiveId, prompt, status: "running" },
    });

    const { items: memoryRecords } = await this.memoryQuery.search(companyId, {
      limit: 15,
    });

    const memoryContext = await Promise.all(
      memoryRecords.map(async (record) => {
        const source = (await this.memoryQuery.resolveSource(record)) as
          | { content?: string; body?: string; summary?: string }
          | null;
        const body =
          source?.content ?? source?.body ?? record.summary ?? record.title;
        return `${record.title} [${record.memoryType}]: ${String(body).slice(0, 200)}`;
      }),
    );

    const agent = createExecutiveAgent({
      ...executive,
      runtime: this.runtime,
      getSystemPrompt: () =>
        `You are ${executive.name}, ${executive.title} at Project Grayscale. ${executive.description}. Provide actionable recommendations with reasoning, confidence (0-1), and ROI estimate. Critical actions require founder approval.`,
    });

    try {
      const result = await agent.run(
        {
          companyId,
          userId,
          executiveId,
          memory: memoryContext,
          companyContext: {},
        },
        prompt,
      );

      await this.prisma.agentRun.update({
        where: { id: run.id },
        data: {
          status: "completed",
          result: result as object,
          tokensUsed: result.tokensUsed,
          completedAt: new Date(),
        },
      });

      for (const rec of result.recommendations) {
        const saved = await this.prisma.agentRecommendation.create({
          data: {
            agentRunId: run.id,
            title: rec.title,
            summary: rec.summary,
            reasoning: rec.reasoning,
            confidence: rec.confidence,
            roiEstimate: rec.roiEstimate,
            requiresApproval: rec.requiresApproval,
          },
        });

        await this.prisma.recommendation.create({
          data: {
            id: saved.id,
            companyId,
            title: rec.title,
            summary: rec.summary,
            reasoning: rec.reasoning,
            confidence: rec.confidence,
            estimatedRoi: rec.roiEstimate,
            requiresApproval: rec.requiresApproval,
            source: "executive",
            sourceRef: run.id,
            createdBy: userId,
            status: rec.requiresApproval ? "pending_approval" : "approved",
            confidenceBand:
              rec.confidence >= 0.9
                ? "verified"
                : rec.confidence >= 0.75
                  ? "high"
                  : rec.confidence >= 0.5
                    ? "medium"
                    : "low",
          },
        });

        await this.events.publish(
          DOMAIN_EVENTS.AGENT_RECOMMENDATION_CREATED,
          companyId,
          { ...saved, executiveId },
          { userId, source: "agents" },
        );
      }

      return result;
    } catch (error) {
      await this.prisma.agentRun.update({
        where: { id: run.id },
        data: { status: "failed", completedAt: new Date() },
      });
      throw error;
    }
  }

  async resolveApproval(
    recommendationId: string,
    userId: string,
    action: "approve" | "amend" | "reject",
  ) {
    const rec = await this.prisma.agentRecommendation.findUnique({
      where: { id: recommendationId },
      include: { agentRun: true },
    });
    if (!rec) throw new NotFoundException("Recommendation not found");

    const membership = await this.prisma.companyMember.findUnique({
      where: {
        companyId_userId: {
          companyId: rec.agentRun.companyId,
          userId,
        },
      },
    });
    if (!membership) throw new ForbiddenException();

    return this.prisma.agentRecommendation.update({
      where: { id: recommendationId },
      data: { approvalStatus: action },
    });
  }
}
