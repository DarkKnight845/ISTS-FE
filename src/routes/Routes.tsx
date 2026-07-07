import { AgentDashboardPage, AnalyticsPage, ForgotPasswordPage, LoginPage, ManagerDashboardPage, StaffDashboardPage } from "./Lazyload";
import { Suspense, type JSX } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";

function AppRoutes(): JSX.Element {
  return (
    <Router>
      <Suspense fallback={<>Loading</>}>
        <Routes>
          <Route path='/' element={<Navigate to='/login' replace />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/forgot-password' element={<ForgotPasswordPage />} />

          <Route element={<DashboardLayout />}>
            <Route path='/staff-dash' element={<StaffDashboardPage />} />
            <Route path='/agent-dashboard' element={<AgentDashboardPage />} />
            <Route path='/manager-dashboard' element={<ManagerDashboardPage />} />
            <Route path='/analytics' element={<AnalyticsPage />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default AppRoutes;
