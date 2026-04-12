# TALIMY - Execution Plan v5 (Detailed + Page-First, 0 -> 100%)

Last updated: 2026-03-01
Source baseline: `docReja/old_Reja.md` + `docReja/Reja.md` + `docReja/Documentation.html`
Strategy: strong detailed execution plan with page-first delivery for context-dependent UI.
Status: In execution

## 1. 100% Completion Definition

1. All phases in this file pass entry and exit gates.
2. Every task/subtask has concrete completion evidence.
3. CI passes: lint, typecheck, unit, integration, e2e.
4. Production deploy passes smoke checks with rollback path validated.
5. Deferred contextual UI items are closed only inside their real page/container implementation, not as isolated placeholders.

## 2. Global DoD (applies to every subtask)

1. Implemented code/config/docs for the subtask scope.
2. No broken imports/routes/types in touched areas.
3. Lint and typecheck pass for affected workspace(s).
4. Tests added or updated when applicable and passing.
5. Security and access rules applied where relevant.
6. Commit message is traceable to subtask or task scope.

## 2.1 Progress Tracking Rules

1. A subtask is `Not Started` by default unless explicit evidence says otherwise.
2. `In Progress` and `Completed` may only be set after local verification.
3. Acceptance text describes the target outcome, not a pre-claimed result.
4. For active work, the phase tracker and the detailed task section must stay in sync.
5. If a contextual component is deferred into a page task, that page task becomes the canonical completion location.

## 2.2 Acceptance Evidence Rules

1. Code tasks need at least one concrete evidence path (file and/or command result).
2. Infra tasks need concrete artifact proof (workflow file, config, domain, deploy log, or runbook update).
3. Runtime tasks need smoke/test evidence when applicable.
4. Page-first UI tasks must prove both desktop and responsive container behavior when the design is responsive.

## 2.3 Ownership and Approval Rules

1. `Phase Owner (default)` is the coordinator for the phase.
2. `Task Owner` is accountable for delivery and evidence.
3. Cross-cutting tasks need all involved owners to confirm evidence before being treated as complete.

## 2.4 Tracker Sync Checklist

1. Update the phase status tracker.
2. Update the detailed task section status/evidence where relevant.
3. If execution strategy changes (for example component-first -> page-first), record it explicitly in the phase notes.
4. Do not mark contextual UI tasks as `Skipped` when they are actually deferred into page implementation.

## 2.5 External Provider Gate Policy (temporary)

1. `email-runtime` and `sms-runtime` smoke checks remain non-blocking until provider verification is completed.
2. Regular smoke uses the core integration path with strict email/sms disabled.
3. Full provider validation happens only after Resend domain verification and Twilio sender verification are completed.
4. This temporary policy must be removed after external provider readiness is achieved.

## 3. Architecture Constraints (Fixed)

1. Single web app (`apps/web`) + proxy subdomain routing.
2. Canonical route families: `/admin/*`, `/teacher/*`, `/student/*`, `/parent/*`, `/platform/*`.
3. Database package is `packages/database`.
4. Shared UI lives in `packages/ui`; shadcn primitives under `packages/ui/src/components/ui/*` are user-controlled and must not be regenerated/edited by agent.
5. UI execution rule:
   - Page-agnostic primitives/components stay in FAZA 4.
   - Contextual components are finalized inside page tasks where real container/layout/responsive constraints exist.
6. Multi-tenant, role, and gender-scope isolation rules remain mandatory in all phases.

## 4. Detailed Tracking

## 4.1 Phase Status Tracker (single view)

| Phase   | Status      | Updated At | Evidence                                                                                                                                  |
| ------- | ----------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| FAZA 0  | Completed   | 2026-02-20 | `package.json`, `turbo.json`, `tsconfig.base.json`, shared config packages                                                                |
| FAZA 1  | Completed   | 2026-02-20 | `packages/database/src/schema/*`, `packages/database/src/relations.ts`, `packages/database/src/seed/*`, drizzle migration files           |
| FAZA 2  | In Progress | 2026-02-26 | `apps/api/src/app.module.ts`, `apps/api/src/modules/*`, shared validators, smoke scripts                                                  |
| FAZA 3  | In Progress | 2026-02-26 | `apps/web/proxy.ts`, `apps/web/src/app/layout.tsx`, providers, stores, hooks, i18n, API route wiring                                      |
| FAZA 4  | In Progress | 2026-03-01 | `packages/ui/*`, `apps/web/src/components/shared/ui-showcase/*`, chart/stat/data-table work through 4.3.3                                 |
| FAZA 5  | Completed   | 2026-03-01 | `apps/web/src/app/(auth)/*`, `apps/web/src/lib/nextauth-config.ts`, `apps/web/src/lib/server/api-proxy.ts`, `apps/api/src/modules/auth/*` |
| FAZA 6  | In Progress | 2026-03-02 | School Admin layout accepted scope done; dashboard content pending                                                                        |
| FAZA 7  | Not Started | -          | School Admin teachers pages pending                                                                                                       |
| FAZA 8  | Not Started | -          | School Admin students pages pending                                                                                                       |
| FAZA 9  | Not Started | -          | School Admin attendance/finance/notices/exams/calendar/profile/settings pending                                                           |
| FAZA 10 | Not Started | -          | Student pages pending                                                                                                                     |
| FAZA 11 | Not Started | -          | Teacher pages pending                                                                                                                     |
| FAZA 12 | Not Started | -          | Parent pages pending                                                                                                                      |
| FAZA 13 | Not Started | -          | Platform admin pages pending                                                                                                              |
| FAZA 14 | Not Started | -          | Marketing pages pending                                                                                                                   |
| FAZA 15 | Not Started | -          | Real-time infra pending                                                                                                                   |
| FAZA 16 | Not Started | -          | AI integration pending                                                                                                                    |
| FAZA 17 | Not Started | -          | Testing pending                                                                                                                           |
| FAZA 18 | Not Started | -          | SEO + performance pending                                                                                                                 |
| FAZA 19 | Not Started | -          | CI/CD + production deployment pending                                                                                                     |

## 4.2 Task Status Tracker (execution control)

| Task | Name                                                                    | Status      | Updated At | Evidence                                                                                                                                                                                                                                                                |
| ---- | ----------------------------------------------------------------------- | ----------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5.1  | Auth Layout                                                             | Completed   | 2026-03-01 | `apps/web/src/app/(auth)/layout.tsx`, `apps/web/src/components/auth/auth-shell.tsx`                                                                                                                                                                                     |
| 5.2  | Login Page                                                              | Completed   | 2026-03-01 | `apps/web/src/app/(auth)/login/page.tsx`, `apps/web/src/components/auth/login-form.tsx`                                                                                                                                                                                 |
| 5.3  | Forgot Password + Reset Password Pages                                  | Completed   | 2026-03-01 | `apps/web/src/app/(auth)/forgot-password/page.tsx`, `apps/web/src/app/(auth)/reset-password/page.tsx`, `apps/web/src/app/(auth)/verify-email/page.tsx`, `apps/web/src/components/auth/forgot-password-form.tsx`, `apps/web/src/components/auth/reset-password-form.tsx` |
| 5.4  | NextAuth API Route Wiring                                               | Completed   | 2026-03-01 | `apps/web/src/app/api/auth/[...nextauth]/route.ts`, `apps/web/src/lib/nextauth.ts`, `apps/web/src/lib/nextauth-config.ts`, `apps/web/src/lib/server/api-proxy.ts`, `apps/api/src/modules/auth/*`                                                                        |
| 6.1  | Admin Layout (Sidebar + Header + Shell)                                 | Completed   | 2026-03-02 | `apps/web/src/app/(school)/admin/layout.tsx`, `apps/web/src/components/layouts/admin-shell-data.ts`, `packages/ui/src/components/appShell.tsx`, `packages/ui/src/components/app-shell/*`                                                                                |
| 6.2  | Admin Dashboard Page                                                    | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 7.1  | Teachers List Page                                                      | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 7.2  | Teacher Detail Page                                                     | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 7.3  | Add Teacher Page                                                        | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 8.1  | Students List Page (2-bosqichli navigatsiya)                            | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 8.2  | Student Detail Page                                                     | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 8.3  | Add Student Page                                                        | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 9.1  | Attendance Page                                                         | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 9.2  | Finance — Fees Collection Page                                          | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 9.3  | Finance — Expenses Page                                                 | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 9.4  | Notice Board Page                                                       | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 9.5  | Exams Page                                                              | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 9.6  | Calendar Page                                                           | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 9.7  | Admin Profile Page                                                      | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 9.8  | Admin Settings Page                                                     | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 10.1 | Student Layout                                                          | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 10.2 | Student Dashboard Page                                                  | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 10.3 | Student — Schedule Page                                                 | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 10.4 | Student — Assignments Page                                              | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 10.5 | Student — Grades Page                                                   | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 10.6 | Student — Attendance Page                                               | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 10.7 | Student — Other Pages (Exams, Notices, Calendar, Profile)               | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 11.1 | Teacher Layout                                                          | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 11.2 | Teacher Dashboard Page                                                  | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 11.3 | Teacher — My Students Page                                              | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 11.4 | Teacher — Attendance Page                                               | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 11.5 | Teacher — Assignments Page                                              | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 11.6 | Teacher — Grades, Exams, Schedule, Notices, Calendar, Profile, Settings | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 12.1 | Parent Layout + Dashboard + Profile                                     | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 13.1 | Platform Admin Layout                                                   | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 13.2 | Platform Dashboard Page                                                 | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 13.3 | Schools Management Page                                                 | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 13.4 | Platform Settings Page                                                  | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 14.1 | Marketing Layout                                                        | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 14.2 | Landing Page Sections                                                   | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 14.3 | Other Public Pages                                                      | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 15.1 | Real-time Infrastructure Setup                                          | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 15.2 | Notification System                                                     | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 15.3 | Real-time Events in Pages                                               | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 16.1 | Student Dashboard AI Advice                                             | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 16.2 | Admin AI Reports                                                        | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 16.3 | Parent Telegram Bot                                                     | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 17.1 | Unit Tests                                                              | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 17.2 | Integration Tests                                                       | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 17.3 | E2E Tests (Playwright)                                                  | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 18.1 | SEO                                                                     | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 18.2 | Performance                                                             | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 19.1 | GitHub Actions CI                                                       | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 19.2 | Dokploy Production Setup                                                | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 19.3 | Monitoring                                                              | Not Started | -          | -                                                                                                                                                                                                                                                                       |
| 19.4 | Production Smoke Tests + Rollback                                       | Not Started | -          | -                                                                                                                                                                                                                                                                       |

## 4.3 Planning Policy for FAZA 4+

1. FAZA 4 keeps only page-agnostic primitives, wrappers, and shared visual building blocks.
2. Contextual components (for example `empty-state`, page-specific filters, composite dashboard sections) are not treated as isolated final artifacts before their target pages exist.
3. Those contextual items are deferred into the corresponding page tasks so that size, layout, responsive behavior, and visual hierarchy are solved once in the real container.
4. Deferred does not mean dropped. It means the page task owns the final implementation and acceptance.
5. This rule applies from FAZA 4.3.4 onward unless a component is proven page-agnostic.

## 4.4 Execution Notes

1. `docReja/old_Reja.md` remains the governance/detail baseline.
2. Current page-first ordering is preserved where it prevents premature abstraction.
3. Strong tracking is retained; oversimplified `SKIPPED` wording is replaced by explicit `deferred to page implementation` wording.
4. When a task depends on screenshots/Figma/page context, the final acceptance belongs to the page task, not the primitive task.
5. Every future status change must update both the phase tracker and the task tracker.

## 5. Detailed Plan by Phase / Task / Subtask

## FAZA 0 — Monorepo Initialization 🟢 Completed

> Barcha subtasklar 2026-02-20 da yakunlandi. Ko'chirish shart emas.

