import { Box, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import { istsIcon } from '@/assets/img';
import { useAuth } from '@/context/AuthContext';
import { DashboardIcon, TicketIcon, AnalyticsIcon } from '@/components/icons';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

function getNavItems(role: string | null): NavItem[] {
  const items: NavItem[] = [{ label: 'Staff Dashboard', path: '/staff-dash', icon: <DashboardIcon color="currentColor" /> }];

  if (role === 'agent') {
    items.push({ label: 'Agent Dashboard', path: '/agent-dashboard', icon: <TicketIcon color="currentColor" /> });
  }

  if (role === 'manager') {
    items.push({ label: 'Manager Dashboard', path: '/manager-dashboard', icon: <TicketIcon color="currentColor" /> });
    items.push({ label: 'Analytics', path: '/analytics', icon: <AnalyticsIcon color="currentColor" /> });
  }

  return items;
}

function Sidebar() {
  const { role } = useAuth();
  const location = useLocation();
  const navItems = getNavItems(role);

  return (
    <>
      <Box sx={{ width: 260, flexShrink: 0 }} />

      <Box
        sx={{
          width: 260,
          flexShrink: 0,
          px: 2,
          py: 3,
          backgroundColor: 'primary.main',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          overflowY: 'auto',
        }}
      >
        <Box sx={{ mb: 4, px: 1 }}>
          <Box
            component="img"
            src={istsIcon}
            alt="ISTS Logo"
            sx={{ height: 50, width: 'auto', display: 'block' }}
          />
        </Box>

        <List sx={{ flexGrow: 1, overflowY: 'auto', px: 0 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItemButton
                key={item.path}
                component={NavLink}
                to={item.path}
                sx={{
                  borderRadius: '8px',
                  mb: 1,
                  px: 1.5,
                  py: 1,
                  color: isActive ? 'primary.contrastText' : 'rgba(255,255,255,0.85)',
                  backgroundColor: isActive ? 'primary.dark' : 'transparent',
                  textDecoration: 'none',
                  '&:hover': {
                    backgroundColor: isActive ? 'primary.dark' : 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: { sx: { fontSize: 14, fontWeight: isActive ? 600 : 500 } },
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>
    </>
  );
}

export default Sidebar;