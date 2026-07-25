import type { AiProviderAdapter, ChatCompletionRequest, ChatCompletionResponse } from "../types.js";

/**
 * Ollama adapter — free local inference for dev and privacy-sensitive workloads.
 * WHY: Aligns with "Privacy before Convenience" doctrine. Zero API cost in development.
 */
export class OllamaAdapter implements AiProviderAdapter {
  readonly provider = "ollama" as const;

  constructor(private readonly baseUrl = "http://localhost:11434") {}

  async isAvailable(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/api/tags`);
      return res.ok;
    } catch {
      return false;
    }
  }

  async chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const res = await fetch(`${this.baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: request.model === "default" ? "llama3.2" : request.model,
        messages: request.messages,
        stream: false,
        options: {
          temperature: request.temperature ?? 0.4,
          num_predict: request.maxTokens ?? 2048,
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Ollama request failed: ${res.statusText}`);
    }

    const data = (await res.json()) as { message: { content: string } };

    return {
      content: data.message.content,
      model: request.model,
      provider: "ollama",
    };
  }
}

/**
 * OpenAI adapter — production cloud inference.
 */
export class OpenAiAdapter implements AiProviderAdapter {
  readonly provider = "openai" as const;

  constructor(
    private readonly apiKey: string,
    private readonly defaultModel = "gpt-4o-mini",
  ) {}

  async isAvailable(): Promise<boolean> {
    return Boolean(this.apiKey);
  }

  async chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: request.model === "default" ? this.defaultModel : request.model,
        messages: request.messages,
        temperature: request.temperature ?? 0.4,
        max_tokens: request.maxTokens ?? 2048,
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenAI request failed: ${res.statusText}`);
    }

    const data = (await res.json()) as {
      choices: Array<{ message: { content: string } }>;
      model: string;
      usage?: { prompt_tokens: number; completion_tokens: number };
    };

    return {
      content: data.choices[0]?.message.content ?? "",
      model: data.model,
      provider: "openai",
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
          }
        : undefined,
    };
  }
}

class FallbackAdapter implements AiProviderAdapter {
  readonly provider = "openai" as const;

  constructor(private readonly adapters: AiProviderAdapter[]) {}

  async isAvailable(): Promise<boolean> {
    for (const adapter of this.adapters) {
      if (await adapter.isAvailable()) return true;
    }
    return false;
  }

  async chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    let lastError: Error | undefined;
    for (const adapter of this.adapters) {
      if (!(await adapter.isAvailable())) continue;
      try {
        return await adapter.chat(request);
      } catch (e) {
        lastError = e instanceof Error ? e : new Error(String(e));
      }
    }
    throw lastError ?? new Error("No AI provider available");
  }
}

/** Factory — OpenAI if keyed, always includes Ollama fallback */
export function createProviderAdapter(config: {
  openaiApiKey?: string;
  ollamaBaseUrl?: string;
}): AiProviderAdapter {
  const adapters: AiProviderAdapter[] = [];
  if (config.openaiApiKey) {
    adapters.push(new OpenAiAdapter(config.openaiApiKey));
  }
  adapters.push(new OllamaAdapter(config.ollamaBaseUrl));
  return new FallbackAdapter(adapters);
}
