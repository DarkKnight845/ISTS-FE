import { Box, Container, Typography } from '@mui/material';

function FinalCTA() {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #172554 0%, #0F172A 100%)'
            : 'linear-gradient(135deg, #2559AA 0%, #1e4890 100%)',
        color: '#fff',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          backgroundColor: '#fff',
          opacity: 0.06,
          filter: 'blur(80px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          backgroundColor: '#fff',
          opacity: 0.06,
          filter: 'blur(80px)',
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '28px', md: '42px' },
            mb: 2,
          }}
        >
          Ready to streamline your support?
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: '16px', md: '18px' },
            opacity: 0.9,
            maxWidth: 560,
            mx: 'auto',
            lineHeight: 1.7,
          }}
        >
          Join staff, agents, and managers already using ISTS to turn support requests into fast, measurable resolutions.
        </Typography>

      </Container>
    </Box>
  );
}

export default FinalCTA;
