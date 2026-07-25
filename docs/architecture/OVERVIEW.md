# Project Grayscale — System Architecture

**Tagline:** Run Your Company Like You Already Have an Executive Team.

## North Star

Maximize founder probability of building a healthy, revenue-generating company.

Every feature must answer: *"Does this increase founder success probability?"*

---

## Architectural Recommendations (Founding Engineer Assessment)

### 1. Unified data plane first — PostgreSQL + pgvector

| Option | Cost | Verdict |
|--------|------|---------|
| PostgreSQL + pgvector | Free (self-hosted) | **Recommended Phase 1–2** |
| Pinecone / Weaviate Cloud | $70–300+/mo | Defer until scale demands |
| Neo4j for knowledge graph | Extra infra + ops | Defer — model graph in Postgres first |

**Why:** One database reduces ops burden, backup complexity, and cost. pgvector handles semantic search for Memory Engine. Graph edges as `knowledge_edges` table is sufficient until millions of nodes.

**Confidence:** High · **ROI:** Eliminates 2–3 paid services in year one.

---

### 2. Event bus — BullMQ on Redis (not Kafka)

| Option | Cost | Verdict |
|--------|------|---------|
| BullMQ + Redis | Free (Docker) | **Recommended Phase 1–3** |
| Kafka / Redpanda | Heavy ops | Phase 4+ at scale |
| In-process EventEmitter | Free | Dev only — not durable |

**Why:** BullMQ gives durable jobs, retries, scheduling, and department fan-out. Same Redis instance serves cache + sessions. Kafka is overkill for <100k events/day.

**Confidence:** High · **ROI:** $0 infra vs managed Kafka ~$200/mo.

---

### 3. Platform priority — Web → Desktop → Mobile parity

| Platform | Phase 1 Priority | Rationale |
|----------|------------------|-----------|
| Web (Next.js) | **P0** | Fastest iteration, founder daily driver |
| Desktop (Tauri) | P1 | Native feel, local file access, Cursor adjacency |
| Mobile (Flutter) | P1 scaffold | Notifications, briefings on-the-go |

**Why:** Building three full UIs before Memory Engine works violates "Execution before Perfection." Scaffold all three; ship web + API first.

**Confidence:** High · **ROI:** 3x faster Phase 1 delivery.

---

### 4. AI provider abstraction — mandatory from day one

```
packages/agents → AgentRuntime → ProviderAdapter (OpenAI | Anthropic | Gemini | Ollama)
```

**Why:** Vendor lock-in kills margin. Local Ollama for dev/sensitive data aligns with "Privacy before Convenience."

**Confidence:** Critical · **ROI:** 40–70% cost reduction via model routing.

---

### 5. Auth — JWT + refresh rotation, passkey-ready

NestJS `@nestjs/passport` + bcrypt + optional WebAuthn Phase 2.

**Why:** No Auth0 ($25+/mo) until enterprise SSO required.

**Confidence:** High · **ROI:** ~$300/yr saved at seed stage.

---

## System Diagram (Phase 1–2)

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Web App    │  │ Tauri Desk  │  │   Flutter   │
│  Next.js 15 │  │             │  │   Mobile    │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                │
       └────────────────┼────────────────┘
                        ▼
              ┌─────────────────┐
              │   NestJS API    │
              │   (REST + WS)   │
              └────────┬────────┘
                       │
       ┌───────────────┼───────────────┐
       ▼               ▼               ▼
┌────────────┐  ┌────────────┐  ┌────────────┐
│ PostgreSQL │  │   Redis    │  │  BullMQ    │
│ + pgvector │  │  cache/sess│  │ event bus  │
└────────────┘  └────────────┘  └────────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  Agent Runtime  │
              │  (8 Executives) │
              └─────────────────┘
```

---

## Bounded Contexts

| Context | Phase | Owner Module |
|---------|-------|--------------|
| Founder Memory | 1 | `memory`, `timeline`, `knowledge-graph` |
| Identity & Auth | 1 | `auth`, `founder-profile` |
| Executive Agents | 2 | `agents` |
| Event Orchestration | 2–3 | `events` |
| Notifications | 1 | `notifications` |
| Billing Reminders | 1 | `billing` |
| Integrations | 2 | `integrations` |
| AI Providers | 1 | `ai-providers` |

---

## The Eight Executives

| Agent | Role | Department |
|-------|------|------------|
| Athena | Chief of Staff | Operations |
| Atlas | CTO | Engineering |
| Ledger | CFO | Finance |
| Mercury | CGO | Growth |
| Nova | Executive Assistant | Personal Ops |
| HackBox | CSO | Security |
| Market Intelligence | CIO | Intelligence |
| Bounce Box | CSO (Strategy) | Strategy |

Each agent: own prompt pack (`/prompts`), tool permissions, memory scope, event subscriptions.

---

## Critical Decision Gate

All agent actions that mutate external state, spend money, or send communications require **human approval** (Approve / Amend / Reject).

---

## Tech Stack (Confirmed)

| Layer | Technology |
|-------|------------|
| Monorepo | pnpm + Turborepo |
| Web | Next.js 15, TypeScript, Tailwind, shadcn/ui |
| Desktop | Tauri 2 |
| Mobile | Flutter |
| API | NestJS 11 |
| ORM | Prisma |
| DB | PostgreSQL 16 + pgvector |
| Cache/Queue | Redis 7 + BullMQ |
| CI/CD | GitHub Actions |
| Containers | Docker Compose (dev) |
