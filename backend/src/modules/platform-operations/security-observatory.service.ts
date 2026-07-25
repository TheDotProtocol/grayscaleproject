import { Injectable } from "@nestjs/common";
import type { SecurityObservatoryPort, SecurityHealthSnapshot, SecurityFinding } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class SecurityObservatoryService implements SecurityObservatoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async assess(companyId?: string): Promise<SecurityHealthSnapshot> {
    const findings: SecurityFinding[] = [];

    const plaintext = await this.prisma.integration.count({
      where: { accessToken: { not: null }, ...(companyId ? { companyId } : {}) },
    });
    if (plaintext > 0) {
      findings.push(this.finding("secret_expiration", "critical", "Plaintext tokens detected", plaintext, { count: plaintext }));
    }

    const expiredCreds = await this.prisma.integrationCredential.count({
      where: { expiresAt: { lt: new Date() }, ...(companyId ? { companyId } : {}) },
    });
    if (expiredCreds > 0) {
      findings.push(this.finding("credential_rotation", "warning", "Expired credentials", expiredCreds, { count: expiredCreds }));
    }

    const auditCount = await this.prisma.credentialAuditLog.count({
      where: companyId ? { companyId } : {},
    });
    if (auditCount === 0) {
      findings.push(this.finding("audit_integrity", "info", "No credential audit history", 0, {}));
    }

    const critical = findings.filter((f) => f.severity === "critical").length;
    const score = Math.max(0, 100 - critical * 30 - findings.filter((f) => f.severity === "warning").length * 10);
    const status: SecurityHealthSnapshot["status"] =
      critical > 0 ? "compromised" : score < 70 ? "attention" : "secure";

    const snapshot: SecurityHealthSnapshot = { score, status, findings, computedAt: new Date().toISOString() };

    await this.prisma.securityFindingSnapshot.create({
      data: {
        companyId,
        score,
        status,
        findings: findings as object,
      },
    });

    return snapshot;
  }

  private finding(
    type: SecurityFinding["type"],
    severity: SecurityFinding["severity"],
    title: string,
    count: number,
    evidence: Record<string, unknown>,
  ): SecurityFinding {
    return {
      id: `sec-${type}-${Date.now()}`,
      type,
      severity,
      title,
      description: title,
      count,
      evidence,
      detectedAt: new Date().toISOString(),
    };
  }
}
