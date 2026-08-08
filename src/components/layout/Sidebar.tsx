import { Box, List, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import { istsIcon } from '@/assets/img';
import { useAuth } from '@/context/AuthContext';
import { DashboardIcon, TicketIcon, AnalyticsIcon, ClockIcon } from '@/components/icons';

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
    items.push({ label: 'SLA Rules', path: '/sla-settings', icon: <ClockIcon color="currentColor" /> });
  }

  if (role === 'admin') {
    items.push({ label: 'SLA Rules', path: '/sla-settings', icon: <ClockIcon color="currentColor" /> });
  }

  return items;
}

const SIDEBAR_WIDTH = 260;

function Sidebar() {
  const { role } = useAuth();
  const location = useLocation();
  const navItems = getNavItems(role);

  return (
    <>
      <Box sx={{ width: SIDEBAR_WIDTH, flexShrink: 0 }} />

      <Box
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          backgroundColor: 'nav.main',
          color: 'nav.contrastText',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          overflowY: 'auto',
          borderRight: '1px solid',
          borderColor: 'rgba(255,255,255,0.08)',
        }}
      >
        <Box sx={{ px: 3, py: 3.5, mb: 1 }}>
          <Box
            component="img"
            src={istsIcon}
            alt="ISTS Logo"
            sx={{ height: 46, width: 'auto', display: 'block', filter: 'brightness(0) invert(1)' }}
          />
        </Box>

        <List sx={{ flexGrow: 1, overflowY: 'auto', px: 2, py: 0 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Tooltip key={item.path} title={item.label} placement="right" arrow>
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  sx={{
                    borderRadius: '10px',
                    mb: 0.75,
                    px: 1.5,
                    py: 1.25,
                    color: isActive ? 'nav.contrastText' : 'rgba(255,255,255,0.65)',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all 0.18s ease',
                    position: 'relative',
                    '&:hover': {
                      backgroundColor: isActive ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.08)',
                      color: 'nav.contrastText',
                    },
                    '&::before': isActive
                      ? {
                          content: '""',
                          position: 'absolute',
                          left: -8,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 3,
                          height: 22,
                          borderRadius: '0 4px 4px 0',
                          backgroundColor: 'primary.main',
                        }
                      : {},
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
              </Tooltip>
            );
          })}
        </List>

        <Box sx={{ px: 3, py: 2 }}>
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderRadius: '10px',
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid',
              borderColor: 'rgba(255,255,255,0.08)',
            }}
          >
            <Box sx={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', mb: 0.25 }}>ISTS Version</Box>
            <Box sx={{ fontSize: 13, fontWeight: 600, color: 'nav.contrastText' }}>1.0.0</Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Sidebar;
