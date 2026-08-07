import { Box } from '@mui/material';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { TicketDrawerProvider } from '@/context/TicketDrawerContext';
import Sidebar from './Sidebar';
import TicketDrawerHost from './TicketDrawerHost';

function DashboardLayout() {
  const { role, isAuthenticated } = useAuth();

  if (!isAuthenticated || !role) {
    return <Navigate to="/login" replace />;
  }

  return (
    <TicketDrawerProvider>
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Sidebar />

        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <Outlet />
        </Box>
      </Box>
      <TicketDrawerHost />
    </TicketDrawerProvider>
  );
}

export default DashboardLayout;