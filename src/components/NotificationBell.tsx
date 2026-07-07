import { useState } from 'react';
import { Badge, IconButton, Menu, MenuItem, Typography, Box, CircularProgress, useTheme } from '@mui/material';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationBellProps {
  icon: React.ReactNode;
}

function NotificationBell({ icon }: NotificationBellProps) {
  const theme = useTheme();
  const { notifications, unreadCount, loading, markAsRead } = useNotifications();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = async (id: string) => {
    await markAsRead(id);
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleOpen} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: '10px', color: 'text.secondary' }}>
        <Badge badgeContent={unreadCount} color="error" overlap="circular">
          {icon}
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              width: 360,
              maxHeight: 420,
              borderRadius: '12px',
              mt: 1,
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
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
            <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>
              No notifications yet.
            </Typography>
          </Box>
        ) : (
          notifications.map((n) => (
            <MenuItem
              key={n.id}
              onClick={() => handleClick(n.id)}
              sx={{
                px: 2,
                py: 1.5,
                borderBottom: `1px solid ${theme.palette.divider}`,
                backgroundColor: n.isRead ? 'background.paper' : theme.palette.action.hover,
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
                <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>
                  {n.message}
                </Typography>
                <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>
                  {new Date(n.createdAt).toLocaleString()}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
}

export default NotificationBell;
