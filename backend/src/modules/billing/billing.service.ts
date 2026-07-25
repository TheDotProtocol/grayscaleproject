import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { EventsService } from "../events/events.service";
import { DOMAIN_EVENTS } from "@grayscale/shared";

@Injectable()
export class BillingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventsService,
  ) {}

  async list(companyId: string) {
    return this.prisma.bill.findMany({
      where: { companyId },
      orderBy: { dueDate: "asc" },
    });
  }

  async create(
    companyId: string,
    data: {
      name: string;
      amountCents: number;
      currency?: string;
      dueDate: string;
      recurrence?: string;
      category?: string;
    },
  ) {
    return this.prisma.bill.create({
      data: {
        companyId,
        name: data.name,
        amountCents: data.amountCents,
        currency: data.currency ?? "USD",
        dueDate: new Date(data.dueDate),
        recurrence: data.recurrence ?? "monthly",
        category: data.category,
      },
    });
  }

  async update(
    companyId: string,
    billId: string,
    data: { isPaid?: boolean; name?: string; amountCents?: number; dueDate?: string },
  ) {
    const bill = await this.prisma.bill.findFirst({
      where: { id: billId, companyId },
    });
    if (!bill) throw new NotFoundException("Bill not found");
    return this.prisma.bill.update({
      where: { id: billId },
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        paidAt: data.isPaid ? new Date() : data.isPaid === false ? null : undefined,
      },
    });
  }

  /** Check for bills due within N days and emit reminder events */
  async checkUpcomingReminders(companyId: string, daysAhead = 7) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + daysAhead);

    const upcoming = await this.prisma.bill.findMany({
      where: {
        companyId,
        isPaid: false,
        dueDate: { lte: cutoff, gte: new Date() },
      },
    });

    for (const bill of upcoming) {
      await this.events.publish(DOMAIN_EVENTS.BILL_DUE_SOON, companyId, bill);
    }

    const overdue = await this.prisma.bill.findMany({
      where: { companyId, isPaid: false, dueDate: { lt: new Date() } },
    });
    for (const bill of overdue) {
      await this.events.publish(DOMAIN_EVENTS.BILL_OVERDUE, companyId, bill);
    }

    return { upcoming, overdue };
  }
}
