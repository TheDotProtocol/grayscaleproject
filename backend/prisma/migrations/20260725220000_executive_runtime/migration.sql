-- Phase 1.5E: Executive Runtime Framework

CREATE TABLE "executive_instances" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "executive_id" TEXT NOT NULL,
    "lifecycle_state" TEXT NOT NULL DEFAULT 'created',
    "capabilities" JSONB NOT NULL DEFAULT '[]',
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "last_context_at" TIMESTAMP(3),
    "last_activity_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "executive_instances_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "executive_messages" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "instance_id" TEXT,
    "message_type" TEXT NOT NULL,
    "from_executive_id" TEXT,
    "to_executive_id" TEXT,
    "subject" TEXT NOT NULL,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "correlation_id" TEXT NOT NULL,
    "trace_id" TEXT,
    "causation_id" TEXT,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "max_retries" INTEGER NOT NULL DEFAULT 3,
    "timeout_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delivered_at" TIMESTAMP(3),
    CONSTRAINT "executive_messages_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "executive_inbox_items" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "instance_id" TEXT NOT NULL,
    "executive_id" TEXT NOT NULL,
    "queue" TEXT NOT NULL,
    "item_type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "correlation_id" TEXT,
    "trace_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "executive_inbox_items_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "executive_audit_logs" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "instance_id" TEXT,
    "executive_id" TEXT,
    "action" TEXT NOT NULL,
    "actor_type" TEXT NOT NULL,
    "actor_id" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "correlation_id" TEXT,
    "trace_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "executive_audit_logs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "executive_outputs" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "instance_id" TEXT NOT NULL,
    "executive_id" TEXT NOT NULL,
    "output_type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "explainability" JSONB NOT NULL,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "correlation_id" TEXT NOT NULL,
    "trace_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "executive_outputs_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "executive_instances_company_id_executive_id_key" ON "executive_instances"("company_id", "executive_id");
CREATE INDEX "executive_instances_company_id_lifecycle_state_idx" ON "executive_instances"("company_id", "lifecycle_state");
CREATE INDEX "executive_messages_company_id_to_executive_id_status_idx" ON "executive_messages"("company_id", "to_executive_id", "status");
CREATE INDEX "executive_messages_correlation_id_idx" ON "executive_messages"("correlation_id");
CREATE INDEX "executive_inbox_items_instance_id_queue_idx" ON "executive_inbox_items"("instance_id", "queue");
CREATE INDEX "executive_inbox_items_company_id_executive_id_idx" ON "executive_inbox_items"("company_id", "executive_id");
CREATE INDEX "executive_audit_logs_company_id_executive_id_idx" ON "executive_audit_logs"("company_id", "executive_id");
CREATE INDEX "executive_audit_logs_correlation_id_idx" ON "executive_audit_logs"("correlation_id");
CREATE INDEX "executive_outputs_company_id_executive_id_idx" ON "executive_outputs"("company_id", "executive_id");
CREATE INDEX "executive_outputs_instance_id_idx" ON "executive_outputs"("instance_id");

ALTER TABLE "executive_instances" ADD CONSTRAINT "executive_instances_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "executive_messages" ADD CONSTRAINT "executive_messages_instance_id_fkey" FOREIGN KEY ("instance_id") REFERENCES "executive_instances"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "executive_inbox_items" ADD CONSTRAINT "executive_inbox_items_instance_id_fkey" FOREIGN KEY ("instance_id") REFERENCES "executive_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "executive_audit_logs" ADD CONSTRAINT "executive_audit_logs_instance_id_fkey" FOREIGN KEY ("instance_id") REFERENCES "executive_instances"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "executive_outputs" ADD CONSTRAINT "executive_outputs_instance_id_fkey" FOREIGN KEY ("instance_id") REFERENCES "executive_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;
