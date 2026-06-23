import {LoginPage} from "./Lazyload";
import { Suspense, type JSX } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";

function AppRoutes(): JSX.Element {
  return (
    <Router>
      <Suspense fallback={<>Loading</>}>
        <Routes>  
            <Route path='/' element={<Navigate to='/login' replace />} />
            <Route path='/login' element={<LoginPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default AppRoutes;
