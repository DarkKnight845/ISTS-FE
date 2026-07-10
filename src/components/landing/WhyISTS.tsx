import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import { ClockIcon, ShieldIcon, ChartIcon } from '@/components/icons';

const reasons = [
  {
    icon: <ClockIcon size={28} color="currentColor" />,
    title: 'Faster resolution',
    description:
      'Tickets are routed to the right agent instantly. Real-time chat and status updates keep everyone aligned and cut response times.',
  },
  {
    icon: <ShieldIcon size={28} color="currentColor" />,
    title: 'Clear accountability',
    description:
      'Every ticket has an owner, a timeline, and a clear audit trail. Staff know who is handling their request and managers know who is overloaded.',
  },
  {
    icon: <ChartIcon size={28} color="currentColor" />,
    title: 'Data-driven decisions',
    description:
      'Live analytics on volume, priority, SLA breaches, and agent workload help managers spot trends and optimize team performance.',
  },
];

function WhyISTS() {
  return (
    <Box
      id="why-ists"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: 'background.default',
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
            WHY ISTS
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
            Built for the way modern teams work
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              fontSize: { xs: '15px', md: '17px' },
              maxWidth: 640,
              mx: 'auto',
              lineHeight: 1.7,
            }}
          >
            Replace scattered emails and missed messages with a single source of truth for internal support.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {reasons.map((reason) => (
            <Grid size={{ xs: 12, md: 4 }} key={reason.title}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: 'background.paper',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) =>
                      theme.palette.mode === 'dark'
                        ? '0 12px 40px rgba(0, 0, 0, 0.25)'
                        : '0 12px 40px rgba(37, 89, 170, 0.1)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '14px',
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'dark' ? 'rgba(37, 89, 170, 0.2)' : '#EBF2FC',
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                  }}
                >
                  {reason.icon}
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5 }}
                >
                  {reason.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                  {reason.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default WhyISTS;
