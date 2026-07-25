import { Controller, Get, Post, Patch, Body, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { BillingService } from "./billing.service";

@ApiTags("billing")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("companies/:companyId/bills")
export class BillingController {
  constructor(private readonly billing: BillingService) {}

  @Get()
  list(@Param("companyId") companyId: string) {
    return this.billing.list(companyId);
  }

  @Post()
  create(
    @Param("companyId") companyId: string,
    @Body()
    body: {
      name: string;
      amountCents: number;
      currency?: string;
      dueDate: string;
      recurrence?: string;
      category?: string;
    },
  ) {
    return this.billing.create(companyId, body);
  }

  @Get("reminders")
  reminders(@Param("companyId") companyId: string) {
    return this.billing.checkUpcomingReminders(companyId);
  }

  @Patch(":billId")
  update(
    @Param("companyId") companyId: string,
    @Param("billId") billId: string,
    @Body() body: { isPaid?: boolean; name?: string; amountCents?: number; dueDate?: string },
  ) {
    return this.billing.update(companyId, billId, body);
  }
}
