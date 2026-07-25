-- Phase 1.5G: Mission Control Live

CREATE TABLE "mission_control_layouts" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "widgets" JSONB NOT NULL DEFAULT '[]',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mission_control_layouts_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "mission_control_layouts_company_id_user_id_key" ON "mission_control_layouts"("company_id", "user_id");

ALTER TABLE "mission_control_layouts" ADD CONSTRAINT "mission_control_layouts_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "platform_health_snapshots" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "breakdown" JSONB NOT NULL DEFAULT '{}',
    "services" JSONB NOT NULL DEFAULT '[]',
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "platform_health_snapshots_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "platform_health_snapshots_company_id_recorded_at_idx" ON "platform_health_snapshots"("company_id", "recorded_at");

ALTER TABLE "platform_health_snapshots" ADD CONSTRAINT "platform_health_snapshots_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "readiness_snapshots" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "overall_score" INTEGER NOT NULL,
    "data_completeness" DOUBLE PRECISION NOT NULL,
    "dimensions" JSONB NOT NULL DEFAULT '[]',
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "readiness_snapshots_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "readiness_snapshots_company_id_recorded_at_idx" ON "readiness_snapshots"("company_id", "recorded_at");

ALTER TABLE "readiness_snapshots" ADD CONSTRAINT "readiness_snapshots_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "platform_jobs" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "action_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "payload" JSONB NOT NULL DEFAULT '{}',
    "result" JSONB,
    "error" TEXT,
    "user_id" TEXT,
    "correlation_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "platform_jobs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "platform_jobs_company_id_status_idx" ON "platform_jobs"("company_id", "status");
CREATE INDEX "platform_jobs_correlation_id_idx" ON "platform_jobs"("correlation_id");

ALTER TABLE "platform_jobs" ADD CONSTRAINT "platform_jobs_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
