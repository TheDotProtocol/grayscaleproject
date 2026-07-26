# Founder Workspace

**Version:** 1.0.0 (RC1 Track A)

---

## Overview

The Founder Workspace (`apps/web`) is the primary human-first interface for Project Grayscale. All platform capabilities plug into one unified navigation shell.

**Entry:** `/dashboard/home` after authentication.

---

## Navigation

20 primary routes plus 7 executive workspaces — see `apps/web/src/lib/workspace/navigation.ts`.

---

## Architecture Rules

- API-only — no direct Prisma from UI
- Workspace orchestrates, never duplicates business logic
- Every page backed by existing backend APIs
- EXECUTIVES_ENABLED=false reflected in UI (certified dormant executives)

---

## Key Directories

```
apps/web/src/app/dashboard/          # Workspace pages
apps/web/src/components/workspace/   # Reusable UI
apps/web/src/lib/api/workspace.ts    # API helpers
apps/web/src/hooks/use-workspace-query.ts
```

---

See `FOUNDER_WORKSPACE_ARCHITECTURE.md` for constitutional rules.
