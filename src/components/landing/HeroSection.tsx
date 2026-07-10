import { Box, Button, Container, Typography } from '@mui/material';
import ionTicket from '@/assets/icons/ion_ticket.svg';

function HeroSection() {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 8, md: 12 },
        pb: { xs: 10, md: 14 },
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(180deg, #0F172A 0%, #172554 100%)'
            : 'linear-gradient(180deg, #FFFFFF 0%, #EFF6FF 100%)',
      }}
    >
      {/* Decorative blurred blobs */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: { xs: 300, md: 500 },
          height: { xs: 300, md: 500 },
          borderRadius: '50%',
          backgroundColor: 'primary.main',
          opacity: 0.08,
          filter: 'blur(80px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-10%',
          left: '-10%',
          width: { xs: 250, md: 400 },
          height: { xs: 250, md: 400 },
          borderRadius: '50%',
          backgroundColor: 'primary.main',
          opacity: 0.06,
          filter: 'blur(70px)',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: { xs: 6, md: 8 },
          }}
        >
          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <Typography
              variant="overline"
              sx={{
                color: 'primary.main',
                fontWeight: 700,
                letterSpacing: '0.12em',
                fontSize: { xs: '12px', md: '13px' },
                mb: 2,
                display: 'block',
              }}
            >
              INTELLIGENT SUPPORT TICKETING SYSTEM
            </Typography>

            <Typography
              variant="h1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '36px', sm: '48px', md: '58px', lg: '68px' },
                lineHeight: 1.1,
                color: 'text.primary',
                mb: 3,
              }}
            >
              Turn every request into a resolution.
            </Typography>

            <Typography
              variant="h6"
              component="p"
              sx={{
                color: 'text.secondary',
                fontWeight: 400,
                fontSize: { xs: '16px', md: '20px' },
                lineHeight: 1.6,
                mb: 4,
                maxWidth: 560,
                mx: { xs: 'auto', md: 0 },
              }}
            >
              ISTS connects staff, agents, and managers on one streamlined platform —
              where tickets are raised, conversations happen, and insights drive better support.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                justifyContent: { xs: 'center', md: 'flex-start' },
              }}
            >
              <Button
                variant="outlined"
                size="large"
                onClick={() => {
                  const el = document.getElementById('why-ists');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '16px',
                  borderRadius: '12px',
                  px: 4,
                  py: 1.5,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': { backgroundColor: 'primary.main', color: 'primary.contrastText' },
                }}
              >
                Learn more
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <Box
              component="img"
              src={ionTicket}
              alt="ISTS ticket illustration"
              sx={{
                width: { xs: 220, sm: 300, md: 380, lg: 440 },
                height: 'auto',
                filter: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'drop-shadow(0 20px 40px rgba(37, 89, 170, 0.25))'
                    : 'drop-shadow(0 20px 40px rgba(37, 89, 170, 0.15))',
                animation: 'float 6s ease-in-out infinite',
                '@keyframes float': {
                  '0%, 100%': { transform: 'translateY(0)' },
                  '50%': { transform: 'translateY(-16px)' },
                },
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default HeroSection;