---

## FAZA 1 — Database Schema 🟢 Completed

> Barcha subtasklar (1.1–1.10) 2026-02-20 da yakunlandi.

---

## FAZA 2 — NestJS Backend Modules 🟡 In Progress

> Barcha modullar (2.1–2.26) qisman yoki to'liq yakunlandi.
> Qolgan: 2.16 (Notices — GET /:id fix), 2.21 (Email runtime), 2.22 (SMS runtime), 2.23 (Queue dual-process smoke).

---

## FAZA 3 — Next.js Frontend Foundation 🟡 In Progress

> 3.1–3.8 yakunlandi. Qolgan: 3.5.6 va 3.5.7 runtime smoke (backend /:trpc availability talab qiladi).

---

## FAZA 4 — UI Foundation (shadcn/ui + Custom Components) 🟡 In Progress

> 4.1–4.3.3 yakunlandi. **4.3.4+ deferred to page implementation** — qolgan komponentlar tegishli sahifalar ichida quriladi.

### Yakunlangan (evidence mavjud):

- **4.1** — `packages/ui` shadcn/ui primitives: Button, Input, Card, Badge, Dialog, Sheet, Select, Checkbox, Switch, Tabs, Avatar, Dropdown, Calendar, Pagination, Toast/Sonner, Tooltip, Skeleton.
- **4.2** — Data Table (`@tanstack/react-table`): sort, filter, pagination, row selection.
- **4.3.1** — StatsCard component (icon, title, value, change %, variant: navy/pink/sky/white).
- **4.3.2** — Chart wrapper components (Recharts): LineChart, AreaChart, BarChart, DonutChart — responsive, yagona dizayn tizimida.
- **4.3.3** — PageHeader component (title, breadcrumb, action buttons slot).

### Skipped (sahifalar ichida quriladi):

4.3.4 va undan keyingi barcha komponent subtasklar — **SKIP**.

---

## FAZA 5 — Auth Pages

> Route group: `apps/web/src/app/(auth)/`
> Public self-register yo'q.
> Platform auth: `platform.talimy.space/login`
> School auth: `[school].talimy.space/login`
> Password reset magic link: platform yoki school workspace ichida.
> Invite acceptance magic link: faqat school subdomain ichida.

### Task 5.1: Auth Layout

**File:** `apps/web/src/app/(auth)/layout.tsx`

| Subtask | Work Item                                                                                         | Estimate |
| ------- | ------------------------------------------------------------------------------------------------- | -------- |
| 5.1.1   | Auth layout: centered card, logo (Talimy), brand background gradient (navy), responsive           | 2h       |
| 5.1.2   | NextAuth session provider wrapping, redirect logic (authlangan foydalanuvchi → /[role]/dashboard) | 1h       |

**Exit:** Auth layout render qiladi, authlangan user redirect bo'ladi.

---

### Task 5.2: Login Page

**Route:** `/login`
**File:** `apps/web/src/app/(auth)/login/page.tsx`

| Subtask | Work Item                                                                                                                                      | Estimate |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 5.2.1   | Login form: Email input, Parol input (ko'rish toggle), [Kirish] tugmasi, workspace-aware copy                                                  | 2h       |
| 5.2.2   | Form validation: React Hook Form + Zod (`loginSchema`), real-time xato xabarlari                                                               | 1h       |
| 5.2.3   | NextAuth `signIn("credentials", {...})` integratsiyasi, server-side error mapping (noto'g'ri parol, foydalanuvchi topilmadi, tenant noto'g'ri) | 2h       |
| 5.2.4   | Loading state (Skeleton yoki spinner), submit disabled holat                                                                                   | 0.5h     |
| 5.2.5   | "Parolni unutdingizmi?" link → `/forgot-password`                                                                                              | 0.5h     |
| 5.2.6   | Tenant slug proxy orqali tenantId resolve (subdomain → backend `x-tenant-slug` header)                                                         | 1h       |

**Exit:** Login ishlaydi, rol bo'yicha redirect bo'ladi (admin → /admin/dashboard, teacher → /teacher/dashboard, student → /student/dashboard, parent → /parent/dashboard).

---

### Task 5.3: Forgot Password + Reset Password Pages

**Routes:** `/forgot-password`, `/reset-password`

| Subtask | Work Item                                                                                    | Estimate |
| ------- | -------------------------------------------------------------------------------------------- | -------- |
| 5.3.1   | Forgot password: Email input, [Yuborish] tugmasi, success state ("Emailga havola yuborildi") | 1.5h     |
| 5.3.2   | API: `POST /api/auth/forgot-password` wiring                                                 | 0.5h     |
| 5.3.3   | Reset password: Yangi parol + Tasdiqlash input, token URL param orqali, validation           | 1.5h     |
| 5.3.4   | API: `POST /api/auth/reset-password` wiring + success redirect `/login`                      | 0.5h     |

**Exit:** Parol tiklash flow to'liq ishlaydi.

---

### Task 5.4: NextAuth API Route Wiring

**File:** `apps/web/src/app/api/auth/[...nextauth]/route.ts`

| Subtask | Work Item                                                                                                             | Estimate |
| ------- | --------------------------------------------------------------------------------------------------------------------- | -------- |
| 5.4.1   | NextAuth `auth.ts` config: CredentialsProvider, JWT strategy, session callback (user + role + tenantId + genderScope) | 3h       |
| 5.4.2   | Backend `/api/auth/login` REST endpoint bilan integratsiya (tenantSlug forwarding)                                    | 2h       |
| 5.4.3   | Proxy middleware auth guard: session yo'q → `/login` redirect, role mismatch → 403                                    | 1.5h     |

**Exit:** `bun run typecheck --filter=web` pass. Login → session → role redirect ishlaydi.

---

### FAZA 5 Exit Gate

1. Login, forgot-password, reset-password sahifalari ishlaydi.
2. Rol bo'yicha redirect to'g'ri (admin/teacher/student/parent).
3. Proxy middleware auth gate ishlaydi.

---

## FAZA 6 — School Admin: Layout + Dashboard

> Subdomain: `[school].talimy.space/admin`
> Route group: `apps/web/src/app/(school)/admin/`
> UI dizayn: Figma Image 1 (Dashboard sahifasi) asosida.

### Task 6.1: Admin Layout (Sidebar + Header + Shell)

**Files:**

- `apps/web/src/app/(school)/admin/layout.tsx`
- `apps/web/src/components/layouts/admin-shell-data.ts`
- `packages/ui/src/components/appShell.tsx`
- `packages/ui/src/components/app-shell/sidebar.tsx`
- `packages/ui/src/components/app-shell/header.tsx`
- `packages/ui/src/components/app-shell/nav.tsx`

| Subtask | Work Item                                                                                                                                                                                                                                                                                               | Estimate |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 6.1.1   | **AdminSidebar** — Shadcn sidebar-based global shell sidebar, left fixed panel, nav items ro'yxati, active highlight, hover state, icon-collapse holati, Moliya collapse/expand submenu (To'lovlar, Xarajatlar). Promo banner talab qilinmaydi. Logout alohida tugma emas, user dropdown ichida qoladi. | 4h       |
| 6.1.2   | **Sidebar nav items (admin):** Dashboard, Inbox, Calendar, Teachers, Students, Attendance, Finance (submenyu: Fees Collection, Expenses), Notice Board                                                                                                                                                  | 1h       |
| 6.1.3   | **AdminHeader** — "Search anything" input (icon + placeholder), Settings icon, Notification bell icon, til switcher, user avatar + nomi + rol subtitle (top-right). Breadcrumb bu scope uchun talab qilinmaydi.                                                                                         | 2h       |
| 6.1.4   | **AdminShell** — Main layout wrapper: sidebar (fixed, left) + main content area (ml-52, flex-1), responsive breakpoints (sidebar collapse < lg)                                                                                                                                                         | 1.5h     |
| 6.1.5   | **Breadcrumb component** — Current accepted scope'dan chiqarildi. Dashboard shell uchun alohida breadcrumb talab qilinmaydi.                                                                                                                                                                            | -        |
| 6.1.6   | Auth guard: `admin` rol tekshiruvi (NextAuth session + Permify role check), unauthorized → `/login`                                                                                                                                                                                                     | 1h       |
| 6.1.7   | i18n layout wrapper (`next-intl`), til switching support                                                                                                                                                                                                                                                | 0.5h     |

**Exit:** Admin layout render qiladi, sidebar va header ishlaydi, auth guard ishlaydi, i18n ishlaydi. Breadcrumb/promo/standalone logout bu task scope'iga kirmaydi.

---

### Task 6.2: Admin Dashboard Page

**Route:** `/admin/dashboard`
**File:** `apps/web/src/app/(dashboard)/admin/dashboard/page.tsx`
**Dizayn ref:** Figma Image 1
**Layout:** 2 ustun — Chap+Markaz (flex-1) + O'ng panel (w-80, sticky)

