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

export async function fetchFounderBrief<T>(companyId: string, token: string) {
  return fetchMissionControl<T>(companyId, token, "/brief");
}

export async function fetchOrganizationalTimeline<T>(companyId: string, token: string, limit = 50) {
  return fetchMissionControl<T>(companyId, token, `/organizational-timeline?limit=${limit}`);
}

export async function fetchActivityFeed<T>(companyId: string, token: string, limit = 50) {
  return fetchMissionControl<T>(companyId, token, `/activity?limit=${limit}`);
}

export async function fetchGlobalSearch<T>(companyId: string, token: string, q: string) {
  return fetchMissionControl<T>(companyId, token, `/search?q=${encodeURIComponent(q)}`);
}

export async function fetchNotifications<T>(companyId: string, token: string, unreadOnly = false) {
  return fetchMissionControl<T>(companyId, token, `/notifications?unreadOnly=${unreadOnly}`);
}

export async function markNotificationRead(companyId: string, token: string, notificationId: string) {
  return api(companyPath(companyId, `/mission-control/notifications/${notificationId}/read`), {
    method: "PATCH",
    token,
  });
}

export async function fetchFounderPreferences<T>(token: string) {
  return api<T>("/founder/preferences", { token });
}

export async function updateFounderPreferences<T>(token: string, patch: Record<string, unknown>) {
  return api<T>("/founder/preferences", {
    method: "PATCH",
    token,
    body: JSON.stringify(patch),
  });
}

export async function fetchWorkspaceSession<T>(companyId: string, token: string) {
  return fetchMissionControl<T>(companyId, token, "/workspace-session");
}

export async function updateWorkspaceSession<T>(companyId: string, token: string, patch: Record<string, unknown>) {
  return api<T>(companyPath(companyId, "/mission-control/workspace-session"), {
    method: "PUT",
    token,
    body: JSON.stringify(patch),
  });
}

export async function saveWidgetLayout(companyId: string, token: string, widgets: unknown[]) {
  return api(companyPath(companyId, "/mission-control/widgets/layout"), {
    method: "PUT",
    token,
    body: JSON.stringify({ widgets }),
  });
}

export async function fetchQuickActions<T>(companyId: string, token: string) {
  return fetchMissionControl<T>(companyId, token, "/quick-actions");
}
