/** Global Search — architecture reserve (AIP-28 extension) */

export const SEARCH_DOMAINS = [
  "memory",
  "graph",
  "projects",
  "goals",
  "bills",
  "meetings",
  "tasks",
  "recommendations",
  "plugins",
  "integrations",
  "executives",
  "council",
  "events",
  "learning",
  "wisdom",
  "forecasts",
  "simulations",
  "signals",
  "insights",
  "policies",
  "strategies",
] as const;

export type SearchDomain = (typeof SEARCH_DOMAINS)[number];

export interface GlobalSearchResult {
  domain: SearchDomain | string;
  id: string;
  title: string;
  summary?: string;
  score: number;
  route?: string;
  metadata?: Record<string, unknown>;
  group?: string;
}

export interface GlobalSearchQuery {
  q: string;
  domains?: SearchDomain[];
  limit?: number;
}

export interface GlobalSearchPort {
  search(companyId: string, query: GlobalSearchQuery): Promise<GlobalSearchResult[]>;
}
