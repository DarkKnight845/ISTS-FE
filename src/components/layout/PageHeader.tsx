import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Box,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Switch,
  Typography,
} from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { useThemeMode } from '@/context/ThemeContext';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNotifications } from '@/hooks/useNotifications';
import { useSignalR } from '@/hooks/useSignalR';
import { useTicketDrawer } from '@/context/TicketDrawerContext';
import type { NotificationDto } from '@/lib/api';
import { BellIcon, LogoutIcon, MoonIcon, SunIcon } from '@/components/icons';

interface PageHeaderProps {
  showDepartmentChip?: boolean;
}

function PageHeader({ showDepartmentChip = false }: PageHeaderProps) {
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const { logout } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    removeNotification,
    addNotification,
  } = useNotifications();
  const { openTicket } = useTicketDrawer();
  const { notificationConnection } = useSignalR();

  useEffect(() => {
    if (!notificationConnection) return;
    const handler = (notification: NotificationDto) => addNotification(notification);
    notificationConnection.on('Notification', handler);
    return () => {
      notificationConnection.off('Notification', handler);
    };
  }, [notificationConnection, addNotification]);

  const handleNotificationClick = async (notification: NotificationDto) => {
    try {
      await markAsRead(notification.id);
    } finally {
      removeNotification(notification.id);
    }
    handleNotifClose();
    if (notification.ticketId) openTicket(notification.ticketId);
  };

  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);

  const initials = user
    ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()
    : '·';

  const displayName = user?.fullName || 'Loading…';
  const department = user?.departmentName || 'IT Department';

  const handleNotifOpen = (e: React.MouseEvent<HTMLElement>) => setNotifAnchorEl(e.currentTarget);
  const handleNotifClose = () => setNotifAnchorEl(null);
  const handleProfileOpen = (e: React.MouseEvent<HTMLElement>) => setProfileAnchorEl(e.currentTarget);
  const handleProfileClose = () => setProfileAnchorEl(null);

  const handleLogout = () => {
    setProfileAnchorEl(null);
    logout();
    navigate('/login');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 4,
        py: 2.5,
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        minHeight: 72,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {showDepartmentChip && (
          <Chip
            label={department}
            size="small"
            sx={{
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              fontWeight: 600,
              fontSize: 12,
              borderRadius: '20px',
              px: 0.5,
            }}
          />
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <IconButton
          onClick={handleNotifOpen}
          sx={{
            width: 40,
            height: 40,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '10px',
            color: 'text.secondary',
            backgroundColor: 'background.paper',
            '&:hover': { backgroundColor: 'action.hover' },
          }}
          aria-label="Notifications"
        >
          <Badge badgeContent={unreadCount} color="error" overlap="circular">
            <BellIcon size={20} />
          </Badge>
        </IconButton>

        <Menu
          anchorEl={notifAnchorEl}
          open={Boolean(notifAnchorEl)}
          onClose={handleNotifClose}
          slotProps={{
            paper: {
              sx: {
                width: 360,
                maxHeight: 420,
                borderRadius: '12px',
                mt: 1,
                backgroundColor: 'background.paper',
                boxShadow: 4,
              },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography sx={{ fontWeight: 600, fontSize: 14, color: 'text.primary' }}>
              Notifications
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={20} sx={{ color: 'primary.main' }} />
            </Box>
          ) : !notifications?.length ? (
            <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
              <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>No notifications yet.</Typography>
            </Box>
          ) : (
            notifications.map((n) => (
              <MenuItem
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                sx={{
                  px: 2,
                  py: 1.5,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: n.isRead ? 'transparent' : 'action.hover',
                  whiteSpace: 'normal',
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography
                      sx={{
                        fontWeight: n.isRead ? 500 : 600,
                        fontSize: 13,
                        color: 'text.primary',
                      }}
                    >
                      {n.title}
                    </Typography>
                    {!n.isRead && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: 'primary.main',
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </Box>
                  <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>{n.message}</Typography>
                  <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>
                    {new Date(n.createdAt).toLocaleString()}
                  </Typography>
                </Box>
              </MenuItem>
            ))
          )}
        </Menu>

        <Box
          onClick={handleProfileOpen}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleProfileOpen(e as unknown as React.MouseEvent<HTMLElement>);
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            pl: 1,
            pr: 1.5,
            py: 0.5,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '24px',
            backgroundColor: 'background.paper',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
            '&:hover': { backgroundColor: 'action.hover' },
            '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
          }}
        >
          <Avatar sx={{ width: 30, height: 30, fontSize: 12, backgroundColor: 'warning.main', color: '#fff' }}>
            {initials}
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: 13 }}>
            {displayName}
          </Typography>
        </Box>

        <Menu
          anchorEl={profileAnchorEl}
          open={Boolean(profileAnchorEl)}
          onClose={handleProfileClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{
            paper: {
              sx: {
                width: 240,
                mt: 1,
                borderRadius: '12px',
                backgroundColor: 'background.paper',
                boxShadow: 4,
              },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography sx={{ fontWeight: 600, fontSize: 14, color: 'text.primary' }}>{displayName}</Typography>
            {user?.email && (
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.25 }}>{user.email}</Typography>
            )}
          </Box>

          <Divider />

          <MenuItem
            onClick={toggleMode}
            sx={{ py: 1.25, gap: 1.5 }}
          >
            <ListItemIcon sx={{ minWidth: 'auto', color: 'text.secondary' }}>
              {mode === 'light' ? <MoonIcon size={18} /> : <SunIcon size={18} />}
            </ListItemIcon>
            <ListItemText
              slotProps={{ primary: { sx: { fontSize: 14, fontWeight: 500, color: 'text.primary' } } }}
            >
              {mode === 'light' ? 'Dark mode' : 'Light mode'}
            </ListItemText>
            <Switch
              size="small"
              checked={mode === 'dark'}
              onChange={(e) => {
                e.stopPropagation();
                if ((e.target.checked && mode === 'light') || (!e.target.checked && mode === 'dark')) {
                  toggleMode();
                }
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </MenuItem>

          <Divider />

          <MenuItem
            onClick={handleLogout}
            sx={{ py: 1.25, gap: 1.5 }}
          >
            <ListItemIcon sx={{ minWidth: 'auto', color: 'error.main' }}>
              <LogoutIcon size={18} />
            </ListItemIcon>
            <ListItemText
              slotProps={{ primary: { sx: { fontSize: 14, fontWeight: 600, color: 'error.main' } } }}
            >
              Logout
            </ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}

export default PageHeader;
