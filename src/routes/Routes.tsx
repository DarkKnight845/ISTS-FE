import { AgentDashboardPage, LoginPage } from "./Lazyload";
import { Suspense, type JSX } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";

function AppRoutes(): JSX.Element {
  return (
    <Router>
      <Suspense fallback={<>Loading</>}>
        <Routes>
          <Route path='/' element={<Navigate to='/agent-dashboard' replace />} />
          <Route path='/agent-dashboard' element={<AgentDashboardPage />} />
          <Route path='/login' element={<LoginPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default AppRoutes;
