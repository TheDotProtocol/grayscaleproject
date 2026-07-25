import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL ?? "http://localhost:4000";

/**
 * Proxies login to NestJS API. In development, falls back to env-configured
 * dev credentials when the API is unreachable (Postgres/Docker not running).
 */
export async function POST(req: NextRequest) {
  const body = (await req.json()) as { email?: string; password?: string };

  if (!body.email || !body.password) {
    return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
  }

  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: body.email, password: body.password }),
      signal: AbortSignal.timeout(8000),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    if (
      process.env.NODE_ENV === "development" &&
      process.env.DEV_AUTH_ENABLED === "true" &&
      body.email === process.env.DEV_AUTH_EMAIL &&
      body.password === process.env.DEV_AUTH_PASSWORD
    ) {
      return NextResponse.json({
        accessToken: "dev-session-token",
        refreshToken: "dev-session-refresh",
        user: {
          id: "dev-user-id",
          email: body.email,
          name: process.env.DEV_AUTH_NAME ?? "Ak Kumar",
        },
        company: {
          id: "dev-company-id",
          name: process.env.DEV_AUTH_COMPANY ?? "Trabaajo",
        },
      });
    }

    return NextResponse.json(
      {
        message:
          "API unavailable. Start infrastructure: pnpm setup:dev — then run pnpm dev",
      },
      { status: 503 },
    );
  }
}
