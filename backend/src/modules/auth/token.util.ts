import { createHash, randomBytes } from "crypto";

const REFRESH_TOKEN_BYTES = 48;

export function generateRefreshToken(): string {
  return randomBytes(REFRESH_TOKEN_BYTES).toString("base64url");
}

export function hashRefreshToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function refreshTokenExpiresAt(days = 7): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}
