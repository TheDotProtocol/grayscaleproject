-- Phase 1.5B: Organizational Memory Engine — unified search index

CREATE TABLE "memory_records" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "user_id" TEXT,
    "department" TEXT,
    "memory_type" TEXT NOT NULL,
    "source_table" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "tags" TEXT[],
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "occurred_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "memory_records_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "memory_records_source_table_source_id_key" ON "memory_records"("source_table", "source_id");
CREATE INDEX "memory_records_company_id_memory_type_idx" ON "memory_records"("company_id", "memory_type");
CREATE INDEX "memory_records_company_id_occurred_at_idx" ON "memory_records"("company_id", "occurred_at" DESC);

ALTER TABLE "memory_records" ADD CONSTRAINT "memory_records_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
