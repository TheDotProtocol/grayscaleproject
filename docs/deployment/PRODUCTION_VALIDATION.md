# Production Validation

**Grayscale OS v1.0 — Complete validation checklist**

Run after deployment. Mark **PASS** / **FAIL** / **SKIP**. Do not go live with any **FAIL** on critical items.

---

## 1. Website and Documentation

| # | Test | Expected result | Procedure | Pass |
|---|------|-----------------|-----------|------|
| 1.1 | Homepage loads | Styled dark theme, not plain HTML | Open `/` | |
| 1.2 | Documentation | `/docs` loads with sidebar | Navigate doc sections | |
| 1.3 | Leadership | `/leadership` loads | | |
| 1.4 | Contact form | Thank-you message on submit | `/contact` | |
| 1.5 | SSL | Valid certificate | Browser padlock | |
| 1.6 | Mobile | Responsive layout | DevTools mobile view | |

---

## 2. Authentication

| # | Test | Expected result | Procedure | Pass |
|---|------|-----------------|-----------|------|
| 2.1 | Register | New user created | `/register` | |
| 2.2 | Login | Redirect to dashboard | `/login` | |
| 2.3 | Dev auth disabled | No bypass | `DEV_AUTH_ENABLED` false/unset | |
| 2.4 | Bad password | 401 error | Wrong credentials | |

---

## 3. Dashboard and Mission Control

| # | Test | Expected result | Procedure | Pass |
|---|------|-----------------|-----------|------|
| 3.1 | Command Bridge | `/dashboard/home` loads | | |
| 3.2 | Mission Control | Widgets load | `/dashboard/mission-control` | |
| 3.3 | Sidebar | No 500 errors | Click nav items | |
| 3.4 | Console clean | No hydration errors | DevTools console | |

---

## 4. Executive Gates

| # | Test | Expected result | Procedure | Pass |
|---|------|-----------------|-----------|------|
| 4.1 | Athena dormant | Certified dormant message | `/dashboard/executives/athena` | |
| 4.2 | EXECUTIVES_ENABLED | `false` | Render env | |
| 4.3 | Autonomous execution | Disabled | Env audit | |

---

## 5. API Health

| # | Test | Expected result | Procedure | Pass |
|---|------|-----------------|-----------|------|
| 5.1 | Swagger | `/api/docs` loads | Browser | |
| 5.2 | CORS | Frontend calls API | Login from prod domain | |
| 5.3 | Auth guard | 401 without token | curl without Bearer | |

---

## 6. Database and Redis

| # | Test | Expected result | Procedure | Pass |
|---|------|-----------------|-----------|------|
| 6.1 | DB connection | No errors in Render logs | | |
| 6.2 | Migrations | All applied | `prisma migrate status` | |
| 6.3 | pgvector | Extension active | SQL check | |
| 6.4 | Redis | No connection errors | Render logs | |

---

## 7. Security

| # | Test | Expected result | Procedure | Pass |
|---|------|-----------------|-----------|------|
| 7.1 | HTTPS | Valid on all domains | curl -I | |
| 7.2 | Secrets | Not in page source | View source | |
| 7.3 | Headers | Security headers present | securityheaders.com | |

---

## 8. Payments and Email (if configured)

| # | Test | Expected result | Pass |
|---|------|-----------------|------|
| 8.1 | Stripe test payment | Success | SKIP if N/A |
| 8.2 | Email delivery | Received | SKIP if N/A |

---

## Sign-Off

| Role | Name | Date |
|------|------|------|
| Founder | | |

Failures: see [ROLLBACK_GUIDE.md](./ROLLBACK_GUIDE.md)
