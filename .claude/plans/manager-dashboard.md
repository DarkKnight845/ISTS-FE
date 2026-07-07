# Manager Dashboard Implementation Plan

## Goal
Build the manager dashboard flow shown in the screenshots, including stats, table, detail drawer, reassign flow, and SLA breaches modal.

## Decisions from user
- Route: `/manager-dashboard` (separate route, no default redirect change).
- Data: hard-coded mock tickets and agents.
- Row actions: full reassign flow with modal + success confirmation.

## File changes

### 1. Routing
- `src/routes/Lazyload/index.tsx` — add `ManagerDashboardPage` lazy export.
- `src/routes/Routes.tsx` — add `/manager-dashboard` route.

### 2. Mock data (new file: `src/data/mockManagerTickets.ts`)
- Manager ticket schema with: id, subject, requester name + avatar, status, priority, assigned agent, updatedAt, createdAt, description, breach info.
- Agent list for reassign modal.

### 3. Shared UI components
- Reuse existing `StatCard` from `src/components/ui/Cards/StatCard.tsx` if compatible; otherwise create `src/components/ui/Cards/ManagerStatCard.tsx`.
- Create or adapt sidebar/header patterns.

### 4. Manager-specific components
- `src/components/manager/Sidebar.tsx` — blue sidebar with ISTS logo, Dashboard, Manager Dashboard (active), Analytics.
- `src/components/manager/Header.tsx` — top bar with title, date picker, IT Department badge, notification bell, Dept. Head profile chip.
- `src/components/manager/StatsGrid.tsx` — five KPI cards in CSS grid.
- `src/components/manager/FilterBar.tsx` — All | Active | Ongoing | Resolved | Unassigned pill tabs + search + filter icon.
- `src/components/manager/ManagerTable.tsx` — table with checkbox, user avatar+name, ID & Subject, Status, Priority, Assigned, Time Updated, Actions.
- `src/components/manager/TicketDetailDrawer.tsx` — right-side panel with ticket info, chat/empty state, Reassign + Resolve buttons.
- `src/components/manager/ReassignModal.tsx` — list of agents with radio/select, Continue button.
- `src/components/manager/ReassignSuccessModal.tsx` — confirmation message.
- `src/components/manager/SlaBreachesModal.tsx` — list of overdue tickets with Reassign buttons.

### 5. Page shell
- `src/pages/ManagerDashboardPage.tsx` — compose Sidebar, Header, StatsGrid, FilterBar, ManagerTable, modals, and drawer.

### 6. Interactions
- Click table row → open detail drawer.
- Click Reassign in drawer → open ReassignModal.
- Select agent + Continue → show ReassignSuccessModal.
- Close success modal → update assigned agent in local state, drawer reflects new agent.
- SLA breaches card/area → open SlaBreachesModal.

## Component tree
```
ManagerDashboardPage
├── Sidebar
├── Header
└── Main content
    ├── StatsGrid
    ├── FilterBar
    ├── ManagerTable
    ├── TicketDetailDrawer
    ├── ReassignModal
    ├── ReassignSuccessModal
    └── SlaBreachesModal
```

## Verification
- `npx tsc --noEmit` passes.
- `npm run build` succeeds.
- `/manager-dashboard` renders and supports row click, reassign flow, and SLA modal.