| Subtask | Work Item                                                                                                                                                                                                                                                                                                                    | Estimate |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 6.2.1   | **StatsRow** (4 ta karta) — `<StatsCard>` komponentidan foydalanib: (1) Enrolled Students [navy icon], (2) Active Teachers [pink icon], (3) Support Staff [sky icon], (4) Total Awards [pink icon]. Har birida son va icon. API: `GET /api/admin/dashboard/stats`                                                            | 2h       |
| 6.2.2   | **StudentPerformance Chart** (chap, grouped bar) — Sarlavha: "Student Performance", filter: "Last Semester ▼", Recharts `<BarChart>` grouped, Grade 7 (light navy) / Grade 8 (pink) / Grade 9 (dark navy), X-axis: Jul–Dec, Y-axis: 0–100%, legend, tooltip. API: `GET /api/admin/students/performance?period=last_semester` | 3h       |
| 6.2.3   | **EarningsChart** (o'ng, line chart) — Sarlavha: "Earnings", filter: "Last Year ▼", Recharts `<LineChart>`, 2 chiziq: Earnings (navy) va Expenses (pink dashed), X-axis: Jan–Dec, hover tooltip: "July 2034: Earnings $5,785 / Expenses $4,020". API: `GET /api/admin/finance/earnings?period=last_year`                     | 3h       |
| 6.2.4   | **StudentsByGenderChart** (chap, donut) — Sarlavha: "Students by Gender", filter: "Grade 9 ▼", Recharts `<PieChart>` donut, Boys (navy) / Girls (pink), markazda son (1,245), pastda: "Boys 560 · Girls 685". API: `GET /api/admin/students/by-gender?gradeId=9`                                                             | 2h       |
| 6.2.5   | **StudentAttendanceChart** (markaz, bar chart) — Sarlavha: "Student Attendance", filter: "Weekly ▼", Recharts `<BarChart>` stacked (Present navy / Absent pink), X-axis: Mon–Fri, har bir ustun ustida son. API: `GET /api/admin/attendance/weekly`                                                                          | 2h       |
| 6.2.6   | **ToDoList** — Sarlavha: "To Do List" + "..." menyu, checkbox list: ☑ (done, navy check), ☐ (pending), har birida nomi va sana (📅 March 11, 2035), hover edit/delete. API: `GET /api/admin/todos`, `PATCH /api/admin/todos/:id`, `DELETE /api/admin/todos/:id`, `POST /api/admin/todos`                                     | 3h       |
| 6.2.7   | **NoticeBoard** — Sarlavha: "Notice Board" + "Sort by: Popular ▼", 4 ta card: thumbnail rasm (60×60), kategoriya badge (Academic/Training/Resources/Announcement rang bo'yicha), sarlavha, Audience, Date, Created By, "..." menyu. API: `GET /api/notices?limit=4&sort=popular`                                             | 2h       |
| 6.2.8   | **O'ng panel — MiniCalendar** — "March 2035" sarlavha, prev/next chevron, haftalar grid (S M T W T F S), bugun highlight (pink circle), event bor kunlar (rang dot). Kun bosganida Agenda filter. Zustand: selectedDate state                                                                                                | 2h       |
| 6.2.9   | **O'ng panel — Events (Agenda)** — Sarlavha: "Events" + "...", 3 ta kelgusi event card: sana badge (rang: pink/sky/navy), sana range (09:00 AM – 12:00 PM), sarlavha (bold), location/class. API: `GET /api/events?tenantId=...&dateFrom=...&dateTo=...&limit=3`                                                             | 2h       |
| 6.2.10  | **O'ng panel — Recent Activity** — Sarlavha: "Recent Activity" + "...", timeline list: colored circle icon (avatar/action type), matn (bold + normal), vaqt (grey). API: `GET /api/admin/activity?limit=5`                                                                                                                   | 1.5h     |
| 6.2.11  | TanStack Query: barcha widgetlar uchun `useQuery` hooklar, `queryKey` standartlari, `refetchInterval: 60000`, loading skeleton (Skeleton component)                                                                                                                                                                          | 2h       |
| 6.2.12  | Zustand store: `dashboardStore` — selectedDate, activeGradeFilter, activePeriodFilters                                                                                                                                                                                                                                       | 1h       |
| 6.2.13  | Responsive: md/lg breakpoint adjustments, o'ng panel collapse (< lg sticky → bottom sheet)                                                                                                                                                                                                                                   | 2h       |

**Exit:** Dashboard to'liq render qiladi, barcha widgetlar real API datani ko'rsatadi, filter dropdown'lar ishlaydi.

---

### FAZA 6 Exit Gate

1. Admin layout (sidebar, header, shell) ishlaydi.
2. Dashboard barcha widgetlari ishlaydi (real data, loading states).
3. Auth guard ishlaydi.

---

## FAZA 7 — School Admin: Teachers Pages

> Dizayn ref: Figma Image 3 (Teachers list), Image 4 (Teacher Detail)

### Task 7.1: Teachers List Page

**Route:** `/admin/teachers`
**File:** `apps/web/src/app/(dashboard)/admin/teachers/page.tsx`
**Layout:** Chap+Markaz (stat cards + charts + grid) + O'ng panel (Department donut)

| Subtask | Work Item                                                                                                                                                                                                                                                                                                                                                       | Estimate |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 7.1.1   | **TeachersStatsRow** (4 karta) — Total Teachers (86, navy), Full-Time Teacher (62, pink), Part-Time Teacher (18, sky), Substitute Teacher (6, light). API: `GET /api/teachers/stats`                                                                                                                                                                            | 1.5h     |
| 7.1.2   | **AttendanceOverviewChart** (chap, line chart) — Sarlavha: "Attendance Overview", filter: "Weekly ▼", Recharts `<LineChart>` + area fill (pink), Y-axis: 0–100%, X-axis: Mon–Fri, dot markers + value (62). API: `GET /api/teachers/attendance-overview?period=weekly`                                                                                          | 2h       |
| 7.1.3   | **WorkloadDistributionChart** (markaz, grouped bar) — Sarlavha: "Workload Distribution", filtrlar: "Science ▼" + "Weekly ▼", Recharts `<BarChart>` grouped (3 series: Total Classes pink / Teaching Hours sky / Extra Duties navy), X-axis: o'qituvchi nomlari (Rayan, Aliyah...), Y-axis: 0–40h. API: `GET /api/teachers/workload?subjectId=...&period=weekly` | 2.5h     |
| 7.1.4   | **DepartmentDonutChart** (o'ng panel, donut) — Sarlavha: "Department", Recharts `<PieChart>`, markazda "Total Teachers 86", legend: Science 19 (22%) / Mathematics 17 (20%) / Language 15 (18%) / Social 13 (15%) / Arts 11 (13%) / Physical Education 11 (12%), color mapping. API: `GET /api/teachers/by-department`                                          | 2h       |
| 7.1.5   | **TeachersFilterBar** — `[🔍 Search teacher]` input, `[Filter ▼]` dropdown (Department, Status, Gender), `Sort by: Latest ▼`, `[+ Add Teacher]` button (navy bg, white text, + icon)                                                                                                                                                                            | 1.5h     |
| 7.1.6   | **TeacherCard** (grid karta) — Round avatar (80×80), ID badge (T-1001, top-left), Ism (bold), ID · Fan (grey), 📞 telefon, ✉️ email, `[💬 Message]` tugmasi (sky/light border). Karta hover: shadow. Click → `/admin/teachers/[id]`                                                                                                                             | 2h       |
| 7.1.7   | **TeachersGrid** — 4 ustunli responsive grid (xl:4, lg:3, md:2, sm:1), `TeacherCard` mapping                                                                                                                                                                                                                                                                    | 1h       |
| 7.1.8   | **TeachersPagination** — "Show 8 ▼ of 82 results", numbered pagination (1, 2, 3, ..., 11), prev/next chevron. API: `GET /api/teachers?page=1&limit=8&search=...&departmentId=...&status=...`                                                                                                                                                                    | 2h       |
| 7.1.9   | Gender scope guard: `genderScope` session'dan o'qiladi, API request'ga `genderScope` query param qo'shiladi, Permify guard backend'da ishlaydi                                                                                                                                                                                                                  | 1h       |

**Exit:** Teacher list to'liq ishlaydi, search/filter/pagination ishlaydi, gender scope qo'llaniladi.

---

### Task 7.2: Teacher Detail Page

**Route:** `/admin/teachers/[id]`
**File:** `apps/web/src/app/(dashboard)/admin/teachers/[id]/page.tsx`
**Layout:** 3 ustun — Chap (profil info), Markaz (workload, schedule, training), O'ng (calendar, leave, performance)

| Subtask | Work Item                                                                                                                                                                                                                                                                                                                 | Estimate |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 7.2.1   | **TeacherProfileCard** (chap, top) — Round avatar (120×120, pink border), Ism (bold, pink), ID + "Full-Time" status badge (sky). API: `GET /api/teachers/:id`                                                                                                                                                             | 1h       |
| 7.2.2   | **TeacherInfoCard** (chap) — Subject, Class (8C – 9A – 9B), bo'sh qator; toggle: work time variant (Yarim kun / Butun kun / Custom) — admin uchun edit toggle, teacher uchun faqat ko'rish                                                                                                                                | 1h       |
| 7.2.3   | **TeacherPersonalInfo** (chap) — Gender icon + Male/Female, 🎂 Date of Birth, ✉️ Email, 📞 Phone, 🏠 Address — ko'rinish mode default, edit icon bosganida inline edit (admin only)                                                                                                                                       | 2h       |
| 7.2.4   | **TeacherDocuments** (chap) — PDF list: fayl nomi (truncated), tur (PDF), hajm (2.4 MB), 📎 icon. Admin: fayl qo'shish/o'chirish. API: `GET /api/teachers/:id/documents`                                                                                                                                                  | 1.5h     |
| 7.2.5   | **WorkloadSummaryChart** (markaz) — Sarlavha: "Workload Summary", filter: "Last 8 months ▼", Recharts `<AreaChart>` 3 area (Total Classes sky / Teaching Hours light-navy / Extra Duties pink), hover tooltip: "October 2034: 149h / 134h / 32h". API: `GET /api/teachers/:id/workload?months=8`                          | 3h       |
| 7.2.6   | **WeeklyScheduleGrid** (markaz) — Sarlavha: "Schedule", filter: "Weekly ▼", timetable grid: Y-axis vaqt (08:00–15:00, har 1 soat), X-axis: Mon–Fri, cell: sinf nomi (8C, 9A...) rang bo'yicha (navy/sky), bo'sh cells: transparaent. API: `GET /api/teachers/:id/schedule?period=weekly`                                  | 3h       |
| 7.2.7   | **DevelopmentTrainingTable** (markaz) — Sarlavha: "Development & Training", filter: "This Semester ▼", table: Event ↕ / Date ↕ / Loc-Platform ↕ / Status ↕, status badge: Upcoming (sky) / Completed (green) / Cancelled (red). API: `GET /api/teachers/:id/training?semester=current`                                    | 2h       |
| 7.2.8   | **TeacherMiniCalendar** (o'ng) — "March 2035", prev/next, grid, bugun highlight, Present/Late/On Leave statistika: "Present 11 · Late 4 · On Leave 2" pastda. API: `GET /api/teachers/:id/attendance-calendar?month=2035-03`                                                                                              | 2h       |
| 7.2.9   | **LeaveRequestCard** (o'ng) — Sarlavha: "Leave Request", aktif leave: badge (Sick Leave), sabab matni, [Approve] (navy) + [Decline] (white/border) tugmalar — admin ko'radi va tasdiqlaydi. Teacher: [+ Yangi so'rov] modal. API: `GET /api/teachers/:id/leave-requests`, `PATCH /api/teachers/:id/leave-requests/:reqId` | 2.5h     |
| 7.2.10  | **PerformanceCard** (o'ng) — Sarlavha: "Performance", filter: "Last Month ▼", 3 metrika: (1) Grading Timeliness 95%/90% "Excellent" (pink progress bar), (2) Student Avg. Grade 85/90 "Good", (3) Student Feedback 78%/85% "Good". API: `GET /api/teachers/:id/performance`                                               | 2h       |
| 7.2.11  | Page header: "Teacher Details", breadcrumb "Dashboard / Teachers / Teacher Details", ← orqaga tugmasi                                                                                                                                                                                                                     | 0.5h     |

**Exit:** Teacher detail page to'liq render qiladi, barcha panellar real data ko'rsatadi, leave approve/decline ishlaydi.

---

### Task 7.3: Add Teacher Page

**Route:** `/admin/teachers/new`
**File:** `apps/web/src/app/(dashboard)/admin/teachers/new/page.tsx`

| Subtask | Work Item                                                                                                                                                                                                                        | Estimate |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 7.3.1   | **Shaxsiy Ma'lumotlar section** — Teacher ID (auto, disabled, "T-1009"), Ism + Familiya, Tug'ilgan sana (DatePicker), Millati (Select), Jinsi (Radio: Erkak/Ayol — gender scope uchun muhim), Holat (Radio: Active/Inactive)     | 2h       |
| 7.3.2   | **Kontakt Ma'lumotlar section** — Email, Telefon (+XX prefix select), Telegram username, Yashash manzili (textarea)                                                                                                              | 1.5h     |
| 7.3.3   | **Akademik Ma'lumotlar section** — Mutaxassisligi (multi-checkbox, tenant fanlari ro'yxatidan), Guruhlari (multi-checkbox + search, gender scope bo'yicha filtered), Ish holati (Radio: To'liq/Yarim/Soatbay), Ishga kirgan sana | 2h       |
| 7.3.4   | **Profile Photo upload** — Drag & drop yoki click, preview, max 2MB, JPG/PNG, R2 presigned URL                                                                                                                                   | 1.5h     |
| 7.3.5   | **Hujjatlar section** — Dynamic table: tur (select: Diplom/Sertifikat/ID karta/Boshqa) + fayl upload (R2), qo'shish/o'chirish                                                                                                    | 2h       |
| 7.3.6   | Form validation (React Hook Form + Zod), required field highlights, real-time xato                                                                                                                                               | 1.5h     |
| 7.3.7   | `[Cancel]` + `[Save & Add Teacher]` tugmalar. API: `POST /api/teachers` → success toast → redirect `/admin/teachers`                                                                                                             | 1.5h     |

**Exit:** Form ishlaydi, validation ishlaydi, teacher qo'shiladi va redirect bo'ladi.

---

### FAZA 7 Exit Gate

1. Teachers list (search, filter, pagination, gender scope) ishlaydi.
2. Teacher detail (barcha panellar, leave approve) ishlaydi.
3. Add Teacher form ishlaydi.

---

## FAZA 8 — School Admin: Students Pages

> Dizayn ref: Figma Image 5 (Students list), Image 6 (Student Detail), Image 7 (Add Student)

### Task 8.1: Students List Page (2-bosqichli navigatsiya)

**Route:** `/admin/students`
**File:** `apps/web/src/app/(dashboard)/admin/students/page.tsx`

#### Bosqich 1 — Stats + Charts + Enrollment + Table

| Subtask | Work Item                                                                                                                                                                                                                                                                                                                                                              | Estimate |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 8.1.1   | **StudentsStatsRow** (4 karta) — Total Students 1,245, Grade 7: 410, Grade 8: 415, Grade 9: 420. API: `GET /api/students/stats`                                                                                                                                                                                                                                        | 1.5h     |
| 8.1.2   | **AcademicPerformanceChart** (markaz, grouped bar) — Sarlavha: "Academic Performance", filter: "Last Semester ▼", Recharts `<BarChart>` grouped (Grade 7 light / Grade 8 navy / Grade 9 pink), X-axis: Jul–Dec, Y-axis: 0–100%. API: `GET /api/admin/students/performance?period=last_semester`                                                                        | 2h       |
| 8.1.3   | **EnrollmentTrendsChart** (o'ng top, area/line) — Sarlavha: "Enrollment Trends", filter: "Last 5 Years ▼", Recharts `<LineChart>` single line (navy), hover: "8,015", X-axis: 2030–2035. API: `GET /api/admin/students/enrollment-trends?years=5`                                                                                                                      | 2h       |
| 8.1.4   | **AttendanceOverviewChart** (o'ng pastki, bar) — Sarlavha: "Attendance Overview", filter: "This Week ▼", 5 bar (Mon-Fri), har birida son. API: `GET /api/admin/attendance/weekly?week=current`                                                                                                                                                                         | 1.5h     |
| 8.1.5   | **SpecialProgramsList** (o'ng) — Sarlavha: "Special Programs", 4 ta card: avatar, ism, ID · sinf, badge (Enrichment sky / Academic Support pink / Finance+Enrichment), dastur nomi. API: `GET /api/students/special-programs?hasGrant=true&limit=4`                                                                                                                    | 1.5h     |
| 8.1.6   | **StudentsFilterBar** — `[🔍 Search for a student]`, `[⚙ filter icon]`, `All Status ▼` (Active/On Leave/Suspended), `[+ Add Student]` button                                                                                                                                                                                                                           | 1h       |
| 8.1.7   | **StudentsTable** — Columns: Student (avatar + ism + ID), Class, GPA (rangli: ≥3.5 navy/bold, 2.5–3.4 normal, <2.5 red), Performance (● Good navy / ● Needs Support yellow / ● At Risk red), Attendance % (circle progress), Status badge (Active green / On Leave navy). Sort icons har bir column'da. API: `GET /api/students?page=1&limit=10&status=...&search=...` | 3h       |
| 8.1.8   | **StudentsPagination** — "Show 10 ▼ of 40 results", numbered pages, prev/next.                                                                                                                                                                                                                                                                                         | 1h       |
| 8.1.9   | Row click → `/admin/students/[id]`                                                                                                                                                                                                                                                                                                                                     | 0.5h     |

**Exit:** Students list ishlaydi, filter/sort/pagination ishlaydi.

---

### Task 8.2: Student Detail Page

**Route:** `/admin/students/[id]`
**File:** `apps/web/src/app/(dashboard)/admin/students/[id]/page.tsx`
**Layout:** 3 ustun — Chap (profil, parent, docs), Markaz (calendar, scholarships, health), O'ng (academic performance, extracurricular, behavior log)

| Subtask | Work Item                                                                                                                                                                                                                                                                                                                             | Estimate |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 8.2.1   | **StudentProfileCard** (chap top) — Round avatar (120×120, pink border), Ism (bold, pink), ID + Sinf + Status badge (Active green). API: `GET /api/students/:id`                                                                                                                                                                      | 1h       |
| 8.2.2   | **StudentPersonalInfo** (chap) — Gender icon, 🎂 Date of Birth, 📞 Phone, 🏠 Address                                                                                                                                                                                                                                                  | 1h       |
| 8.2.3   | **ParentGuardianInfo** (chap) — "Parent/Guardian Info" sarlavha + "..." menyu, Father (ism + telefon), Mother (ism + telefon), Alternative Guardian (ism + munosabat + telefon)                                                                                                                                                       | 1.5h     |
| 8.2.4   | **StudentDocuments** (chap) — PDF list: ReportCard, Certificate, IDCard — ikon (pink PDF), nomi, hajm, ko'rish/yuklab olish. API: `GET /api/students/:id/documents`                                                                                                                                                                   | 1h       |
| 8.2.5   | **AttendanceCalendar** (markaz top) — "March 2035" mini calendar, prev/next, har bir kunga rang: Present (green circle), Late (yellow), Sick (navy), Absent (grey). Pastda: "Present 14 · Late 3 · Sick 2 · Absent 1". API: `GET /api/students/:id/attendance-calendar?month=2035-03`                                                 | 2.5h     |
| 8.2.6   | **ScholarshipsCard** (markaz) — "Scholarships" sarlavha + "..." menyu, har bir stipendiya: icon (pink circle), nomi (bold), turi (Finance / Enrichment badge). API: `GET /api/students/:id/scholarships`                                                                                                                              | 1.5h     |
| 8.2.7   | **HealthMedicalCard** (markaz) — "Health & Medical Info" sarlavha, badge-style cards: "Medical Record" (pink text, light pink bg), "Allergy" (yellow), "Peanut Allergy" (red — critical). Har birida tavsif matni. API: `GET /api/students/:id/health`                                                                                | 1.5h     |
| 8.2.8   | **AcademicPerformanceCard** (o'ng top) — "Academic Performance" sarlavha, filter: "Last 6 Months ▼", Half-donut gauge (Recharts): 3.9/4.0, barcha oylar uchun bar chart (Jan–Jun), AI tavsif matni. API: `GET /api/students/:id/academic-performance`                                                                                 | 3h       |
| 8.2.9   | **ExtracurricularTable** (o'ng) — "Extracurricular" sarlavha, table: Club · icon / Achievements ↕ / Duration ↕ / Advisor ↕, sport/dance/robotics icon. API: `GET /api/students/:id/extracurricular`                                                                                                                                   | 1.5h     |
| 8.2.10  | **BehaviorDisciplineLog** (o'ng) — "Behavior & Discipline Log" sarlavha, table: Date / Type&Details / Reported By / Status-Action dropdown (Record Recognition / Recognition Recorded / Issue Warning / Parent Notified). Rang: Positive Note (green) / Minor Issue (yellow) / Major (red). API: `GET /api/students/:id/behavior-log` | 2h       |
| 8.2.11  | Back button (← ), page header breadcrumb                                                                                                                                                                                                                                                                                              | 0.5h     |

**Exit:** Student detail to'liq render qiladi.

---

### Task 8.3: Add Student Page

**Route:** `/admin/students/new`
**File:** `apps/web/src/app/(dashboard)/admin/students/new/page.tsx`

| Subtask | Work Item                                                                                                                                                                                                          | Estimate |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| 8.3.1   | **Shaxsiy Ma'lumotlar section** — Student ID (auto, "S-2111", disabled), Full Name, Date of Birth (DatePicker), Gender (Radio: Male/Female — disabled after save, gender scope), Profile Photo (drag&drop, R2)     | 2h       |
| 8.3.2   | **Kontakt section** — Email Address (auto-generated option), Phone Number (+XX prefix), Address (Street, City, State, ZIP)                                                                                         | 1.5h     |
| 8.3.3   | **Parent/Guardian Info section** — Father (Name + Phone), Mother (Name + Phone), Alternative Guardian (Name + Relation select + Phone)                                                                             | 2h       |
| 8.3.4   | **O'ng panel — Administration section** — Admission Number (auto, "ADM-1009", disabled), Grade (Select: 7/8/9), Section (Select: A/B/C...), Enrollment Date (DatePicker), Previous School (text input, validation) | 2h       |
| 8.3.5   | **O'ng panel — Additional Information section** — Hobbies/Interests (text), Special Needs Support (toggle), Medical Condition Alert (toggle → textarea expand: sabab matni)                                        | 1.5h     |
| 8.3.6   | **Akademik section** — Sinf/Bo'lim, Grant turi (Zakot/Homiy/Boshqa — tenant moduli yoqilgan bo'lsa), umumiy to'lov, to'langan                                                                                      | 1.5h     |
| 8.3.7   | **Modul-based fields** (tenant sozlamalariga qarab): Dormitory (xona), Meals (0/1/3 mahal), Residence permit (olingan/90 kun/yo'q → conditional), Contract number                                                  | 2h       |
| 8.3.8   | Form validation: React Hook Form + Zod, required fields, "Previous school cannot be empty" kabi error messages                                                                                                     | 1.5h     |
| 8.3.9   | `[Save as Draft]` (chap), `[Cancel]` + `[Save & Add Student]` (o'ng). API: `POST /api/students` → success → redirect `/admin/students`                                                                             | 1.5h     |

**Exit:** Add student form to'liq ishlaydi, barcha fieldlar va validation ishlaydi.

---

### FAZA 8 Exit Gate

1. Students list (filter, sort, pagination, special programs) ishlaydi.
2. Student detail (barcha panellar) ishlaydi.
3. Add student form ishlaydi.

---

## FAZA 9 — School Admin: Qolgan Sahifalar

> Attendance, Finance, Notices, Exams, Calendar, Profile, Settings

### Task 9.1: Attendance Page

**Route:** `/admin/attendance`
**File:** `apps/web/src/app/(dashboard)/admin/attendance/page.tsx`
**Dizayn ref:** Figma Image 8

| Subtask | Work Item                                                                                                                                                                                                                                                                                         | Estimate |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 9.1.1   | **AttendanceSummaryCards** (3 ta renkli karta) — Students (pink bg: 1180 present, 94.8%, On-Time 1090/87.5%, Late 90/7.2%, Absent 65/5.2%), Teachers (sky bg: 80, 93%), Staff (navy bg: 32, 91.6%). Filter: "Today ▼". API: `GET /api/admin/attendance/summary?date=today`                        | 2.5h     |
| 9.1.2   | **AttendanceOverviewLineChart** (o'ng) — Sarlavha: "Attendance Overview", filter: "Last Semester ▼", 3 chiziq: Students (pink) / Teachers (sky) / Staff (navy), X-axis: Jan–Jun, Y-axis: 0–100%. API: `GET /api/admin/attendance/overview?period=last_semester`                                   | 2h       |
| 9.1.3   | **AttendanceTabs** — [Students ●] [Teachers] [Staff] tab switcher, Class filter "Class 9A ▼", Oy filter "Mar 2035 ▼"                                                                                                                                                                              | 1h       |
| 9.1.4   | **AttendanceCalendarGrid** (asosiy) — Table: Student column (ID + ism), keyin kunlar (Thu Mar 1, Fri Mar 2... Sun Mar 10...), cell: ✅ (present green), ❌ (absent red), — (holiday/weekend). Sticky Student column. API: `GET /api/admin/attendance/grid?classId=9A&month=2035-03&type=students` | 3h       |
| 9.1.5   | **AttendancePagination** — "Show 10 ▼ of 25 results", page buttons                                                                                                                                                                                                                                | 1h       |

**Exit:** Attendance to'liq ishlaydi, 3 tab (students/teachers/staff) ishlaydi, grid filter ishlaydi.

---

### Task 9.2: Finance — Fees Collection Page

**Route:** `/admin/finance/payments` (canonical: `/admin/finance/fees`)
**File:** `apps/web/src/app/(dashboard)/admin/finance/fees/page.tsx`
**Dizayn ref:** Figma Image 9

| Subtask | Work Item                                                                                                                                                                                                                                                                                                    | Estimate |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| 9.2.1   | **FeesStatCards** (vertikal 3 karta, chap) — Fees Collected ($92,500, navy icon), Pending Fees ($12,300, sky icon), Overdue Payments ($4,750, pink/warning icon)                                                                                                                                             | 1.5h     |
| 9.2.2   | **FeesCollectionTrendChart** (markaz, line) — Sarlavha: "Fees Collection Trend", filter: "Last 8 Months ▼", Recharts `<LineChart>` + area fill, hover tooltip: "April 2035: $67,250". API: `GET /api/finance/fees/trend?months=8`                                                                            | 2h       |
| 9.2.3   | **FeesProgressBars** (o'ng) — 4 kategoriya progress bars: Tuition Fee 87.5% ($70k/$80k), Books & Supplies 87.5%, Activities 90%, Miscellaneous 86.5%. API: `GET /api/finance/fees/progress`                                                                                                                  | 1.5h     |
| 9.2.4   | **FeesFilterBar** — "All Classes ▼", "All Status ▼", "This Month ▼"                                                                                                                                                                                                                                          | 0.5h     |
| 9.2.5   | **FeesTable** (grouped by student) — Student ID (sky link), Ism, Class, Fee Category (Tuition/Books/Activities/Misc), Total Amount, Due Date, Status badge (Paid green / Pending yellow / Overdue red / Partially Paid purple). API: `GET /api/finance/fees?page=1&limit=5&classId=...&status=...&month=...` | 3h       |
| 9.2.6   | Pagination: "Show 5 ▼ of 25 results"                                                                                                                                                                                                                                                                         | 0.5h     |

**Exit:** Fees page to'liq ishlaydi.

---

### Task 9.3: Finance — Expenses Page

**Route:** `/admin/finance/expenses` (canonical: `/admin/finance/invoices`)
**File:** `apps/web/src/app/(dashboard)/admin/finance/expenses/page.tsx`
**Dizayn ref:** Figma Image 10

| Subtask | Work Item                                                                                                                                                                                                                                                                                                                   | Estimate |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 9.3.1   | **ExpenseTrendChart** (chap, bar) — Sarlavha: "Expense Trend", filter: "Last 8 Months ▼", Recharts `<BarChart>`, joriy oy dark navy, boshqalar pink. Hover: "April 2035: $73,250". API: `GET /api/finance/expenses/trend?months=8`                                                                                          | 2h       |
| 9.3.2   | **ExpenseBreakdownDonut** — Sarlavha: "Expense Breakdown" + "...", Recharts `<PieChart>` donut, markazda "Total Expense $125,000", legend: Salaries 55% ($68,750) / Supplies 15% / Events 10% / Maintenance 12% / Others 8%. API: `GET /api/finance/expenses/breakdown`                                                     | 2h       |
| 9.3.3   | **ReimbursementsTable** (Kommunal To'lovlar) — sarlavha: "Kommunal To'lovlar", filter: "This Week ▼", table: Request ID (sky) / Staff Name+Dept / Amount (sky bold) / Date / Proof (View File link) / Status (Approved green / Declined red / Approve+Decline actions). API: `GET /api/finance/reimbursements?week=current` | 2.5h     |
| 9.3.4   | **ExpensesFilterBar** — "All Categories ▼", "This Month ▼", `[+ Qo'shish]` button                                                                                                                                                                                                                                           | 0.5h     |
| 9.3.5   | **ExpensesTable** — table: Expense ID (sky) / Date / Department / Category badge (Supplies sky / Events blue / Maintenance orange / Salaries green) / Description / Amount (red bold). API: `GET /api/finance/expenses?page=1&limit=8&category=...&month=...`                                                               | 2.5h     |
| 9.3.6   | **Add Expense Modal** — `[+ Qo'shish]` bosganida: Department (select), Izoh (textarea), Kategoriya (select: Maosh/Tadbir/Tamirlash/Boshqa/Custom), Summa. API: `POST /api/finance/expenses`                                                                                                                                 | 2h       |
| 9.3.7   | Pagination: "Show 8 ▼ of 40 results"                                                                                                                                                                                                                                                                                        | 0.5h     |

**Exit:** Expenses page to'liq ishlaydi, add expense modal ishlaydi.

---

### Task 9.4: Notice Board Page

**Route:** `/admin/notices`
**File:** `apps/web/src/app/(dashboard)/admin/notices/page.tsx`
**Dizayn ref:** Figma Image 11

| Subtask | Work Item                                                                                                                                                                                                                                                                                                                                         | Estimate |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 9.4.1   | **NoticeFilterBar** — "All Categories ▼" (Academic/Events/Finance/Maintenance/Training/Notice/Arts/Announcement + Custom), "Sort by: Latest ▼" (Latest/Oldest/Expiring/Most Viewed), `[+ E'lon qo'shish]` button                                                                                                                                  | 1h       |
| 9.4.2   | **NoticeCard** (list item) — thumbnail (64×64), kategoriya badge (rang: Academic=purple/Events=blue/Finance=green/etc.), sarlavha (bold), audience icon+text, Post Date, Exp. Date, Created By, Status badge (Active green / Scheduled blue / Draft grey / Expired red), "..." menyu                                                              | 2h       |
| 9.4.3   | **NoticeList** — vertical scroll list, click → detail panel ochiladi                                                                                                                                                                                                                                                                              | 0.5h     |
| 9.4.4   | **NoticeDetailPanel** (o'ng panel, slide-in yoki sticky) — banner rasm, kategoriya badge, views count, status badge, Sarlavha (bold), "by [Author]", Audience/Post Date/Exp. Date metadata, Content matn (to'liq), Attachment (PDF icon, nom, hajm), `[Edit]` / `[Delete]` / `[Share]` / `[Archive]` tugmalar. API: `GET /api/notices/:id`        | 3h       |
| 9.4.5   | **AddEditNoticeModal** — `[+ E'lon qo'shish]` yoki `[Edit]` bosganida: Sarlavha, Kategoriya (select + rang picker), Audience (multi-select: All/Grade 7/8/9/Specific class/Teachers/Parents), Post Date+Time, Exp. Date+Time, Content (textarea), Attachment upload (R2), Gender scope toggle. API: `POST /api/notices`, `PATCH /api/notices/:id` | 3.5h     |
| 9.4.6   | **Pagination** — "Show 9 ▼ of 25 results"                                                                                                                                                                                                                                                                                                         | 0.5h     |

**Exit:** Notice board to'liq ishlaydi, detail panel, add/edit modal ishlaydi.

---

### Task 9.5: Exams Page

**Route:** `/admin/exams`
**File:** `apps/web/src/app/(dashboard)/admin/exams/page.tsx`

| Subtask | Work Item                                                                                                                                                                                                           | Estimate |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 9.5.1   | **ExamsMonthFilter** — horizontal scroll, 12 oylik tab (Yan-Dek), aktiv oy highlight (navy)                                                                                                                         | 1h       |
| 9.5.2   | **ExamCalendarGrid** — kun raqamlari (1,2,3...), har kunda o'sha kundagi imtihon cards (grid). API: `GET /api/exams?month=2035-03`                                                                                  | 2h       |
| 9.5.3   | **ExamCard** — Fan rangi (Matematika=yellow, Fizika=purple, Ingliz=blue, Kimyo=green...), Xona raqami, Sinf, Vaqt, Fan nomi, Tasdiqlangan o'quvchilar soni, Status badge, countdown (4 kun qoldi: green→orange→red) | 2h       |
| 9.5.4   | **MiniCalendar** (o'ng) — exam bor kunlar dot bilan belgilangan                                                                                                                                                     | 1h       |
| 9.5.5   | **AddExamModal** — Fan, Sinf, Xona, Sana, Vaqt, Tasviriyot. API: `POST /api/exams`                                                                                                                                  | 2h       |

**Exit:** Exams page ishlaydi.

---

### Task 9.6: Calendar Page

**Route:** `/admin/calendar`
**File:** `apps/web/src/app/(dashboard)/admin/calendar/page.tsx`
**Dizayn ref:** Figma Image 2

| Subtask | Work Item                                                                                                                                                                                                           | Estimate |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 9.6.1   | **CalendarCategoryTabs** — "All Schedules 12" / "Academic 4" / "Events 3" / "Finance 2" / "Administration 3" — har biri count badge bilan                                                                           | 1h       |
| 9.6.2   | **CalendarHeader** — "March 2035 ▼" (month picker dropdown), [Day] [Week] [Month●] toggle buttons, `[+ Add Agenda]` button                                                                                          | 1h       |
| 9.6.3   | **MonthView** (default) — full month grid (Sun–Sat), event chips (kategoriya rangida: Academic pink / Events sky / Finance navy / Admin grey), multi-event cells. API: `GET /api/events?month=2035-03&tenantId=...` | 4h       |
| 9.6.4   | **WeekView** — 7 ustun, time slots (08:00–20:00), event blocks                                                                                                                                                      | 2h       |
| 9.6.5   | **DayView** — timeline, 1 kun, event blocks                                                                                                                                                                         | 1.5h     |
| 9.6.6   | **ScheduleDetailPanel** (o'ng sticky) — event bosganida: kategoriya badge, sarlavha (bold), 📅 sana, ⏰ vaqt, 📍 joy, 📝 Notes. `[x]` yopish. Multiple events: stacked cards. API: `GET /api/events/:id`            | 2h       |
| 9.6.7   | **AddAgendaModal** — Nomi, Kategoriya (select), Sana, Vaqt (from–to), Joy/Platform, Ko'rish huquqi (All/Admin/Teachers/Students). API: `POST /api/events`                                                           | 2h       |

**Exit:** Calendar 3 ko'rinish (Month/Week/Day) ishlaydi, detail panel ishlaydi, add agenda ishlaydi.

---

### Task 9.7: Admin Profile Page

**Route:** `/admin/profile`
**File:** `apps/web/src/app/(dashboard)/admin/profile/page.tsx`

| Subtask | Work Item                                                                                                      | Estimate |
| ------- | -------------------------------------------------------------------------------------------------------------- | -------- |
| 9.7.1   | **ProfileHeader** — cover banner, round avatar (editable, R2 upload), Ism, Lavozim "School Admin", maktab nomi | 1.5h     |
| 9.7.2   | **PersonalInfoCard** — Ism/Familiya, Email, Telefon, Manzil, Tug'ilgan sana — edit mode toggle                 | 2h       |
| 9.7.3   | **SecurityCard** — Parol o'zgartirish: Eski parol / Yangi parol / Tasdiqlash, [Save]                           | 1.5h     |
| 9.7.4   | **SessionsCard** — Aktiv sessiyalar: device, IP, browser, sana, [Disconnect]                                   | 1.5h     |
| 9.7.5   | **ActivityLogCard** — Oxirgi 10 ta harakat: action, vaqt                                                       | 1h       |

**Exit:** Profile page to'liq ishlaydi.

---

### Task 9.8: Admin Settings Page

**Route:** `/admin/settings`
**File:** `apps/web/src/app/(dashboard)/admin/settings/page.tsx`

| Subtask | Work Item                                                                                                                                                                             | Estimate |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 9.8.1   | **SettingsTabs** — left sidebar nav: Maktab Ma'lumotlari / Sinflar / Fanlar / Modullar / Rollar / To'lov Kategoriyalari / Bildirishnomalar                                            | 1h       |
| 9.8.2   | **SchoolInfoTab** — Maktab nomi, logo upload, manzil, telefon, email, gender policy (Boys/Girls/All). API: `GET /api/tenants/me`, `PATCH /api/tenants/me`                             | 2h       |
| 9.8.3   | **ClassesTab** — table: Sinf nomi, Grade, Section, O'quvchilar soni, O'qituvchi; CRUD (add/edit/delete modal). API: `GET /api/classes`, `POST /api/classes`, `PATCH /api/classes/:id` | 3h       |
| 9.8.4   | **SubjectsTab** — table: Fan nomi, Kod, Aktiv toggle; CRUD. API: `GET /api/subjects`, `POST /api/subjects`                                                                            | 2h       |
| 9.8.5   | **ModulesTab** — toggle switches: Dormitory / Meals / Residence / Contract / Departments. API: `PATCH /api/tenants/me/modules`                                                        | 1.5h     |
| 9.8.6   | **FeeStructureTab** — to'lov kategoriyalari (Tuition/Books/Activities/Misc + custom), summa, aktiv toggle. API: `GET /api/finance/fee-structures`, `POST /api/finance/fee-structures` | 2h       |
| 9.8.7   | **NotificationSettingsTab** — Bildirishnoma turlari toggle: Email/SMS/Push, trigger turlari                                                                                           | 1.5h     |

**Exit:** Settings barcha tablar ishlaydi.

---

### FAZA 9 Exit Gate

1. Barcha admin sahifalar (Attendance, Finance×2, Notices, Exams, Calendar, Profile, Settings) to'liq ishlaydi.
2. Barcha API endpointlar real data bilan ishlaydi.

---

## FAZA 10 — Student Dashboard + All Student Pages

> Route group: `apps/web/src/app/(dashboard)/student/`
> Dizayn ref: Figma Image 13 (Student Dashboard)

### Task 10.1: Student Layout

**File:** `apps/web/src/app/(dashboard)/student/layout.tsx`

| Subtask | Work Item                                                                                                                                                                                                                                                | Estimate |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 10.1.1  | **StudentSidebar** — Logo (Talimy), nav items: Dashboard, Teachers (faqat o'qish), Students (emas), Attendance, Finance (ko'rish), Notice, Calendar, Library (ixtiyoriy), Message, Profile, Setting, Log out. Brand rang: primary colors (Navy/Pink/Sky) | 2h       |
| 10.1.2  | **StudentHeader** — Search, Notification bell, avatar, "Student" subtitle                                                                                                                                                                                | 1h       |
| 10.1.3  | Auth guard: `student` rol tekshiruvi                                                                                                                                                                                                                     | 0.5h     |

---

### Task 10.2: Student Dashboard Page

**Route:** `/student/dashboard`
**File:** `apps/web/src/app/(dashboard)/student/dashboard/page.tsx`
**Dizayn ref:** Figma Image 13

| Subtask | Work Item                                                                                                                                                                                                                                                 | Estimate |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 10.2.1  | **WelcomeCard** (top) — Round avatar, "Welcome, [Ism]" (bold), AI maslahat matni (motivatsiya, 1-2 jumlali), Grade, DOB, email, phone. AI: `GET /api/students/me/ai-advice` (24h cache)                                                                   | 3h       |
| 10.2.2  | **StatsRow** (4 karta) — Attendance 97% (↑), Task Completed 258+ (↑), Task In Progress 64% (↓), Reward Points 245                                                                                                                                         | 1.5h     |
| 10.2.3  | **PerformanceGauge** (chap, half-donut) — "3.4 / 4.0 max GPA", "1st Semester – 6th Semester", Recharts semi-circle gauge. API: `GET /api/students/me/performance-summary`                                                                                 | 2h       |
| 10.2.4  | **ScoreActivityChart** (markaz, line) — "Score Activity", filter: "Weekly ▼", Recharts `<LineChart>`, X-axis: Apr 10–16, Y-axis: 0–100, hover: "70%". API: `GET /api/students/me/score-activity?period=weekly`                                            | 2h       |
| 10.2.5  | **RecentActivity** (chap) — "TODAY" va "YESTERDAY" sections, timeline: icon + bold action + normal tavsif + vaqt. API: `GET /api/students/me/activity?limit=10`                                                                                           | 1.5h     |
| 10.2.6  | **GradeBySubjectChart** (markaz, horizontal bar) — Recharts `<BarChart>` horizontal, subjects: Biology/Chemistry/Geography/History/Literature/Art, filter: "Weekly ▼" + "Grade 3 ▼". API: `GET /api/students/me/grades-by-subject`                        | 2h       |
| 10.2.7  | **AssignmentsTable** (pastki full-width) — "Assignments", search. Columns: No / Task / Subject / Due Date / Time / Status (In Progress sky / Not Started grey / Submitted green) / Action (✏️ 🗑️). API: `GET /api/students/me/assignments?page=1&limit=5` | 2.5h     |
| 10.2.8  | **MiniCalendar** (o'ng) — Bugun highlight, prev/next                                                                                                                                                                                                      | 1.5h     |
| 10.2.9  | **AgendaList** (o'ng) — "View All", 4 ta kelgusi event: kun rangi badge, sinf, fan, vaqt, mavzu. API: `GET /api/events/me?dateFrom=today&limit=4`                                                                                                         | 1.5h     |
| 10.2.10 | **MessagesPreview** (o'ng) — 3 ta preview: avatar, ism, vaqt, matn snippet, unread badge. API: `GET /api/messages/me?limit=3`                                                                                                                             | 1.5h     |

---

### Task 10.3: Student — Schedule Page

**Route:** `/student/schedule`

| Subtask | Work Item                                                                                                                                                                         | Estimate |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 10.3.1  | **WeeklyTimetableGrid** — Y-axis: vaqt (08:00–17:00), X-axis: Mon–Fri, cell: Fan nomi, Xona, O'qituvchi ism. Rangi fanga qarab. API: `GET /api/students/me/schedule?week=current` | 3h       |
| 10.3.2  | Week filter: prev/next week navigation                                                                                                                                            | 0.5h     |

---

### Task 10.4: Student — Assignments Page

**Route:** `/student/assignments`

| Subtask | Work Item                                                                                                                                         | Estimate |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 10.4.1  | **AssignmentsHeader** — "Search by Subject", filter buttons: All / In Progress / Not Started / Submitted                                          | 1h       |
| 10.4.2  | **AssignmentsFullTable** — expanded table (barcha sahifalar), pagination. API: `GET /api/students/me/assignments?page=1&limit=10&status=...`      | 2h       |
| 10.4.3  | **AssignmentDetailModal** — click row → modal: sarlavha, fan, tavsif, deadline, fayl upload (topshirish). API: `POST /api/assignments/:id/submit` | 2h       |

---

### Task 10.5: Student — Grades Page

**Route:** `/student/grades`

| Subtask | Work Item                                                                                                                                  | Estimate |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| 10.5.1  | **GradesSummaryRow** — GPA gauge, semestr select                                                                                           | 1h       |
| 10.5.2  | **GradesBySubjectTable** — table: Fan / O'qituvchi / Ball / Baho (A/B/C) / Trend icon. API: `GET /api/students/me/grades?semester=current` | 2h       |
| 10.5.3  | **GPAHistoryChart** — line chart, semestr bo'yicha GPA dinamikasi                                                                          | 1.5h     |

---

### Task 10.6: Student — Attendance Page

**Route:** `/student/attendance`

| Subtask | Work Item                                                                                                            | Estimate |
| ------- | -------------------------------------------------------------------------------------------------------------------- | -------- |
| 10.6.1  | **AttendanceStatsRow** — Present %, Late %, Absent %, Sick %                                                         | 1h       |
| 10.6.2  | **AttendanceCalendarView** — oylik grid, ranglar, month filter. API: `GET /api/students/me/attendance?month=current` | 2h       |

---

### Task 10.7: Student — Other Pages (Exams, Notices, Calendar, Profile)

| Subtask | Work Item                                                                                                                  | Estimate |
| ------- | -------------------------------------------------------------------------------------------------------------------------- | -------- |
| 10.7.1  | **Exams page** — jadval ko'rish (faqat o'z sinfi), natijalar (faqat ko'rish). API: `GET /api/exams/me`                     | 2h       |
| 10.7.2  | **Notices page** — faqat o'ziga mo'ljallangan e'lonlar, read-only. API: `GET /api/notices/me`                              | 1.5h     |
| 10.7.3  | **Calendar page** — Academic + Events (faqat o'z sinfi), Month view default. API: `GET /api/events/me`                     | 2h       |
| 10.7.4  | **Profile page** — Shaxsiy ma'lumotlar (read-only uchun), ota-ona kontakti, hujjatlar. API: `GET /api/students/me/profile` | 2h       |

---

### FAZA 10 Exit Gate

1. Student dashboard (AI advice, barcha widgetlar) ishlaydi.
2. Barcha student sahifalari ishlaydi.

---

## FAZA 11 — Teacher Dashboard + All Teacher Pages

> Route group: `apps/web/src/app/(dashboard)/teacher/`
> Dizayn ref: Figma Image 12 (Teacher Dashboard)

### Task 11.1: Teacher Layout

| Subtask | Work Item                                                                                                                                                          | Estimate |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| 11.1.1  | **TeacherSidebar** — Nav: Dashboard, Teachers (o'z guruhlari), Students, Attendance, Finance (yo'q), Notice, Calendar, Library, Message, Profile, Settings, Logout | 2h       |
| 11.1.2  | **TeacherHeader** — Search, Notification, Avatar, "Teacher" subtitle                                                                                               | 1h       |
| 11.1.3  | Auth guard: `teacher` rol                                                                                                                                          | 0.5h     |

---

### Task 11.2: Teacher Dashboard Page

**Route:** `/teacher/dashboard`
**Dizayn ref:** Figma Image 12

| Subtask | Work Item                                                                                                                                                                                               | Estimate |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 11.2.1  | **StatsRow** (4 karta) — Total Classes ↑15% / Total Students ↓5% / Total Hours ↓10% / Total Income ↑23%. API: `GET /api/teachers/me/dashboard/stats`                                                    | 1.5h     |
| 11.2.2  | **ClassEfficiencyTop3** (chap) — "Sinf Samaradorligi Top 3": har bir sinf nomi + o'rtacha GPA progress bar. API: `GET /api/teachers/me/class-performance`                                               | 2h       |
| 11.2.3  | **StudentAttendanceDonut** (chap) — 80% Present, Recharts donut, sana filter, guruh filter. API: `GET /api/teachers/me/attendance-summary?classId=...&date=...`                                         | 1.5h     |
| 11.2.4  | **StudentPerformanceChart** (markaz, grouped bar) — Mon–Fri, Class10/11/12 legend. API: `GET /api/teachers/me/student-performance?period=weekly`                                                        | 2h       |
| 11.2.5  | **RecentActivityTimeline** (markaz) — Curriculum Update Submitted / Student Grade Posted / Department Meeting Reminder. API: `GET /api/teachers/me/activity`                                            | 1.5h     |
| 11.2.6  | **TeachingActivityChart** (markaz, line) — "Teaching Activity", filter: "Monthly ▼", Jan–Dec, Working Hours tooltip. API: `GET /api/teachers/me/teaching-activity?period=monthly`                       | 2h       |
| 11.2.7  | **HomeworkTable** (pastki full-width) — "Student Tasks": Student / Topic / Task Name / Due Date / Status (Active/Not Viewed/Reviewing) / Action. API: `GET /api/teachers/me/assignments?page=1&limit=6` | 2.5h     |
| 11.2.8  | **MiniCalendar + Agenda + Messages** (o'ng) — (Teacher Dashboard image asosida)                                                                                                                         | 2h       |

---

### Task 11.3: Teacher — My Students Page

**Route:** `/teacher/students`

| Subtask | Work Item                                                                                                                                                          | Estimate |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| 11.3.1  | Faqat o'z guruhlari → o'quvchilar table (StudentsTable shared component, limitlangan). Gender scope qo'llaniladi. API: `GET /api/teachers/me/students?classId=...` | 2h       |
| 11.3.2  | Student karta click → `/admin/students/[id]` (read-only mode teacher uchun)                                                                                        | 0.5h     |

---

### Task 11.4: Teacher — Attendance Page

**Route:** `/teacher/attendance`

| Subtask | Work Item                                                                                                                                                                                                  | Estimate |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 11.4.1  | **AttendanceMarkingGrid** — Faqat o'z sinflari, class filter, date filter, real-time marking: click cell → 3 holat popup (On Time / Late / Absent + sabab kiritish). WebSocket: belgilash → barcha ko'radi | 4h       |
| 11.4.2  | WebSocket room: `attendance:classId:date` — teacher mark → broadcast                                                                                                                                       | 2h       |

---

### Task 11.5: Teacher — Assignments Page

**Route:** `/teacher/assignments`

| Subtask | Work Item                                                                                                                                                   | Estimate |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 11.5.1  | **AssignmentsTeacherView** — table: Vazifa / Guruh / Berilgan sana / Status. Click → detail. API: `GET /api/teachers/me/assignments`                        | 2h       |
| 11.5.2  | **AddAssignmentModal** — Fan, Guruh, Sarlavha, Tavsif, Due Date, Fayl (ixtiyoriy). API: `POST /api/assignments`                                             | 2h       |
| 11.5.3  | **SubmissionsView** — topshirilgan ish: o'quvchi, sana, fayl link, "Bajarildi/Bajarilmadi" toggle. API: `PATCH /api/assignments/:id/submissions/:studentId` | 2h       |

---

### Task 11.6: Teacher — Grades, Exams, Schedule, Notices, Calendar, Profile, Settings

| Subtask | Work Item                                                                                                                                                                                                             | Estimate |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 11.6.1  | **Grades page** — baho kiritish table: o'quvchi / exam / ball / baho. API: `POST /api/grades`                                                                                                                         | 2.5h     |
| 11.6.2  | **Exams page** — o'z fani imtihonlari, natija kiritish. API: `GET /api/exams?teacherId=me`, `POST /api/exams/:id/results`                                                                                             | 2h       |
| 11.6.3  | **Schedule page** — Haftalik timetable (o'qituvchi faqat o'ziniki ko'radi). API: `GET /api/teachers/me/schedule`                                                                                                      | 1.5h     |
| 11.6.4  | **Notices page** — ko'rish + o'quvchilarga yozish (AddNoticeModal shared). API: `GET /api/notices/me`, `POST /api/notices`                                                                                            | 1.5h     |
| 11.6.5  | **Calendar page** — Academic + Events kategoriyalar. API: `GET /api/events/me?role=teacher`                                                                                                                           | 1.5h     |
| 11.6.6  | **Teacher Profile page** — o'z profili (shared `TeacherDetail` components, teacher mode): Profil ma'lumotlari edit + yangi leave so'rov yuborish. API: `GET /api/teachers/me`, `POST /api/teachers/me/leave-requests` | 2h       |
| 11.6.7  | **Settings page** — Bildirishnomalar toggle (Email/SMS/Telegram), til, parol o'zgartirish                                                                                                                             | 1.5h     |

---

### FAZA 11 Exit Gate

1. Teacher layout ishlaydi.
2. Teacher dashboard (barcha widgetlar) ishlaydi.
3. Attendance real-time marking (WebSocket bilan) ishlaydi.
4. Barcha teacher sahifalari ishlaydi.

---

## FAZA 12 — Parent Dashboard + Profile

> Route group: `apps/web/src/app/(dashboard)/parent/`

### Task 12.1: Parent Layout + Dashboard + Profile

| Subtask | Work Item                                                                                                                                                                                                                                                                                                                                                                 | Estimate |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 12.1.1  | **ParentSidebar** — faqat 3 item: Dashboard, Profile, Logout. Minimal                                                                                                                                                                                                                                                                                                     | 1h       |
| 12.1.2  | **ParentDashboard page** — Route: `/parent/dashboard`. Farzand statistikasi (faqat ko'rish): StatsRow (Attendance/Task/InProgress/Reward), PerformanceGauge, ScoreActivity line chart, GradeBySubject bar chart, RecentActivity, Assignments (read-only), MiniCalendar+Agenda. Shared student dashboard components reuse qiladi. API: `GET /api/parents/me/child-summary` | 3h       |
| 12.1.3  | **ParentProfile page** — Route: `/parent/profile`. Ota-ona shaxsiy ma'lumotlari (ism, telefon, email, manzil, Telegram username). API: `GET /api/parents/me`, `PATCH /api/parents/me`                                                                                                                                                                                     | 1.5h     |
| 12.1.4  | Auth guard: `parent` rol                                                                                                                                                                                                                                                                                                                                                  | 0.5h     |

---

### FAZA 12 Exit Gate

1. Parent dashboard (farzand ma'lumotlari, read-only) ishlaydi.
2. Parent profile edit ishlaydi.

---

## FAZA 13 — Platform Admin: Layout + Dashboard + Maktablar + Settings

> Subdomain: `platform.talimy.space`
> Route group: `apps/web/src/app/(platform)/`

### Task 13.1: Platform Admin Layout

| Subtask | Work Item                                                                                                                                   | Estimate |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 13.1.1  | **PlatformSidebar** — Logo (Talimy Platform), Nav: Dashboard, Maktablar, Billinglar, Analytics, Sozlamalar, Profil, Logout. Dark navy theme | 2h       |
| 13.1.2  | **PlatformHeader** — Search, Notification, Avatar, "Platform Admin" subtitle                                                                | 1h       |
| 13.1.3  | Auth guard: `platform_admin` rol, subdomain `platform.talimy.space` tekshiruvi                                                              | 1h       |

---

### Task 13.2: Platform Dashboard Page

**Route:** `platform.talimy.space/dashboard`

| Subtask | Work Item                                                                                                      | Estimate |
| ------- | -------------------------------------------------------------------------------------------------------------- | -------- |
| 13.2.1  | **PlatformStatsRow** (4 karta) — Maktablar (24), O'quvchilar (8,432), MRR ($48,200), Aktiv (21)                | 1.5h     |
| 13.2.2  | **MRR Growth Chart** (line) — 12 oylik daromad dinamikasi. API: `GET /api/platform/mrr?months=12`              | 2h       |
| 13.2.3  | **SchoolStatusDonut** — Trial/Active/Suspended/Cancelled. API: `GET /api/platform/schools/status-breakdown`    | 1.5h     |
| 13.2.4  | **StudentsGrowthChart** (area) — 5 yillik o'sish grafigi. API: `GET /api/platform/students/growth?years=5`     | 1.5h     |
| 13.2.5  | **RecentActivityTimeline** — Yangi maktab, to'lov, admin o'zgarish. API: `GET /api/platform/activity?limit=10` | 1.5h     |
| 13.2.6  | **QuickActionsBar** — [+ Yangi Maktab] / [📢 Xabar] / [📊 Hisobot] / [⏰ Eslatma] tugmalar                     | 1h       |

---

### Task 13.3: Schools Management Page

| Subtask | Work Item                                                                                                                                                                                                          | Estimate |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| 13.3.1  | **SchoolsTable** — Logo / Maktab nomi + subdomain / Tarif badge / Holat badge / O'quvchilar / MRR / [👁 Ko'rish] [✏️ Edit] [⋯] actions. API: `GET /api/platform/schools?page=1&limit=10`                           | 2.5h     |
| 13.3.2  | **School Detail Page** — `/platform/schools/[id]`: Maktab ma'lumotlari + Statistika + To'lovlar tarixi + Audit Log + Adminlar ro'yxati + Modullar toggles. API: `GET /api/platform/schools/:id`                    | 4h       |
| 13.3.3  | **Add New School Modal/Page** — Asosiy ma'lumotlar (ism, email, tel) + Subdomain + Tarif select + Trial muddati + Modullar + Gender ajratish + Birinchi admin (ism+email+parol). API: `POST /api/platform/schools` | 3h       |

---

### Task 13.4: Platform Settings Page

| Subtask | Work Item                                                                                                                                                                                                    | Estimate |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| 13.4.1  | **Settings tabs** — Profil / Billing / Email Templates / Bildirishnomalar / Domain / API Keys / Tariflar / Xavfsizlik                                                                                        | 1h       |
| 13.4.2  | **PricingPlansTab** — 4 tarif jadvali: Free ($0) / Basic ($50/m) / Premium ($150/m) / Enterprise ($400/m) — narx, limit, feature list, edit. API: `GET /api/platform/plans`, `PATCH /api/platform/plans/:id` | 2.5h     |
| 13.4.3  | **APIKeysTab** — aktif API kalitlar ro'yxati, yangi kalit yaratish, eskilarini o'chirish                                                                                                                     | 1.5h     |

---

### FAZA 13 Exit Gate

1. Platform admin layout + auth ishlaydi.
2. Dashboard widgetlar ishlaydi.
3. Schools CRUD ishlaydi.

---

## FAZA 14 — talimy.space Landing Page

> Route: `talimy.space/`
> File: `apps/web/src/app/(marketing)/page.tsx`
> Dizayn: zamonaviy SaaS landing (Navy/Pink/Sky brand colors)

### Task 14.1: Marketing Layout

| Subtask | Work Item                                                                                                          | Estimate |
| ------- | ------------------------------------------------------------------------------------------------------------------ | -------- |
| 14.1.1  | **MarketingLayout** — transparent nav header, footer, no sidebar. `apps/web/src/app/(marketing)/layout.tsx`        | 1h       |
| 14.1.2  | **Navbar** — Logo (Talimy), nav links (Features, Pricing, About, Contact), [Kirish] + [Bepul boshlash] CTA buttons | 1.5h     |
| 14.1.3  | **Footer** — Logo, links (Privacy Policy, Terms), social icons, copyright                                          | 1h       |

---

### Task 14.2: Landing Page Sections

| Subtask | Work Item                                                                                                                                                                                              | Estimate |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| 14.2.1  | **HeroSection** — sarlavha (bold, large: "O'zbek Maktablari Uchun Zamonaviy Boshqaruv Tizimi"), tavsif, [Bepul Boshlash] (pink) + [Demo Ko'rish] (ghost) CTA, hero illustration/mockup                 | 3h       |
| 14.2.2  | **StatsSection** — 4 ta katta son: Maktablar / O'quvchilar / O'qituvchilar / Shaharlar                                                                                                                 | 1h       |
| 14.2.3  | **FeaturesGrid** — 6 feature card: Admin Dashboard, O'qituvchi Boshqaruvi, O'quvchi Profili, Davomat (Real-time), Moliya, AI Maslahat — icon, sarlavha, tavsif                                         | 2.5h     |
| 14.2.4  | **DashboardPreviewSection** — browser mockup ichida dashboard screenshot/animation, features list (✅ checkmarks)                                                                                      | 2h       |
| 14.2.5  | **RolesSection** — 4 tab: Admin / O'qituvchi / O'quvchi / Ota-ona — har birining dashboard preview card + feature bullets                                                                              | 3h       |
| 14.2.6  | **PricingSection** — 4 tarif card: Free / Basic / Premium / Enterprise — narx, feature list, [Boshlash] CTA, "Eng Mashhur" badge (Premium). Dynamic pricing from API: `GET /api/platform/plans/public` | 3h       |
| 14.2.7  | **TestimonialsSection** — 3 ta maktab direktoridan iqtibos, avatar, maktab nomi                                                                                                                        | 1.5h     |
| 14.2.8  | **CTASection** — "Bugun Boshlang" banner, email input + [Bepul Sinab Ko'ring] tugma, "Kredit karta talab qilinmaydi"                                                                                   | 1.5h     |
| 14.2.9  | SEO metadata: `<title>`, `<description>`, OpenGraph, JSON-LD schema                                                                                                                                    | 1h       |
| 14.2.10 | Responsive: mobile (1 ustun), tablet (2 ustun), desktop (3 ustun). Animatsiyalar: scroll-based fade-in (CSS/Framer Motion)                                                                             | 2h       |

---

### Task 14.3: Other Public Pages

| Subtask | Work Item                                                                                    | Estimate |
| ------- | -------------------------------------------------------------------------------------------- | -------- |
| 14.3.1  | **About page** `/about` — Talimy haqida, jamoa, vazifa                                       | 1.5h     |
| 14.3.2  | **Contact page** `/contact` — Forma: ism, email, xabar, [Yuborish]. API: `POST /api/contact` | 1.5h     |
| 14.3.3  | **Privacy Policy + Terms** `/privacy`, `/terms` — statik matn sahifalari                     | 1h       |

---

### FAZA 14 Exit Gate

1. Landing page barcha seksiyalar ishlaydi.
2. SEO metadata to'g'ri.
3. Responsive (mobile, tablet, desktop).

---

## FAZA 15 — Real-time Infrastructure (WebSocket Integration in Pages)

### Task 15.1: Real-time Infrastructure Setup

| Subtask | Work Item                                                                                                                             | Estimate |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 15.1.1  | Socket.IO `SocketProvider` (`apps/web/src/providers/socket-provider.tsx`) — client connection, reconnect logic, auth token forwarding | 2h       |
| 15.1.2  | `useSocket` hook — event subscribe/unsubscribe, room join/leave                                                                       | 1.5h     |

### Task 15.2: Notification System

| Subtask | Work Item                                                                                                                                                                          | Estimate |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 15.2.1  | **NotificationBell** — real-time unread badge update, dropdown list (type icon + matn + vaqt + o'qilmagan indicator), "Barchasini o'qildi" tugma. Socket event: `notification:new` | 3h       |
| 15.2.2  | **Toast notifications** — real-time toastlar (sonner), har xil tur: info/success/warning/error                                                                                     | 1h       |
| 15.2.3  | **Notification store** (Zustand) — notifications[], unreadCount, addNotification, markAllRead                                                                                      | 1h       |

### Task 15.3: Real-time Events in Pages

| Subtask | Work Item                                                                                                                        | Estimate |
| ------- | -------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 15.3.1  | Teacher attendance marking → WebSocket broadcast → admin attendance grid real-time yangilanishi. Room: `attendance:classId:date` | 3h       |
| 15.3.2  | New notice posted → target audience real-time notification                                                                       | 1.5h     |
| 15.3.3  | Messages real-time: `message:new` event → MessagesPreview yangilanishi                                                           | 2h       |

---

### FAZA 15 Exit Gate

1. WebSocket connection ishlaydi.
2. Notification bell real-time ishlaydi.
3. Attendance real-time belgilash ishlaydi.

---

## FAZA 16 — AI Integration

### Task 16.1: Student Dashboard AI Advice

| Subtask | Work Item                                                                                                   | Estimate |
| ------- | ----------------------------------------------------------------------------------------------------------- | -------- |
| 16.1.1  | Backend: `GET /api/students/me/ai-advice` → Claude API (Sonnet) → motivatsiya generatsiya → 24h Redis cache | 3h       |
| 16.1.2  | Frontend: WelcomeCard'da AI advice matn loading skeleton → matn ko'rinishi                                  | 1h       |

### Task 16.2: Admin AI Reports

| Subtask | Work Item                                                                                                                                                                                                            | Estimate |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 16.2.1  | **AIReportModal** (admin dashboard) — "AI Hisobot Generatsiya" button, modal: hisobot turi select (Attendance/Grades/Finance), [Generatsiya qilish] → loading → markdown taqdimot. API: `POST /api/admin/ai-reports` | 3h       |
| 16.2.2  | Backend: BullMQ job → Claude API → report saqlash → notify admin                                                                                                                                                     | 3h       |

### Task 16.3: Parent Telegram Bot

| Subtask | Work Item                                                                                                                                   | Estimate |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 16.3.1  | Backend Telegram bot setup (Telegraf library), webhook, `/start` command                                                                    | 3h       |
| 16.3.2  | BullMQ trigger: o'quvchi haftalik bahosi 50% < → parent telegram username → xabar yuborish. API: `POST /api/parents/:id/telegram-subscribe` | 3h       |

---

### FAZA 16 Exit Gate

1. Student AI advice ishlaydi (24h cache).
2. Admin AI report generatsiya ishlaydi.
3. Parent Telegram bot alert ishlaydi.

---

## FAZA 17 — Testing

### Task 17.1: Unit Tests

| Subtask | Work Item                                                                                                             | Estimate |
| ------- | --------------------------------------------------------------------------------------------------------------------- | -------- |
| 17.1.1  | UI komponentlar unit testlari (Vitest + Testing Library): StatsCard, ChartWrapper, DataTable, NoticeCard, TeacherCard | 4h       |
| 17.1.2  | Zustand stores testlari: auth-store, dashboard-store, notification-store                                              | 2h       |
| 17.1.3  | Utility functions testlari                                                                                            | 2h       |

### Task 17.2: Integration Tests

| Subtask | Work Item                               | Estimate |
| ------- | --------------------------------------- | -------- |
| 17.2.1  | Auth flow: login → session → redirect   | 3h       |
| 17.2.2  | Admin dashboard data fetch (mocked API) | 2h       |
| 17.2.3  | Student form submission (add student)   | 2h       |

### Task 17.3: E2E Tests (Playwright)

| Subtask | Work Item                     | Estimate |
| ------- | ----------------------------- | -------- |
| 17.3.1  | Login + redirect flow         | 2h       |
| 17.3.2  | Admin dashboard ko'rish       | 2h       |
| 17.3.3  | Teacher attendance marking    | 3h       |
| 17.3.4  | Student assignment topshirish | 2h       |

---

### FAZA 17 Exit Gate

1. Unit/integration testlar pass.
2. E2E critical paths pass.

---

## FAZA 18 — SEO + Performance

### Task 18.1: SEO

| Subtask | Work Item                                                                                  | Estimate |
| ------- | ------------------------------------------------------------------------------------------ | -------- |
| 18.1.1  | `generateMetadata` barcha public sahifalarda: title, description, OpenGraph, canonical URL | 2h       |
| 18.1.2  | `sitemap.xml` generatsiya (Next.js `sitemap.ts`)                                           | 1h       |
| 18.1.3  | `robots.txt` — public/private routes                                                       | 0.5h     |

### Task 18.2: Performance

| Subtask | Work Item                                                                                                     | Estimate |
| ------- | ------------------------------------------------------------------------------------------------------------- | -------- |
| 18.2.1  | Next.js Image optimization — barcha avatar/rasm Next.js `<Image>` ga o'tkazish, `blur` placeholder            | 2h       |
| 18.2.2  | Code splitting — heavy componentlar (`dynamic(() => import(...), { ssr: false })`): chart componentlar, modal | 2h       |
| 18.2.3  | Bundle analysis (`@next/bundle-analyzer`), >100KB importlar optimallashtirish                                 | 2h       |
| 18.2.4  | Lighthouse audit ≥ 90 (Performance, Accessibility, SEO, Best Practices)                                       | 3h       |

---

### FAZA 18 Exit Gate

1. Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1.
2. Lighthouse performance ≥ 90.

---

## FAZA 19 — CI/CD + Production Deploy

### Task 19.1: GitHub Actions CI

| Subtask | Work Item                                                                                    | Estimate |
| ------- | -------------------------------------------------------------------------------------------- | -------- |
| 19.1.1  | `ci.yml` — lint, typecheck, unit tests, build (web + api)                                    | 3h       |
| 19.1.2  | `deploy.yml` — Docker build (web/api/worker), GHCR push (lowercase tag), Dokploy deploy hook | 3h       |
| 19.1.3  | Build artifact check: web `.next/BUILD_ID`, api `dist/main.js`                               | 1h       |

### Task 19.2: Dokploy Production Setup

| Subtask | Work Item                                                                                                                            | Estimate |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| 19.2.1  | 4 servis yaratish: `talimy-web`, `talimy-api`, `talimy-worker`, ixtiyoriy `talimy-platform`                                          | 3h       |
| 19.2.2  | Domain mapping: `talimy.space`, `www.talimy.space`, `*.talimy.space`, `api.talimy.space`, `platform.talimy.space`                    | 1.5h     |
| 19.2.3  | SSL/TLS (Let's Encrypt), wildcard + API + platform sertifikatlari                                                                    | 1h       |
| 19.2.4  | Env vars kiritish: web (`NEXT_PUBLIC_*`), api (DATABASE_URL, REDIS_URL, JWT, R2, RESEND, TWILIO, OPENROUTER, SENTRY, AXIOM, PERMIFY) | 1h       |

### Task 19.3: Monitoring

| Subtask | Work Item                                              | Estimate |
| ------- | ------------------------------------------------------ | -------- |
| 19.3.1  | Sentry frontend + backend (DSN wiring, test event)     | 2h       |
| 19.3.2  | Axiom structured logging (sample log → Axiom dataset)  | 2h       |
| 19.3.3  | Health check endpoints: `/health` (api), `/` (web)     | 1h       |
| 19.3.4  | Uptime monitoring (BetterUptime yoki Dokploy built-in) | 2h       |

### Task 19.4: Production Smoke Tests + Rollback

| Subtask | Work Item                                                                                                                                            | Estimate |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 19.4.1  | Smoke test script: `https://talimy.space`, `https://platform.talimy.space`, `https://api.talimy.space/health`, `https://[school].talimy.space/login` | 2h       |
| 19.4.2  | Rollback runbook: previous release → GHCR sha-tag re-deploy + DNS/SSL re-check                                                                       | 1h       |

---

### FAZA 19 Exit Gate

1. CI/CD pipeline ishlaydi.
2. Production deploy + smoke tests pass.
3. Monitoring aktiv (Sentry + Axiom).
4. Rollback runbook tekshirildi.

---

## 6. Implementation Notes (muhim qoidalar)

### UI/UX

- **Brand colors:** Navy `#0F1B2D`, Pink `#E879A0`, Sky `#7DD3FC`, White `#FFFFFF`.
- Har bir sahifada `<Skeleton>` loading state bo'lishi shart — API response kelmaguncha.
- Mobile responsive: `sm:` → `md:` → `lg:` → `xl:` breakpointlar.
- Sidebar: `lg:` da visible, kichikda hamburger menu.
- `<Image>` next/image component bilan, blur placeholder.

### Kod Sifati

- Komponent faqat bitta sahifada ishlatiladigan bo'lsa → shu sahifa papkasida (`components/` subfolder).
- 2+ sahifada ishlatiladigan komponent → `apps/web/src/components/shared/` yoki `packages/ui/`.
- Har bir page component server component (SSR) yoki client component aniq belgilansin (`"use client"` directive).
- TanStack Query `queryKey` konvensiyasi: `["entity", "action", params]` — masalan: `["admin", "dashboard", "stats"]`.

### API Wiring

- Barcha API call'lar `apps/web/src/lib/api.ts` orqali.
- tRPC routers mavjud bo'lsa — tRPC, aks holda REST `fetch`.
- Error boundary har bir page uchun.

### Permify / Gender Scope

- Har bir API request'da `genderScope` session'dan o'qiladi va query parameter sifatida yuboriladi.
- Backend Permify PDP external check — local filter emas.

### Performance

- `dynamic(() => import(...))` barcha chart komponentlar uchun (Recharts heavy).
- `refetchInterval: 60000` dashboard widgetlar uchun.

---

## 7. Weekly Reporting Template

1. Yakunlangan subtasklar (ID bo'yicha)
2. Bloklangan subtasklar + sabab + owner
3. Yangi xatarlar va mitigation
4. Keyingi hafta committment (ID'lar)

---

_Total fazalar: 19 | Taxminiy umumiy effort: ~500h_
_Canonical execution plan v4 — talimy.space_

## 8. Merge Notes (v5)

1. `docReja/old_Reja.md` was used as the detailed governance/tracking baseline.
2. Current `docReja/Reja.md` page-first execution structure was retained for later frontend phases.
3. FAZA 4 contextual component work is no longer described as `SKIPPED`; it is explicitly deferred into page implementation.
4. This file is now the canonical execution plan.
