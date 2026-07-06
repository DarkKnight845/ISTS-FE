import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { istsIcon } from '@/assets/img';

// Inline lightweight SVG icons so we don't need @mui/icons-material.
const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor" />
    <rect x="13" y="3" width="8" height="8" rx="2" fill="currentColor" />
    <rect x="3" y="13" width="8" height="8" rx="2" fill="currentColor" />
    <rect x="13" y="13" width="8" height="8" rx="2" fill="currentColor" />
  </svg>
);

const TicketIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M2 9V15C2 17 3 18 5 18H19C21 18 22 17 22 15V9C22 7 21 6 19 6H5C3 6 2 7 2 9Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M6 6V4M18 6V4M9 14H15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

interface NavItemProps {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

function NavItem({ label, icon, active }: NavItemProps) {
  return (
    <ListItemButton
      sx={{
        borderRadius: '8px',
        mb: 1,
        px: 1.5,
        py: 1,
        color: active ? '#fff' : 'rgba(255,255,255,0.85)',
        backgroundColor: active ? '#1a4ba0' : 'transparent',
        '&:hover': {
          backgroundColor: active ? '#1a4ba0' : 'rgba(255,255,255,0.1)',
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>{icon}</ListItemIcon>
      <ListItemText
        primary={label}
        slotProps={{
          primary: { sx: { fontSize: 14, fontWeight: active ? 600 : 500 } },
        }}
      />
    </ListItemButton>
  );
}

/**
 * Sidebar navigation for the agent dashboard.
 */
function Sidebar() {
  return (
    <Box
      sx={{
        width: 260,
        flexShrink: 0,
        px: 2,
        py: 3,
        backgroundColor: '#2559AA',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
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
        <NavItem label="Dashboard" icon={<DashboardIcon />} />
        <NavItem label="Agent Dashboard" icon={<TicketIcon />} active />
      </List>

      <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
          Agent Portal v1.0
        </Typography>
      </Box>
    </Box>
  );
}

export default Sidebar;
