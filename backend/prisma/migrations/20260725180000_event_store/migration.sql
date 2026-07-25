-- Phase 1.5A: Immutable domain event store + dead letter tracking

CREATE TABLE "domain_events" (
    "id" TEXT NOT NULL,
    "sequence" BIGSERIAL NOT NULL,
    "company_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "user_id" TEXT,
    "payload" JSONB NOT NULL,
    "correlation_id" TEXT NOT NULL,
    "causation_id" TEXT,
    "trace_id" TEXT,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "processed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "domain_events_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "domain_event_failures" (
    "id" TEXT NOT NULL,
    "domain_event_id" TEXT NOT NULL,
    "projector" TEXT,
    "error" TEXT NOT NULL,
    "stack" TEXT,
    "attempt" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "domain_event_failures_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "domain_events_company_id_sequence_idx" ON "domain_events"("company_id", "sequence");
CREATE INDEX "domain_events_company_id_type_idx" ON "domain_events"("company_id", "type");
CREATE INDEX "domain_events_correlation_id_idx" ON "domain_events"("correlation_id");
CREATE INDEX "domain_events_status_idx" ON "domain_events"("status");
CREATE INDEX "domain_event_failures_domain_event_id_idx" ON "domain_event_failures"("domain_event_id");

ALTER TABLE "domain_events" ADD CONSTRAINT "domain_events_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "domain_event_failures" ADD CONSTRAINT "domain_event_failures_domain_event_id_fkey" FOREIGN KEY ("domain_event_id") REFERENCES "domain_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
