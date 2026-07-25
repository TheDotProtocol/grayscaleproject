/** Supported AI provider backends — swappable via adapter pattern */
export type AiProvider = "openai" | "anthropic" | "gemini" | "ollama";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
}

export interface ChatCompletionResponse {
  content: string;
  model: string;
  provider: AiProvider;
  usage?: {
    promptTokens: number;
    completionTokens: number;
  };
}

/**
 * Provider adapter interface — implement per vendor.
 * Enables swapping OpenAI, Anthropic, Gemini, Ollama without changing agent logic.
 */
export interface AiProviderAdapter {
  readonly provider: AiProvider;
  chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse>;
  isAvailable(): Promise<boolean>;
}

export interface AgentTool {
  name: string;
  description: string;
  /** Whether this tool requires human approval before execution */
  requiresApproval: boolean;
  execute(input: Record<string, unknown>): Promise<unknown>;
}

export interface AgentContext {
  companyId: string;
  userId: string;
  executiveId: string;
  memory: string[];
  companyContext: Record<string, unknown>;
}

export interface AgentRecommendation {
  executiveId: string;
  title: string;
  summary: string;
  reasoning: string;
  confidence: number;
  roiEstimate?: string;
  requiresApproval: boolean;
  actions?: Array<{ type: string; payload: Record<string, unknown> }>;
}

export interface AgentRunResult {
  executiveId: string;
  recommendations: AgentRecommendation[];
  rawResponse?: string;
  tokensUsed?: number;
}

/**
 * Base contract for all executive agents.
 * Each executive (Athena, Atlas, etc.) extends this interface.
 */
export interface ExecutiveAgent {
  readonly id: string;
  readonly name: string;
  readonly title: string;
  readonly department: string;
  run(context: AgentContext, prompt: string): Promise<AgentRunResult>;
}
