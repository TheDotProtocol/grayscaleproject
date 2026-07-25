import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

const TEST_USER = {
  email: "akumartrabaajo@gmail.com",
  password: "Ak1233@@5",
  name: "Ak Kumar",
  companyName: "Trabaajo",
};

async function main() {
  const passwordHash = await bcrypt.hash(TEST_USER.password, 12);
  const slug = `trabaajo-${Date.now()}`;

  const existing = await prisma.user.findUnique({
    where: { email: TEST_USER.email },
  });

  if (existing) {
    await prisma.user.update({
      where: { email: TEST_USER.email },
      data: { passwordHash, name: TEST_USER.name },
    });

    const membership = await prisma.companyMember.findFirst({
      where: { userId: existing.id },
      include: { company: true },
    });

    if (!membership) {
      const company = await prisma.company.create({
        data: {
          name: TEST_USER.companyName,
          slug: `trabaajo-${Date.now()}`,
          stage: "idea",
          industry: "Technology",
          members: { create: { userId: existing.id, role: "founder" } },
        },
      });
      console.log(`Created company for existing user: ${company.name}`);
    }

    console.log(`Updated test user: ${TEST_USER.email}`);
    return;
  }

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: TEST_USER.email,
        passwordHash,
        name: TEST_USER.name,
        founderProfile: { create: { timezone: "UTC" } },
      },
    });

    const company = await tx.company.create({
      data: {
        name: TEST_USER.companyName,
        slug,
        stage: "idea",
        industry: "Technology",
        members: { create: { userId: user.id, role: "founder" } },
      },
    });

    console.log(`Seeded test user: ${TEST_USER.email}`);
    console.log(`Company: ${company.name} (${company.id})`);

    await seedPulseEvents(tx, company.id);
  });
}

async function seedPulseEvents(
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  companyId: string,
) {
  const pulses = [
    {
      type: "sprint.completed",
      domainType: "sprint.completed",
      title: "Sprint completed",
      summary: "Repository audit and architecture review finished",
      severity: "success",
      category: "sprint",
    },
    {
      type: "project.updated",
      domainType: "memory.created",
      title: "Project updated",
      summary: "Platform foundation documentation created",
      severity: "info",
      category: "project",
    },
  ];

  for (const p of pulses) {
    await tx.pulseEvent.create({
      data: {
        companyId,
        type: p.type,
        domainType: p.domainType,
        title: p.title,
        summary: p.summary,
        severity: p.severity,
        category: p.category,
        correlationId: crypto.randomUUID(),
        source: "seed",
      },
    });
  }
  console.log(`Seeded ${pulses.length} pulse events`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
