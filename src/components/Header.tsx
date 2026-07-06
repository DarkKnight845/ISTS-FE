import { Box, IconButton, Avatar, Chip, Typography } from '@mui/material';

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18.5 16V11C18.5 7.93 16.86 5.36 14 4.68V4C14 3.17 13.33 2.5 12.5 2.5C11.67 2.5 11 3.17 11 4V4.68C8.14 5.36 6.5 7.92 6.5 11V16L4 18.5V19.5H21V18.5L18.5 16Z"
      fill="#64748B"
    />
  </svg>
);

/**
 * Global top bar with profile, department badge, and notifications only.
 * The page title and date picker live in the main content area.
 */
function Header() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        px: 4,
        py: 2,
        backgroundColor: '#fff',
        borderBottom: '1px solid #E5E7EB',
        minHeight: 72,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          label="IT Department"
          sx={{
            backgroundColor: '#2559AA',
            color: '#fff',
            fontWeight: 500,
            fontSize: 12,
            borderRadius: '20px',
            px: 0.5,
          }}
        />

        <IconButton sx={{ border: '1px solid #E5E7EB', borderRadius: '10px' }}>
          <BellIcon />
        </IconButton>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            pl: 1,
            pr: 1.5,
            py: 0.5,
            border: '1px solid #E5E7EB',
            borderRadius: '24px',
            backgroundColor: '#fff',
          }}
        >
          <Avatar sx={{ width: 28, height: 28, fontSize: 12, backgroundColor: '#F59E0B' }}>A</Avatar>
          <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151' }}>
            Agent
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Header;
