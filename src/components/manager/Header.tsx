import { Box, Avatar, Chip, Typography } from '@mui/material';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import NotificationBell from '@/components/NotificationBell';
import { BellIcon } from '@/components/icons';

function Header() {
  const { user } = useCurrentUser();

  const initials = user
    ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()
    : '·';

  const displayName = user?.fullName || 'Loading…';
  const department = user?.departmentName || 'IT Department';

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

        <NotificationBell icon={<BellIcon size={20} />} />

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
