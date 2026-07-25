"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { api, API_URL } from "./api";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthCompany {
  id: string;
  name: string;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  company: AuthCompany | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  companyName: string;
  industry?: string;
}

const AuthContext = createContext<AuthState | null>(null);

const STORAGE_KEY = "pg-auth";

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  company: AuthCompany | null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [company, setCompany] = useState<AuthCompany | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as {
          token: string;
          refreshToken?: string;
          user: AuthUser;
          company: AuthCompany | null;
        };
        setToken(parsed.token);
        setRefreshToken(parsed.refreshToken ?? null);
        setUser(parsed.user);
        setCompany(parsed.company);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const persist = useCallback(
    (t: string, rt: string, u: AuthUser, c: AuthCompany | null) => {
      setToken(t);
      setRefreshToken(rt);
      setUser(u);
      setCompany(c);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ token: t, refreshToken: rt, user: u, company: c }),
      );
    },
    [],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as AuthResponse & { message?: string };
      if (!res.ok) {
        throw new Error(data.message ?? "Login failed");
      }
      if (!data.accessToken || !data.user) {
        throw new Error("Invalid login response");
      }
      persist(data.accessToken, data.refreshToken ?? "", data.user, data.company ?? null);
      router.push("/dashboard");
    },
    [persist, router],
  );

  const register = useCallback(
    async (data: RegisterData) => {
      const res = await api<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
      persist(res.accessToken, res.refreshToken, res.user, res.company);
      router.push("/dashboard");
    },
    [persist, router],
  );

  const logout = useCallback(async () => {
    const rt = refreshToken;
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    setCompany(null);
    localStorage.removeItem(STORAGE_KEY);
    if (rt && rt !== "dev-session-refresh") {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: rt }),
      }).catch(() => undefined);
    }
    router.push("/login");
  }, [refreshToken, router]);

  const refreshProfile = useCallback(async () => {
    if (!token) return;
    const profile = await api<{
      id: string;
      email: string;
      name: string;
      companies: Array<{ company: AuthCompany }>;
    }>("/auth/me", { token });
    const c = profile.companies?.[0]?.company ?? null;
    persist(
      token,
      refreshToken ?? "",
      { id: profile.id, email: profile.email, name: profile.name },
      c,
    );
  }, [token, refreshToken, persist]);

  return (
    <AuthContext.Provider
      value={{
        token,
        refreshToken,
        user,
        company,
        loading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
