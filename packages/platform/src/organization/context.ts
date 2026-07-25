/** Organizational Intelligence context — assembled for CompanyContext (Phase A.2) */

import type { OrganizationalDnaRecord } from "./organizational-dna.js";
import type { FounderDnaProfile } from "./founder-dna.js";
import type { OrganizationalEmotionalSnapshot } from "./emotional-engine.js";
import type { OrganizationalCognitiveProfile } from "./cognitive-engine.js";
import type { OrganizationalLearningRecord } from "./organizational-learning.js";
import type { WisdomRecord } from "./wisdom-engine.js";
import type { OrganizationalCultureSnapshot } from "./culture-engine.js";
import type { OrganizationalReputationSnapshot } from "./reputation-engine.js";
import type { OrganizationalAdaptationSnapshot } from "./adaptation-engine.js";

export interface OrganizationalIntelligenceContext {
  companyId: string;
  assembledAt: string;

  organizationalDna?: OrganizationalDnaRecord;
  founderDna?: FounderDnaProfile;
  emotional?: OrganizationalEmotionalSnapshot;
  cognitive?: OrganizationalCognitiveProfile;
  recentLearnings?: OrganizationalLearningRecord[];
  approvedWisdom?: WisdomRecord[];
  culture?: OrganizationalCultureSnapshot;
  reputation?: OrganizationalReputationSnapshot;
  adaptation?: OrganizationalAdaptationSnapshot;
}

export interface OrganizationalIntelligenceAssemblerPort {
  assemble(companyId: string, options?: { founderUserId?: string }): Promise<OrganizationalIntelligenceContext>;
}
