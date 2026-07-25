import { describe, it, expect, vi, beforeEach } from "vitest";
import { ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { CompanyMemberGuard } from "./company-member.guard";

function mockContext(params: Record<string, string>, user?: { userId: string }) {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ params, user }),
    }),
    getHandler: () => ({}),
    getClass: () => ({}),
  };
}

describe("CompanyMemberGuard", () => {
  const prisma = {
    companyMember: { findUnique: vi.fn() },
  };
  const reflector = {
    getAllAndOverride: vi.fn(() => false),
  } as unknown as Reflector;

  let guard: CompanyMemberGuard;

  beforeEach(() => {
    guard = new CompanyMemberGuard(prisma as never, reflector);
    vi.clearAllMocks();
  });

  it("allows routes without companyId", async () => {
    const ok = await guard.canActivate(mockContext({}) as never);
    expect(ok).toBe(true);
    expect(prisma.companyMember.findUnique).not.toHaveBeenCalled();
  });

  it("allows member of company", async () => {
    prisma.companyMember.findUnique.mockResolvedValue({ role: "founder" });
    const ok = await guard.canActivate(
      mockContext({ companyId: "c1" }, { userId: "u1" }) as never,
    );
    expect(ok).toBe(true);
  });

  it("denies non-member", async () => {
    prisma.companyMember.findUnique.mockResolvedValue(null);
    await expect(
      guard.canActivate(mockContext({ companyId: "c1" }, { userId: "u2" }) as never),
    ).rejects.toThrow(ForbiddenException);
  });
});
