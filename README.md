# Project Grayscale

**Run Your Company Like You Already Have an Executive Team.**

AI Company Operating System for founders — Phase 1: Founder Memory.

## Quick Start

```bash
# Prerequisites: Node 22+, pnpm, Docker

cp .env.example .env
docker compose up -d          # PostgreSQL + Redis
pnpm install
pnpm db:push                  # Apply Prisma schema
pnpm dev                      # All apps (web + backend)
```

| Service | URL |
|---------|-----|
| Web | http://localhost:3000 |
| API | http://localhost:4000 |
| API Docs | http://localhost:4000/api/docs |

## Repository Structure

```
apps/
  web/          Next.js 15 — founder dashboard
  desktop/      Tauri — desktop shell
  mobile/       Flutter — mobile app
backend/        NestJS API
packages/
  shared/       Types, events, constants, validation
  agents/       Agent runtime, executive definitions
docs/           Architecture, ADRs
prompts/        Executive agent prompt packs
design-system/  Tokens, typography, component specs
scripts/        Dev tooling
tests/          E2E and integration tests
```

## Development Phases

1. **Founder Memory** — company memory, journal, timeline, knowledge graph
2. **Founder OS** — eight AI executives
3. **Company OS** — multi-user departments
4. **Autonomous Company** — cross-department orchestration

## Doctrine

Revenue before Complexity · Automation before Hiring · Execution before Perfection  
Privacy before Convenience · Context before Action
