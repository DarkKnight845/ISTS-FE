import {
  AgentDashboardPage,
  AnalyticsPage,
  ForgotPasswordPage,
  LandingPage,
  LoginPage,
  ManagerDashboardPage,
  SLASettingsPage,
  StaffDashboardPage,
  TicketDetailPage,
} from "./Lazyload";
import { Suspense, type JSX } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth, type UserRole } from "@/context/AuthContext";

function RequireRole({
  children,
  allowedRoles,
}: {
  children: JSX.Element;
  allowedRoles: UserRole[];
}): JSX.Element {
  const { role, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

function AppRoutes(): JSX.Element {
  return (
    <Router>
      <Suspense fallback={<>Loading</>}>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/forgot-password' element={<ForgotPasswordPage />} />

          <Route element={<DashboardLayout />}>
            <Route
              path='/staff-dash'
              element={
                <RequireRole allowedRoles={["staff", "agent", "manager", "admin"]}>
                  <StaffDashboardPage />
                </RequireRole>
              }
            />
            <Route
              path='/agent-dashboard'
              element={
                <RequireRole allowedRoles={["agent", "manager", "admin"]}>
                  <AgentDashboardPage />
                </RequireRole>
              }
            />
            <Route
              path='/manager-dashboard'
              element={
                <RequireRole allowedRoles={["manager", "admin"]}>
                  <ManagerDashboardPage />
                </RequireRole>
              }
            />
            <Route
              path='/analytics'
              element={
                <RequireRole allowedRoles={["manager", "admin"]}>
                  <AnalyticsPage />
                </RequireRole>
              }
            />
            <Route
              path='/sla-settings'
              element={
                <RequireRole allowedRoles={["manager", "admin"]}>
                  <SLASettingsPage />
                </RequireRole>
              }
            />
            <Route
              path='/tickets/:ticketId'
              element={
                <RequireRole allowedRoles={["staff", "agent", "manager", "admin"]}>
                  <TicketDetailPage />
                </RequireRole>
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default AppRoutes;
