const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
const STORAGE_KEY = "pg-auth";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface StoredAuth {
  token: string;
  refreshToken?: string;
  user: unknown;
  company: unknown;
}

async function tryRefreshToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  let stored: StoredAuth;
  try {
    stored = JSON.parse(raw) as StoredAuth;
  } catch {
    return null;
  }

  if (!stored.refreshToken || stored.refreshToken === "dev-session-refresh") return null;

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: stored.refreshToken }),
  });

  if (!res.ok) return null;

  const data = (await res.json()) as StoredAuth & {
    accessToken: string;
    refreshToken: string;
  };

  const updated = {
    token: data.accessToken,
    refreshToken: data.refreshToken,
    user: data.user ?? stored.user,
    company: data.company ?? stored.company,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated.token;
}

export async function api<T>(
  path: string,
  options: RequestInit & { token?: string; _retry?: boolean } = {},
): Promise<T> {
  const { token, _retry, ...init } = options;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });

  if (res.status === 401 && token && !_retry) {
    const newToken = await tryRefreshToken();
    if (newToken) {
      return api<T>(path, { ...options, token: newToken, _retry: true });
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      (body as { message?: string }).message ?? res.statusText,
      res.status,
    );
  }

  return res.json() as Promise<T>;
}

export { API_URL };
