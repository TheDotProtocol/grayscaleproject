-- Sprint 2 Phase B — Executive Notebook, Curiosity, Skeptic support

CREATE TABLE "executive_notebook_entries" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "executive_id" TEXT NOT NULL,
    "entry_type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "previous_entry_id" TEXT,
    "memory_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "graph_node_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "event_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "investigation_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "correlation_id" TEXT NOT NULL,
    "source_event_id" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "executive_notebook_entries_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "executive_notebook_entries_company_id_executive_id_entry_type_idx"
    ON "executive_notebook_entries"("company_id", "executive_id", "entry_type");
CREATE INDEX "executive_notebook_entries_company_id_executive_id_created_at_idx"
    ON "executive_notebook_entries"("company_id", "executive_id", "created_at");

ALTER TABLE "executive_notebook_entries"
    ADD CONSTRAINT "executive_notebook_entries_company_id_fkey"
    FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "executive_curiosity_questions" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "executive_id" TEXT NOT NULL,
    "question_type" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "context" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "investigation_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "executive_curiosity_questions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "executive_curiosity_questions_company_id_executive_id_status_idx"
    ON "executive_curiosity_questions"("company_id", "executive_id", "status");

ALTER TABLE "executive_curiosity_questions"
    ADD CONSTRAINT "executive_curiosity_questions_company_id_fkey"
    FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "executive_curiosity_investigations" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "executive_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "findings" TEXT NOT NULL DEFAULT '',
    "evidence_refs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" TEXT NOT NULL DEFAULT 'open',
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "executive_curiosity_investigations_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "executive_curiosity_investigations_company_id_executive_id_status_idx"
    ON "executive_curiosity_investigations"("company_id", "executive_id", "status");

ALTER TABLE "executive_curiosity_investigations"
    ADD CONSTRAINT "executive_curiosity_investigations_company_id_fkey"
    FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
