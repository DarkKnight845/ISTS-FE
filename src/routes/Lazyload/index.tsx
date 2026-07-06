import { lazy } from "react";

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const  LoginPage = lazy(() => import("@/pages/Auth/LoginPage/index"));

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const AgentDashboardPage = lazy(() => import("@/pages/AgentDashboardPage"));
