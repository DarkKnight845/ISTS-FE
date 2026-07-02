import StaffDashboardPage from "@/pages/MainPages/staffDashboard";
import {ForgotPasswordPage, LoginPage} from "./Lazyload";
import { Suspense, type JSX } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";

function AppRoutes(): JSX.Element {
  return (
    <Router>
      <Suspense fallback={<>Loading</>}>
        <Routes>  
            <Route path='/' element={<Navigate to='/login' replace />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path="/forgot-password" element={< ForgotPasswordPage />}/>
            <Route path="/staff-dash" element={< StaffDashboardPage/>}/>

        </Routes>
      </Suspense>
    </Router>
  );
}

export default AppRoutes;
