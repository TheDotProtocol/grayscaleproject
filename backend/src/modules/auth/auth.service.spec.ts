import { describe, it, expect, vi, beforeEach } from "vitest";
import { UnauthorizedException, ConflictException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { hashRefreshToken, generateRefreshToken } from "./token.util";

const mockJwt = { sign: vi.fn(() => "access-jwt") };
const mockConfig = { get: vi.fn((key: string) => (key === "JWT_REFRESH_EXPIRES_IN" ? "7d" : undefined)) };

function createPrismaMock() {
  return {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    company: { create: vi.fn() },
    companyMember: { findUnique: vi.fn() },
    refreshToken: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    $transaction: vi.fn((fn: (tx: unknown) => unknown) => fn({
      user: { create: vi.fn().mockResolvedValue({ id: "u1", email: "a@b.com", name: "A" }) },
      company: { create: vi.fn().mockResolvedValue({ id: "c1", name: "Co" }) },
    })),
  };
}

describe("AuthService", () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let auth: AuthService;

  beforeEach(() => {
    prisma = createPrismaMock();
    auth = new AuthService(prisma as never, mockJwt as never, mockConfig as never);
    vi.clearAllMocks();
  });

  describe("login", () => {
    it("throws on invalid email", async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(auth.login({ email: "x@y.com", password: "pass" })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("returns tokens on valid login", async () => {
      const bcrypt = await import("bcrypt");
      const hash = await bcrypt.hash("Ak1233@@5", 12);
      prisma.user.findUnique.mockResolvedValue({
        id: "u1",
        email: "a@b.com",
        name: "A",
        passwordHash: hash,
        companies: [{ company: { id: "c1", name: "Co" } }],
      });
      prisma.refreshToken.create.mockResolvedValue({});

      const result = await auth.login({ email: "a@b.com", password: "Ak1233@@5" });
      expect(result.accessToken).toBe("access-jwt");
      expect(result.refreshToken).toBeDefined();
      expect(result.user.id).toBe("u1");
      expect(prisma.refreshToken.create).toHaveBeenCalledOnce();
    });
  });

  describe("refresh", () => {
    it("rotates refresh token on valid request", async () => {
      const raw = generateRefreshToken();
      prisma.refreshToken.findUnique.mockResolvedValue({
        id: "rt1",
        revokedAt: null,
        expiresAt: new Date(Date.now() + 86400000),
        user: {
          id: "u1",
          email: "a@b.com",
          name: "A",
          companies: [{ company: { id: "c1", name: "Co" } }],
        },
      });
      prisma.refreshToken.update.mockResolvedValue({});
      prisma.refreshToken.create.mockResolvedValue({});

      const result = await auth.refresh(raw);
      expect(result.accessToken).toBe("access-jwt");
      expect(result.refreshToken).toBeDefined();
      expect(prisma.refreshToken.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: "rt1" } }),
      );
    });

    it("rejects expired refresh token", async () => {
      prisma.refreshToken.findUnique.mockResolvedValue({
        id: "rt1",
        revokedAt: null,
        expiresAt: new Date(Date.now() - 1000),
        user: { id: "u1", email: "a@b.com", name: "A", companies: [] },
      });
      await expect(auth.refresh("bad")).rejects.toThrow(UnauthorizedException);
    });
  });

  describe("register", () => {
    it("throws when email exists", async () => {
      prisma.user.findUnique.mockResolvedValue({ id: "existing" });
      await expect(
        auth.register({
          email: "a@b.com",
          password: "password1",
          name: "A",
          companyName: "Co",
        }),
      ).rejects.toThrow(ConflictException);
    });
  });
});
