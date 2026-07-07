# Plan: Unify Icons and Add Dark Mode

## Goal
1. Use the staff-dashboard SVG icon style across all dashboards (agent, manager, header, drawer, sidebar) for visual uniformity.
2. Add a light/dark mode toggle that works across the whole application.

## Current State
- **Icons are duplicated/scattered**: inline SVGs in `Sidebar.tsx`, `Header.tsx`, `AgentDashboardPage.tsx`, `ManagerDashboardPage.tsx`, `StatsCardGrid.tsx`, `StatsGrid.tsx`, `TicketDetailDrawer.tsx`, plus imported SVG assets in `staffDashboard.tsx`.
- **No theme system**: `App.tsx` only wraps `AuthProvider`; there is no `ThemeProvider`. Colors are hard-coded hex values in almost every component.
- **MUI v9 + React 19 + Vite**: dark mode should be implemented via MUI `ThemeProvider` + `createTheme` and a small context for the toggle.

## Approach

### 1. Central icon library
Create `src/components/icons/index.tsx` (or `src/icons/index.tsx`) that exports reusable icon components:
- `TicketIcon`, `TicketTagIcon`, `CalendarIcon`, `BellIcon`, `DashboardIcon`, `AnalyticsIcon`, `CheckIcon`, `WarningIcon`, `CloseIcon`, `MoreIcon`, `AttachmentIcon`, `SendIcon`, `RatingIcon`, `SlaBreachIcon`, `SlaComplianceIcon`, etc.
- Accept `size`, `color`, and optional `bgColor` props so the same icon can be tinted for stat-card badges, dark mode, etc.
- Re-export/import the existing SVG assets (`ion_ticket_stat.svg`, `ion_ticket_orange.svg`, `ion_ticket_green.svg`, `ion_ticket_red.svg`) as components where appropriate.

Then replace every inline SVG in:
- `src/components/layout/Sidebar.tsx`
- `src/components/Header.tsx`
- `src/pages/AgentDashboardPage.tsx`
- `src/pages/ManagerDashboardPage.tsx`
- `src/components/StatsCardGrid.tsx`
- `src/components/manager/StatsGrid.tsx`
- `src/components/TicketDetailDrawer.tsx`
- `src/components/ui/DahboardHeader.tsx`
- `src/components/ui/Nabvar/StaffNavbar.tsx`
- any other one-off inline icons

### 2. Dark mode architecture
Add `src/context/ThemeContext.tsx`:
- Holds `mode: 'light' | 'dark'`.
- Persists choice to `localStorage`.
- Provides `toggleMode()`.

Wrap the app in `src/App.tsx` with MUI `ThemeProvider` + `CssBaseline`:
- Create `src/theme.ts` exporting `getTheme(mode)` using `createTheme`.
- Set `palette.mode` and custom primary/background/text tokens.
- Use CSS variables or `theme.palette` consistently.

Add a toggle:
- Place a dark-mode switch in the global header area (e.g., `Header.tsx` for agent/manager, `StaffNavbar.tsx` for staff, or in `Sidebar.tsx` footer so it is always visible).
- Preferred location: `Sidebar.tsx` footer because it is shared by all dashboard roles via `DashboardLayout`.

### 3. Replace hard-coded colors with theme tokens
Update the most visible shared surfaces first:
- `DashboardLayout.tsx` background (`#fff` → `theme.palette.background.default`).
- `Sidebar.tsx` background (`#2559AA` → keep as primary but derive from theme; text colors via `theme.palette.primary.contrastText`).
- `Header.tsx` / `StaffNavbar.tsx` background, borders, text.
- `StatCard.tsx` background, border, text.
- `StatsCardGrid.tsx` / `StatsGrid.tsx` icon backgrounds and text.
- `TicketDetailDrawer.tsx` background, bubbles, borders.
- Tables and filter bars.
- Login/Auth pages (optional, lower priority).

Where components currently use raw hex strings, replace with `theme.palette...` accessed via `useTheme()` or sx callback `({ theme }) => ...`.

### 4. Files to touch
| Area | Files |
|------|-------|
| Theme | `src/theme.ts` (new), `src/context/ThemeContext.tsx` (new), `src/App.tsx`, `src/main.tsx` |
| Icons | `src/components/icons/index.tsx` (new), then all files listed above |
| Layout | `src/components/layout/DashboardLayout.tsx`, `src/components/layout/Sidebar.tsx` |
| Headers | `src/components/Header.tsx`, `src/components/ui/Nabvar/StaffNavbar.tsx`, `src/components/ui/DahboardHeader.tsx` |
| Stats | `src/components/ui/Cards/StatCard.tsx`, `src/components/StatsCardGrid.tsx`, `src/components/manager/StatsGrid.tsx` |
| Pages | `src/pages/MainPages/staffDashboard.tsx`, `src/pages/AgentDashboardPage.tsx`, `src/pages/ManagerDashboardPage.tsx`, `src/pages/AnalyticsPage.tsx` |
| Drawer | `src/components/TicketDetailDrawer.tsx`, `src/components/manager/TicketDetailDrawer.tsx` |

## Open Questions
1. Do you want the dark-mode toggle in the **sidebar footer** (visible on every dashboard) or in each dashboard's own header/navbar?
2. Should the login/auth pages also switch to dark mode, or only the dashboards?
3. The staff stat-card icons (`ion_ticket_stat.svg` etc.) are blue/orange/green/red ticket images. Do you want every dashboard stat card to use those exact ticket images, or keep role-specific meanings (e.g., manager still shows SLA breach warning icon) but rendered in the same line-art style?

## Recommended order
1. Build the icon library and replace inline SVGs (no visual change, just standardization).
2. Add `ThemeContext` and `ThemeProvider` with a default light theme; verify nothing breaks.
3. Add the toggle UI and persist to `localStorage`.
4. Convert shared surfaces (layout, sidebar, headers, stat cards, drawer) to theme tokens for dark mode.
5. Audit remaining pages/components for hard-coded colors and update them.
6. Run `npx tsc --noEmit` and manual browser pass in both modes.
