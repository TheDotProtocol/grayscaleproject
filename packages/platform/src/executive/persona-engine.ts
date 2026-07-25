/** Persona Engine — presentation layer only; reasoning unchanged (ADR-014) */

import type { OperatorIdentityProfile } from "./identity-engine.js";

export interface PersonaPresentation {
  displayName: string;
  avatar?: string;
  voice?: string;
  language: string;
  tone: "professional" | "conversational" | "mixed";
  formality: "low" | "medium" | "high";
  greetingStyle?: string;
  signature?: string;
  emojiEnabled: boolean;
}

export interface PersonaContext {
  executiveCanonicalId: string;
  operatorIdentity: OperatorIdentityProfile;
  presentation: PersonaPresentation;
}

export interface PersonaEnginePort {
  /** Resolve presentation for executive + operator — does NOT alter reasoning input */
  resolve(executiveCanonicalId: string, identity: OperatorIdentityProfile): PersonaPresentation;
  /** Apply presentation to structured output text — post-reasoning only */
  formatOutput(content: string, persona: PersonaPresentation): string;
}

/** Default resolver — pure function, no LLM */
export function resolvePersona(
  executiveCanonicalId: string,
  identity: OperatorIdentityProfile,
): PersonaPresentation {
  const prefs = identity.executivePresentation;
  return {
    displayName: prefs.displayNames[executiveCanonicalId] ?? executiveCanonicalId,
    avatar: prefs.avatars[executiveCanonicalId],
    voice: prefs.voices[executiveCanonicalId],
    language: identity.language,
    tone: identity.communicationStyle,
    formality: identity.formalityLevel,
    emojiEnabled: identity.emojiUsage,
  };
}
