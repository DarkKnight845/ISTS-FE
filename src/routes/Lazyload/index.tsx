import { lazy } from "react";

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const  LoginPage = lazy(() => import("@/pages/Auth/LoginPage/index"));
export const ForgotPasswordPage = lazy(() => import("@/pages/Auth/ForgetPassword/sections/ForgetPasswordForm"));
export const  staffDasboardPage = lazy(() => import("@/pages/MainPages/staffDashboard"));