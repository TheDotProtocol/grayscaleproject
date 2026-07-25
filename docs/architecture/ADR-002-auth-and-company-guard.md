# ADR-002: Authentication — JWT Access + Refresh Token Rotation

**Status:** Accepted  
**Date:** 2026-07-25

---

## Context

Access tokens alone with 15-minute expiry force re-login frequently. localStorage-only JWT without refresh is poor UX and led to no token rotation or revocation.

---

## Decision

1. **Access token:** JWT, 15-minute expiry, Bearer header
2. **Refresh token:** Opaque 48-byte random string, SHA-256 hash stored in `refresh_tokens` table
3. **Rotation:** Each `/auth/refresh` revokes old token and issues new pair
4. **Logout:** Revokes refresh token server-side
5. **Global guards:** `JwtAuthGuard` + `CompanyMemberGuard` via `APP_GUARD`

httpOnly cookies deferred to Sprint 2 — refresh in localStorage is an incremental improvement with server-side revocation.

---

## Endpoints

| Method | Path | Auth |
|--------|------|------|
| POST | `/auth/login` | Public |
| POST | `/auth/register` | Public |
| POST | `/auth/refresh` | Public (presents refresh token) |
| POST | `/auth/logout` | Public (revokes refresh token) |
| GET | `/auth/me` | JWT |

---

## Company Authorization

`CompanyMemberGuard` runs globally. Routes with `:companyId` require `company_members` row. Routes without `companyId` pass through. `@SkipCompanyGuard()` for service-level auth (e.g. agent approval by recommendation id).

---

**Related:** [ADR-005](./ADR-005-pulse-engine-and-plugins.md)
