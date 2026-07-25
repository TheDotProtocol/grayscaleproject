-- Phase 1.5H: Platform Operations & Reliability

CREATE TABLE "platform_metric_snapshots" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "labels" JSONB NOT NULL DEFAULT '{}',
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "platform_metric_snapshots_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "platform_metric_snapshots_category_recorded_at_idx" ON "platform_metric_snapshots"("category", "recorded_at");
CREATE INDEX "platform_metric_snapshots_name_recorded_at_idx" ON "platform_metric_snapshots"("name", "recorded_at");

CREATE TABLE "diagnostic_snapshots" (
    "id" TEXT NOT NULL,
    "company_id" TEXT,
    "findings" JSONB NOT NULL DEFAULT '[]',
    "summary" JSONB NOT NULL DEFAULT '{}',
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "diagnostic_snapshots_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "diagnostic_snapshots_recorded_at_idx" ON "diagnostic_snapshots"("recorded_at");

CREATE TABLE "reliability_snapshots" (
    "id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "profile" JSONB NOT NULL,
    "window" TEXT NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reliability_snapshots_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "reliability_snapshots_service_id_recorded_at_idx" ON "reliability_snapshots"("service_id", "recorded_at");

CREATE TABLE "platform_infra_cost_snapshots" (
    "id" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "breakdown" JSONB NOT NULL DEFAULT '{}',
    "total_estimated_cents" INTEGER NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "platform_infra_cost_snapshots_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "platform_infra_cost_snapshots_period_key" ON "platform_infra_cost_snapshots"("period");

CREATE TABLE "platform_recovery_operations" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "subsystem" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "parameters" JSONB NOT NULL DEFAULT '{}',
    "result" JSONB,
    "error" TEXT,
    "initiated_by" TEXT,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    CONSTRAINT "platform_recovery_operations_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "platform_recovery_operations_status_idx" ON "platform_recovery_operations"("status");

CREATE TABLE "platform_readiness_reports" (
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "verdict" TEXT NOT NULL,
    "overall_score" INTEGER NOT NULL,
    "sections" JSONB NOT NULL DEFAULT '[]',
    "blockers" JSONB NOT NULL DEFAULT '[]',
    "generated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "platform_readiness_reports_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "platform_readiness_reports_generated_at_idx" ON "platform_readiness_reports"("generated_at");

CREATE TABLE "platform_snapshots" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "tables" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "platform_snapshots_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "governance_entries" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "actor_id" TEXT,
    "correlation_id" TEXT NOT NULL,
    "event_id" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "governance_entries_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "governance_entries_type_recorded_at_idx" ON "governance_entries"("type", "recorded_at");
CREATE INDEX "governance_entries_correlation_id_idx" ON "governance_entries"("correlation_id");

CREATE TABLE "security_finding_snapshots" (
    "id" TEXT NOT NULL,
    "company_id" TEXT,
    "score" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "findings" JSONB NOT NULL DEFAULT '[]',
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "security_finding_snapshots_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "security_finding_snapshots_recorded_at_idx" ON "security_finding_snapshots"("recorded_at");
