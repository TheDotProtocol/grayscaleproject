import { z } from "zod";

export const createMemorySchema = z.object({
  title: z.string().min(1).max(500),
  content: z.string().min(1),
  tags: z.array(z.string()).default([]),
  source: z
    .enum(["manual", "journal", "git", "cursor", "calendar", "integration"])
    .default("manual"),
});

export const createJournalEntrySchema = z.object({
  content: z.string().min(1),
  mood: z.enum(["great", "good", "neutral", "stressed", "overwhelmed"]).optional(),
  tags: z.array(z.string()).default([]),
});

export const createBillSchema = z.object({
  name: z.string().min(1),
  amountCents: z.number().int().positive(),
  currency: z.string().length(3).default("USD"),
  dueDate: z.string().datetime(),
  recurrence: z.enum(["once", "weekly", "monthly", "quarterly", "yearly"]).default("monthly"),
  category: z.string().optional(),
});

export const aiProviderConfigSchema = z.object({
  provider: z.enum(["openai", "anthropic", "gemini", "ollama"]),
  model: z.string().min(1),
  isDefault: z.boolean().default(false),
  isEnabled: z.boolean().default(true),
});

export type CreateMemoryInput = z.infer<typeof createMemorySchema>;
export type CreateJournalEntryInput = z.infer<typeof createJournalEntrySchema>;
export type CreateBillInput = z.infer<typeof createBillSchema>;
export type AiProviderConfigInput = z.infer<typeof aiProviderConfigSchema>;
