import { api } from "@/lib/api";

export function companyPath(companyId: string, path: string) {
  return `/companies/${companyId}${path}`;
}

export async function fetchCouncil<T>(companyId: string, token: string, path = "") {
  return api<T>(companyPath(companyId, `/council${path}`), { token });
}

export async function fetchTwin<T>(companyId: string, token: string, path = "") {
  return api<T>(companyPath(companyId, `/twin${path}`), { token });
}

export async function fetchEvolution<T>(companyId: string, token: string, path = "") {
  return api<T>(companyPath(companyId, `/organizational-evolution${path}`), { token });
}

export async function fetchExecutive<T>(companyId: string, token: string, executiveId: string, path = "") {
  return api<T>(companyPath(companyId, `/${executiveId}${path}`), { token });
}

export async function fetchExecutiveNetwork<T>(companyId: string, token: string, path = "") {
  return api<T>(companyPath(companyId, `/executive-network${path}`), { token });
}

export async function fetchMissionControl<T>(companyId: string, token: string, path: string) {
  return api<T>(companyPath(companyId, `/mission-control${path}`), { token });
}

export async function fetchGraphSummary<T>(companyId: string, token: string) {
  return api<T>(companyPath(companyId, "/graph/summary"), { token });
}

export async function fetchGoals<T>(companyId: string, token: string) {
  return api<T>(companyPath(companyId, "/intelligence/goals"), { token });
}

export async function fetchFounderHome<T>(companyId: string, token: string) {
  return api<T>(`/dashboard/companies/${companyId}/founder`, { token });
}
