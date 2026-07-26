# Quick Start

Get Grayscale OS running in minutes.

---

## Prerequisites

- Node.js 22+ (24+ recommended)
- pnpm 9+
- Docker (PostgreSQL + Redis)

---

## Install

```bash
git clone https://github.com/TheDotProtocol/grayscaleproject.git
cd grayscaleproject
cp .env.example .env
docker compose up -d
pnpm install
pnpm db:push
pnpm dev
```

---

## Open Grayscale

| Service | URL |
|---------|-----|
| Website & Docs | http://localhost:3000 |
| Documentation | http://localhost:3000/docs |
| Founder Workspace | http://localhost:3000/dashboard |
| API | http://localhost:4000 |

Register at `/register`, then open **Command Bridge** at `/dashboard/home`.

---

## Next Steps

- [Installation Guide](/docs/installation) — detailed setup
- [Architecture](/docs/architecture) — platform overview
- [Plugin Development](/docs/plugins) — build your first plugin
- [API Reference](/docs/api) — integrate with Grayscale
