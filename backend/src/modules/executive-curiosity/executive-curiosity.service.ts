import { Injectable } from "@nestjs/common";
import type {
  CuriosityInvestigation,
  CuriosityQuestion,
  ExecutiveCuriosityEnginePort,
} from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ExecutiveCuriosityService implements ExecutiveCuriosityEnginePort {
  constructor(private readonly prisma: PrismaService) {}

  async ask(
    input: Omit<CuriosityQuestion, "id" | "status" | "createdAt" | "investigationId">,
  ): Promise<CuriosityQuestion> {
    const row = await this.prisma.executiveCuriosityQuestion.create({
      data: {
        companyId: input.companyId,
        executiveId: input.executiveId,
        questionType: input.questionType,
        question: input.question,
        context: input.context,
      },
    });
    return this.toQuestion(row);
  }

  async startInvestigation(questionId: string): Promise<CuriosityInvestigation> {
    const question = await this.prisma.executiveCuriosityQuestion.findUnique({
      where: { id: questionId },
    });
    if (!question) throw new Error("Question not found");

    const inv = await this.prisma.executiveCuriosityInvestigation.create({
      data: {
        companyId: question.companyId,
        executiveId: question.executiveId,
        questionId: question.id,
        status: "in_progress",
      },
    });

    await this.prisma.executiveCuriosityQuestion.update({
      where: { id: questionId },
      data: { status: "investigating", investigationId: inv.id },
    });

    return this.toInvestigation(inv);
  }

  async completeInvestigation(
    investigationId: string,
    findings: string,
    evidenceRefs: string[],
  ): Promise<CuriosityInvestigation> {
    const inv = await this.prisma.executiveCuriosityInvestigation.update({
      where: { id: investigationId },
      data: {
        findings,
        evidenceRefs,
        status: "completed",
        completedAt: new Date(),
      },
    });

    await this.prisma.executiveCuriosityQuestion.updateMany({
      where: { investigationId },
      data: { status: "resolved" },
    });

    return this.toInvestigation(inv);
  }

  async listOpenQuestions(companyId: string, executiveId: string): Promise<CuriosityQuestion[]> {
    const rows = await this.prisma.executiveCuriosityQuestion.findMany({
      where: { companyId, executiveId, status: { in: ["open", "investigating"] } },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((r) => this.toQuestion(r));
  }

  async listInvestigations(companyId: string, executiveId: string): Promise<CuriosityInvestigation[]> {
    const rows = await this.prisma.executiveCuriosityInvestigation.findMany({
      where: { companyId, executiveId },
      orderBy: { startedAt: "desc" },
      take: 50,
    });
    return rows.map((r) => this.toInvestigation(r));
  }

  assertNoDirectRecommendation(): true {
    return true;
  }

  private toQuestion(row: {
    id: string;
    companyId: string;
    executiveId: string;
    questionType: string;
    question: string;
    context: string | null;
    status: string;
    investigationId: string | null;
    createdAt: Date;
  }): CuriosityQuestion {
    return {
      id: row.id,
      companyId: row.companyId,
      executiveId: row.executiveId,
      questionType: row.questionType as CuriosityQuestion["questionType"],
      question: row.question,
      context: row.context ?? undefined,
      status: row.status as CuriosityQuestion["status"],
      investigationId: row.investigationId ?? undefined,
      createdAt: row.createdAt.toISOString(),
    };
  }

  private toInvestigation(row: {
    id: string;
    companyId: string;
    executiveId: string;
    questionId: string;
    findings: string;
    evidenceRefs: string[];
    status: string;
    startedAt: Date;
    completedAt: Date | null;
  }): CuriosityInvestigation {
    return {
      id: row.id,
      companyId: row.companyId,
      executiveId: row.executiveId,
      questionId: row.questionId,
      findings: row.findings,
      evidenceRefs: row.evidenceRefs,
      status: row.status as CuriosityInvestigation["status"],
      startedAt: row.startedAt.toISOString(),
      completedAt: row.completedAt?.toISOString(),
    };
  }
}
