# Installation

Detailed installation for local development and evaluation.

---

## System Requirements

| Component | Requirement |
|-----------|-------------|
| Node.js | 22.x or 24.x |
| Package manager | pnpm 9+ |
| Database | PostgreSQL 16+ (via Docker) |
| Cache | Redis 7+ (via Docker) |
| OS | macOS, Linux, or WSL2 |

---

## Step-by-Step

### 1. Clone the repository

```bash
git clone https://github.com/TheDotProtocol/grayscaleproject.git
cd grayscaleproject
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your local settings. Never commit secrets.

### 3. Start infrastructure

```bash
docker compose up -d
```

### 4. Install dependencies

```bash
pnpm install
```

### 5. Apply database schema

```bash
pnpm db:push
```

### 6. Start development servers

```bash
cd apps/web && pnpm dev    # Web + docs on :3000
# In another terminal:
cd backend && pnpm dev     # API on :4000
```

Or from root: `pnpm dev` (requires all workspace packages).

---

## Verification

1. Visit http://localhost:3000/docs — Documentation Center loads
2. Register at http://localhost:3000/register
3. Open Mission Control at http://localhost:3000/dashboard/mission-control

---

## Safe Defaults

```bash
EXECUTIVES_ENABLED=false
AUTONOMOUS_EXECUTION_ENABLED=false
```

Executives and autonomous execution require certification and governance review before enabling.

---

## Related

- [Quick Start](/docs/quick-start)
- [Deployment](/docs/deployment)
- [Authentication](/docs/authentication)
