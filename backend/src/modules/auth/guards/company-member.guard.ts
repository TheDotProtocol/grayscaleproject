import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../auth.decorators";
import { PrismaService } from "../../../prisma/prisma.service";

export const SKIP_COMPANY_GUARD_KEY = "skipCompanyGuard";

/** Skip company membership check when authorization is handled in the service */
export const SkipCompanyGuard = () => SetMetadata(SKIP_COMPANY_GUARD_KEY, true);

/**
 * Ensures the authenticated user is a member of :companyId routes.
 * Applied globally; no-ops when route has no companyId param.
 */
@Injectable()
export class CompanyMemberGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_COMPANY_GUARD_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skip) return true;

    const request = context.switchToHttp().getRequest<{
      params?: { companyId?: string };
      user?: { userId: string };
      companyRole?: string;
    }>();

    const companyId = request.params?.companyId;
    if (!companyId) return true;

    const userId = request.user?.userId;
    if (!userId) return false;

    const membership = await this.prisma.companyMember.findUnique({
      where: { companyId_userId: { companyId, userId } },
    });

    if (!membership) {
      throw new ForbiddenException("You do not have access to this company");
    }

    request.companyRole = membership.role;
    return true;
  }
}
