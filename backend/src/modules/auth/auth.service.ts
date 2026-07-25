import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../../prisma/prisma.service";
import { RegisterDto, LoginDto } from "./auth.dto";
import {
  generateRefreshToken,
  hashRefreshToken,
  refreshTokenExpiresAt,
} from "./token.util";

@Injectable()
export class AuthService {
  private readonly refreshExpiresDays: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    config: ConfigService,
  ) {
    const raw = config.get<string>("JWT_REFRESH_EXPIRES_IN") ?? "7d";
    this.refreshExpiresDays = raw.endsWith("d") ? parseInt(raw, 10) : 7;
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException("Email already registered");

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const slug = dto.companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          passwordHash,
          name: dto.name,
          founderProfile: { create: { timezone: dto.timezone ?? "UTC" } },
        },
      });

      const company = await tx.company.create({
        data: {
          name: dto.companyName,
          slug: `${slug}-${Date.now()}`,
          stage: dto.stage ?? "idea",
          industry: dto.industry,
          members: { create: { userId: user.id, role: "founder" } },
        },
      });

      return { user, company };
    });

    return this.buildAuthResponse(
      result.user.id,
      result.user.email,
      result.user.name,
      result.company.id,
      result.company.name,
    );
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        companies: { include: { company: true }, take: 1 },
      },
    });
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException("Invalid credentials");

    const company = user.companies[0]?.company;
    return this.buildAuthResponse(
      user.id,
      user.email,
      user.name,
      company?.id,
      company?.name,
    );
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException("Refresh token required");

    const tokenHash = hashRefreshToken(refreshToken);
    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: {
        user: {
          include: {
            companies: { include: { company: true }, take: 1 },
          },
        },
      },
    });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    const company = stored.user.companies[0]?.company;
    return this.buildAuthResponse(
      stored.user.id,
      stored.user.email,
      stored.user.name,
      company?.id,
      company?.name,
    );
  }

  async logout(refreshToken: string) {
    if (!refreshToken) return { ok: true };

    const tokenHash = hashRefreshToken(refreshToken);
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    return { ok: true };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        founderProfile: true,
        companies: { include: { company: true } },
      },
    });
    if (!user) throw new UnauthorizedException();
    const { passwordHash: _, ...safe } = user;
    return safe;
  }

  private async buildAuthResponse(
    userId: string,
    email: string,
    name: string,
    companyId?: string,
    companyName?: string,
  ) {
    const accessToken = this.jwt.sign({ sub: userId, email });
    const refreshToken = generateRefreshToken();

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: hashRefreshToken(refreshToken),
        expiresAt: refreshTokenExpiresAt(this.refreshExpiresDays),
      },
    });

    return {
      accessToken,
      refreshToken,
      user: { id: userId, email, name },
      company: companyId ? { id: companyId, name: companyName } : null,
    };
  }
}
