import { lazy } from "react";

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const LoginPage = lazy(() => import("@/pages/Auth/LoginPage/index"));
export const ForgotPasswordPage = lazy(() => import("@/pages/Auth/ForgetPassword/sections/ForgetPasswordForm"));

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const AgentDashboardPage = lazy(() => import("@/pages/AgentDashboardPage"));
export const StaffDashboardPage = lazy(() => import("@/pages/MainPages/staffDashboard"));
export const ManagerDashboardPage = lazy(() => import("@/pages/ManagerDashboardPage"));
export const AnalyticsPage = lazy(() => import("@/pages/AnalyticsPage"));
export const SLASettingsPage = lazy(() => import("@/pages/SLASettingsPage"));
export const LandingPage = lazy(() => import("@/pages/LandingPage"));
export const TicketDetailPage = lazy(() => import("@/pages/TicketDetailPage"));
