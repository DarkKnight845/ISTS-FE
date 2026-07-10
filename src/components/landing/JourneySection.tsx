import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import { TicketSubmittedIcon, TicketInProgressIcon, TicketResolvedIcon } from '@/components/icons';

const steps = [
  {
    number: '01',
    role: 'Staff',
    title: 'Raise a ticket',
    description:
      'Staff describe the issue, choose a department and priority, attach screenshots or files, and submit. Every request becomes a trackable ticket.',
    icon: <TicketSubmittedIcon size={40} />,
  },
  {
    number: '02',
    role: 'Agent',
    title: 'Resolve with context',
    description:
      'Agents see assigned tickets, accept them, chat with the requester in real time, escalate when needed, and mark tickets complete.',
    icon: <TicketInProgressIcon size={40} />,
  },
  {
    number: '03',
    role: 'Manager',
    title: 'Optimize operations',
    description:
      'Managers monitor workloads, reassign tickets, track SLA breaches, and use analytics to improve team capacity and response quality.',
    icon: <TicketResolvedIcon size={40} />,
  },
];

function JourneySection() {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(180deg, #172554 0%, #0F172A 100%)'
            : 'linear-gradient(180deg, #EFF6FF 0%, #FFFFFF 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Typography
            variant="overline"
            sx={{
              color: 'primary.main',
              fontWeight: 700,
              letterSpacing: '0.1em',
              fontSize: '12px',
              mb: 1,
              display: 'block',
            }}
          >
            THE JOURNEY
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '28px', md: '38px' },
              color: 'text.primary',
              mb: 2,
            }}
          >
            From request to resolution in three steps
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
          {steps.map((step, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={step.role} sx={{ display: 'flex' }}>
              <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: '20px',
                    border: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: 'background.paper',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'transform 0.2s ease',
                    '&:hover': { transform: 'translateY(-4px)' },
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 20,
                      fontSize: '48px',
                      fontWeight: 800,
                      color: (theme) =>
                        theme.palette.mode === 'dark' ? 'rgba(37, 89, 170, 0.25)' : 'rgba(37, 89, 170, 0.08)',
                    }}
                  >
                    {step.number}
                  </Box>

                  <Box sx={{ mb: 3 }}>{step.icon}</Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      display: 'block',
                      mb: 1,
                    }}
                  >
                    {step.role}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}
                  >
                    {step.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                    {step.description}
                  </Typography>
                </Paper>

                {index < steps.length - 1 && (
                  <Box
                    sx={{
                      display: { xs: 'none', md: 'block' },
                      position: 'absolute',
                      top: '50%',
                      right: -24,
                      transform: 'translateY(-50%)',
                      zIndex: 1,
                      color: 'primary.main',
                      opacity: 0.4,
                    }}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 12H19M19 12L13 6M19 12L13 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Box>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default JourneySection;
