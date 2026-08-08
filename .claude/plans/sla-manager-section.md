# Manager SLA Rules Section Implementation Plan

## Goal
Add a manager-only section where managers (and admins) can view and configure per-department SLA rules using the existing backend SLA endpoints.

## Backend capability (already implemented)
- `POST /api/sla` — create one or more priority SLA rules for a department. `ManagerOrAdmin` only.
- `GET /api/sla/{departmentId:guid}` — retrieve all SLA rules for a department. `ManagerOrAdmin` only.
- `PATCH /api/sla` — update existing SLA rules (requires a full set of priorities). `ManagerOrAdmin` only.
- DTO shape: `DepartmentId`, `Priorities[]` where each priority has `Priority`, `ResponseTimeMinutes`, `ResolutionTimeMinutes`.
- Validation: response > 0, resolution > 0, resolution >= response.

## Frontend gap
No SLA management API functions or UI exist. The frontend only consumes SLA breach data via `/api/Tickets/breached`.

## Decisions
- Route: `/sla-settings` (flat route consistent with `/analytics`, `/manager-dashboard`).
- Sidebar: add "SLA Rules" nav item visible to `manager` and `admin`.
- Page: new `SLASettingsPage` shell with a department selector and a priority-rule editor.
- Department scope: use `getDepartmentsRequest()` to populate the selector. Default the manager's own department (`currentUser.departmentId`) when available.
- Editor: show one row per priority (Low, Medium, High, Urgent). Each row has response time and resolution time in minutes.
  - If rules exist for the department, pre-fill all four rows from the backend and PATCH on save.
  - If no rules exist, POST on save.
  - Because PATCH requires a full set, we always submit all four priorities.
- Validation: client-side checks mirror backend rules (positive integers, resolution >= response).

## File changes

### 1. API layer (`src/lib/api.ts`)
Add SLA types and request helpers:
- `SLAPriority` type (`priority`, `responseTimeMinutes`, `resolutionTimeMinutes`).
- `SLARule` response item (`id`, `departmentId`, `priority`, `responseTimeMinutes`, `resolutionTimeMinutes`, `createdAt`, `updatedAt`).
- `getSLAByDepartmentRequest(departmentId)` → `GET /api/sla/{departmentId}`.
- `createSLARequest(payload)` → `POST /api/sla`.
- `updateSLARequest(payload)` → `PATCH /api/sla`.
- Invalidate relevant cache keys after mutations.

### 2. Routing
- `src/routes/Lazyload/index.tsx` — add `SLASettingsPage` lazy export.
- `src/routes/Routes.tsx` — add `/sla-settings` route under `DashboardLayout`, restricted to `manager` and `admin`.

### 3. Navigation
- `src/components/layout/Sidebar.tsx` — add "SLA Rules" nav item for `manager` and `admin` with a settings/clock icon.

### 4. New page
- `src/pages/SLASettingsPage.tsx` — page shell.
  - Header with title and description.
  - Department selector (Autocomplete/Dropdown) using `getDepartmentsRequest()`.
  - Default to current user's department if available.
  - Loading and error states.
  - Renders `SLARuleEditor`.

### 5. New manager component
- `src/components/manager/SLARuleEditor.tsx` — the rule editor.
  - Table with rows for Low, Medium, High, Urgent.
  - Columns: Priority, Response time (min), Resolution time (min).
  - Inputs are numeric TextFields.
  - Save button triggers validation, then `create` or `update` based on existing rules.
  - Success/error feedback inline.

### 6. Optional reusable hook
- `src/hooks/useSLA.ts` — load and mutate SLA rules for a department (similar pattern to `useDepartmentsRequest` direct calls in `staffDashboard.tsx`).
  - Keeps the page component focused on UI state.

## Component tree
```
DashboardLayout
├── Sidebar (adds "SLA Rules" nav item)
└── SLASettingsPage
    ├── PageHeader / title
    ├── DepartmentSelector
    └── SLARuleEditor
        ├── Loading skeleton / spinner
        ├── Rule table
        └── Save button + alerts
```

## Verification
- `npx tsc --noEmit` passes.
- `npm run build` succeeds.
- Manager/admin users see "SLA Rules" in the sidebar.
- Navigating to `/sla-settings` loads the department selector and rule editor.
- Selecting a department fetches existing rules and fills the table.
- Saving valid rules calls the correct backend endpoint and shows success feedback.
- Invalid input (e.g., resolution < response) is blocked with a clear error before calling the backend.
