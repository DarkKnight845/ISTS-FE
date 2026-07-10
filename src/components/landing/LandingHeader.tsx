import { Box, Container } from '@mui/material';
import { istsIcon } from '@/assets/img';
import ThemeToggle from './ThemeToggle';

function LandingHeader() {
  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(12px)',
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 2,
          }}
        >
          <Box
            component="img"
            src={istsIcon}
            alt="ISTS Logo"
            sx={{ height: 48, width: 'auto', display: 'block' }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ThemeToggle />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default LandingHeader;
