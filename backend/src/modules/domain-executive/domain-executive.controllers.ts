import { Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { DomainExecutiveService } from "./domain-executive.service";

abstract class DomainExecutiveControllerBase {
  constructor(
    protected readonly domainExecutive: DomainExecutiveService,
    protected readonly executiveId: string,
  ) {}

  status(@Param("companyId") companyId: string) {
    return this.domainExecutive.getStatus(companyId, this.executiveId);
  }

  discovery(@Param("companyId") companyId: string, @Param("instanceId") instanceId: string) {
    return this.domainExecutive.runDiscovery(companyId, this.executiveId, instanceId);
  }

  draft(@Param("companyId") companyId: string, @Param("instanceId") instanceId: string) {
    return this.domainExecutive.draftRecommendations(companyId, this.executiveId, instanceId);
  }
}

@ApiTags("atlas")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("companies/:companyId/atlas")
export class AtlasController extends DomainExecutiveControllerBase {
  constructor(domainExecutive: DomainExecutiveService) {
    super(domainExecutive, "atlas");
  }

  @Get("status")
  override status(@Param("companyId") companyId: string) {
    return super.status(companyId);
  }

  @Post("instances/:instanceId/discovery")
  override discovery(@Param("companyId") companyId: string, @Param("instanceId") instanceId: string) {
    return super.discovery(companyId, instanceId);
  }

  @Post("instances/:instanceId/recommendations/draft")
  override draft(@Param("companyId") companyId: string, @Param("instanceId") instanceId: string) {
    return super.draft(companyId, instanceId);
  }
}

@ApiTags("ledger")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("companies/:companyId/ledger")
export class LedgerController extends DomainExecutiveControllerBase {
  constructor(domainExecutive: DomainExecutiveService) {
    super(domainExecutive, "ledger");
  }

  @Get("status")
  override status(@Param("companyId") companyId: string) {
    return super.status(companyId);
  }

  @Post("instances/:instanceId/discovery")
  override discovery(@Param("companyId") companyId: string, @Param("instanceId") instanceId: string) {
    return super.discovery(companyId, instanceId);
  }

  @Post("instances/:instanceId/recommendations/draft")
  override draft(@Param("companyId") companyId: string, @Param("instanceId") instanceId: string) {
    return super.draft(companyId, instanceId);
  }
}

@ApiTags("mercury")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("companies/:companyId/mercury")
export class MercuryController extends DomainExecutiveControllerBase {
  constructor(domainExecutive: DomainExecutiveService) {
    super(domainExecutive, "mercury");
  }

  @Get("status")
  override status(@Param("companyId") companyId: string) {
    return super.status(companyId);
  }

  @Post("instances/:instanceId/discovery")
  override discovery(@Param("companyId") companyId: string, @Param("instanceId") instanceId: string) {
    return super.discovery(companyId, instanceId);
  }

  @Post("instances/:instanceId/recommendations/draft")
  override draft(@Param("companyId") companyId: string, @Param("instanceId") instanceId: string) {
    return super.draft(companyId, instanceId);
  }
}

@ApiTags("sentinel")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("companies/:companyId/sentinel")
export class SentinelController extends DomainExecutiveControllerBase {
  constructor(domainExecutive: DomainExecutiveService) {
    super(domainExecutive, "sentinel");
  }

  @Get("status")
  override status(@Param("companyId") companyId: string) {
    return super.status(companyId);
  }

  @Post("instances/:instanceId/discovery")
  override discovery(@Param("companyId") companyId: string, @Param("instanceId") instanceId: string) {
    return super.discovery(companyId, instanceId);
  }

  @Post("instances/:instanceId/recommendations/draft")
  override draft(@Param("companyId") companyId: string, @Param("instanceId") instanceId: string) {
    return super.draft(companyId, instanceId);
  }
}

@ApiTags("navigator")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("companies/:companyId/navigator")
export class NavigatorController extends DomainExecutiveControllerBase {
  constructor(domainExecutive: DomainExecutiveService) {
    super(domainExecutive, "navigator");
  }

  @Get("status")
  override status(@Param("companyId") companyId: string) {
    return super.status(companyId);
  }

  @Post("instances/:instanceId/discovery")
  override discovery(@Param("companyId") companyId: string, @Param("instanceId") instanceId: string) {
    return super.discovery(companyId, instanceId);
  }

  @Post("instances/:instanceId/recommendations/draft")
  override draft(@Param("companyId") companyId: string, @Param("instanceId") instanceId: string) {
    return super.draft(companyId, instanceId);
  }
}

@ApiTags("forge")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("companies/:companyId/forge")
export class ForgeController extends DomainExecutiveControllerBase {
  constructor(domainExecutive: DomainExecutiveService) {
    super(domainExecutive, "forge");
  }

  @Get("status")
  override status(@Param("companyId") companyId: string) {
    return super.status(companyId);
  }

  @Post("instances/:instanceId/discovery")
  override discovery(@Param("companyId") companyId: string, @Param("instanceId") instanceId: string) {
    return super.discovery(companyId, instanceId);
  }

  @Post("instances/:instanceId/recommendations/draft")
  override draft(@Param("companyId") companyId: string, @Param("instanceId") instanceId: string) {
    return super.draft(companyId, instanceId);
  }
}
