import type {
  AgentContext,
  AgentRecommendation,
  AgentRunResult,
  AiProviderAdapter,
  ChatMessage,
  ExecutiveAgent,
} from "./types.js";

/**
 * Parses structured recommendations from agent LLM output.
 * Expects JSON block or falls back to plain text summary.
 */
export function parseRecommendations(
  executiveId: string,
  content: string,
): AgentRecommendation[] {
  const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
  if (jsonMatch?.[1]) {
    try {
      const parsed = JSON.parse(jsonMatch[1]) as AgentRecommendation[];
      return parsed.map((r) => ({ ...r, executiveId }));
    } catch {
      /* fall through */
    }
  }

  return [
    {
      executiveId,
      title: "Executive Analysis",
      summary: content.slice(0, 500),
      reasoning: "Generated from executive agent analysis.",
      confidence: 0.7,
      requiresApproval: true,
    },
  ];
}

/**
 * AgentRuntime orchestrates LLM calls for executive agents.
 * Provider-agnostic — swaps adapters without changing agent code.
 */
export class AgentRuntime {
  constructor(private readonly adapter: AiProviderAdapter) {}

  async isReady(): Promise<boolean> {
    return this.adapter.isAvailable();
  }

  /**
   * Execute an agent run with system prompt, context, and user query.
   */
  async execute(
    agent: ExecutiveAgent,
    context: AgentContext,
    userPrompt: string,
    systemPrompt: string,
  ): Promise<AgentRunResult> {
    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: [
          "## Company Context",
          JSON.stringify(context.companyContext, null, 2),
          "",
          "## Relevant Memory",
          context.memory.join("\n---\n") || "No memory available.",
          "",
          "## Query",
          userPrompt,
        ].join("\n"),
      },
    ];

    const response = await this.adapter.chat({
      model: "default",
      messages,
      temperature: 0.4,
      maxTokens: 2048,
    });

    const recommendations = parseRecommendations(agent.id, response.content);

    return {
      executiveId: agent.id,
      recommendations,
      rawResponse: response.content,
      tokensUsed:
        (response.usage?.promptTokens ?? 0) +
        (response.usage?.completionTokens ?? 0),
    };
  }
}

/**
 * Creates a base executive agent from executive metadata.
 * Specialized agents can extend with custom tools and prompts.
 */
export function createExecutiveAgent(config: {
  id: string;
  name: string;
  title: string;
  department: string;
  runtime: AgentRuntime;
  getSystemPrompt: () => string;
}): ExecutiveAgent {
  return {
    id: config.id,
    name: config.name,
    title: config.title,
    department: config.department,
    run(context, prompt) {
      return config.runtime.execute(
        {
          id: config.id,
          name: config.name,
          title: config.title,
          department: config.department,
          run: async () => ({ executiveId: config.id, recommendations: [] }),
        },
        context,
        prompt,
        config.getSystemPrompt(),
      );
    },
  };
}
