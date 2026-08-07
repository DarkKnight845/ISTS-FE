import { useState } from 'react';
import { Box, IconButton, Avatar, Chip, Typography, Badge, Menu, MenuItem, CircularProgress } from '@mui/material';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNotifications } from '@/hooks/useNotifications';
import { BellIcon } from '@/components/icons';

/**
 * Global top bar with profile, department badge, and notifications dropdown.
 */
function Header() {
  const { user } = useCurrentUser();
  const { notifications, unreadCount, loading, markAsRead } = useNotifications();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const initials = user
    ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()
    : '·';

  const displayName = user?.fullName || 'Loading…';
  const department = user?.departmentName || 'IT Department';

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkRead = async (id: string) => {
    await markAsRead(id);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        px: 4,
        py: 2,
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        minHeight: 72,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          label={department}
          sx={{
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            fontWeight: 500,
            fontSize: 12,
            borderRadius: '20px',
            px: 0.5,
          }}
        />

        <IconButton
          onClick={handleOpen}
          sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '10px', color: 'text.secondary' }}
        >
          <Badge badgeContent={unreadCount} color="error" overlap="circular">
            <BellIcon size={20} />
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
                backgroundColor: 'background.paper',
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
              <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>
                No notifications yet.
              </Typography>
            </Box>
          ) : (
            notifications.map((n) => (
              <MenuItem
                key={n.id}
                onClick={() => {
                  if (!n.isRead) handleMarkRead(n.id);
                  handleClose();
                }}
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

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            pl: 1,
            pr: 1.5,
            py: 0.5,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '24px',
            backgroundColor: 'background.paper',
          }}
        >
          <Avatar sx={{ width: 28, height: 28, fontSize: 12, backgroundColor: 'warning.main' }}>
            {initials}
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
            {displayName}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Header;
