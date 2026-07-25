import { Injectable } from "@nestjs/common";
import type { PulseV2Port, PlatformPulseAggregate, DomainPulseHealth, PulseDomain } from "@grayscale/platform";
import { PULSE_DOMAINS } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";
import { PulseEngineService } from "../pulse/pulse-engine.service";

const DOMAIN_MAP: Record<string, PulseDomain> = {
  project: "engineering",
  repository: "engineering",
  sprint: "engineering",
  billing: "financial",
  meeting: "business",
  integration: "operational",
  ai: "innovation",
  system: "infrastructure",
};

@Injectable()
export class PulseV2Service implements PulseV2Port {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pulse: PulseEngineService,
  ) {}

  async aggregateDomains(companyId: string): Promise<PlatformPulseAggregate> {
    const since = new Date();
    since.setHours(since.getHours() - 24);

    const events = await this.prisma.pulseEvent.findMany({
      where: { companyId, createdAt: { gte: since } },
    });

    const domains: DomainPulseHealth[] = PULSE_DOMAINS.map((domain) => {
      const mapped = events.filter((e) => DOMAIN_MAP[e.category] === domain);
      const critical = mapped.filter((e) => e.severity === "critical").length;
      const warning = mapped.filter((e) => e.severity === "warning").length;
      let score = 100 - critical * 15 - warning * 5;
      score = Math.max(0, Math.min(100, score));
      const status: DomainPulseHealth["status"] =
        critical > 0 ? "critical" : warning > 2 ? "attention" : "healthy";
      return {
        domain,
        score,
        status,
        eventCount24h: mapped.length,
        lastEventAt: mapped[0]?.createdAt.toISOString(),
      };
    });

    const overallScore = Math.round(domains.reduce((s, d) => s + d.score, 0) / domains.length);
    const status: PlatformPulseAggregate["status"] =
      domains.some((d) => d.status === "critical") ? "critical"
        : domains.some((d) => d.status === "attention") ? "attention" : "healthy";

    return { overallScore, status, domains, computedAt: new Date().toISOString() };
  }
}
