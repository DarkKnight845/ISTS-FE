import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import {
  TicketIcon,
  SendIcon,
  AnalyticsIcon,
  SlaBreachIcon,
  BellIcon,
  DashboardIcon,
} from '@/components/icons';

const features = [
  {
    icon: <TicketIcon size={24} color="currentColor" />,
    title: 'Smart ticketing',
    description: 'Create, edit, delete, and track tickets by status, priority, department, and date range.',
  },
  {
    icon: <SendIcon size={24} color="currentColor" />,
    title: 'Real-time chat',
    description: 'Staff and agents message inside each ticket with SignalR-powered instant updates.',
  },
  {
    icon: <AnalyticsIcon size={24} color="currentColor" />,
    title: 'Live analytics',
    description: 'Weekly volume, status distribution, priority breakdown, and agent workload charts.',
  },
  {
    icon: <SlaBreachIcon size={24} color="currentColor" />,
    title: 'SLA monitoring',
    description: 'Automatic breach detection and compliance percentages keep service levels visible.',
  },
  {
    icon: <BellIcon size={24} color="currentColor" />,
    title: 'Instant notifications',
    description: 'Get notified about new messages, SLA breaches, and assignments — and jump straight to the ticket.',
  },
  {
    icon: <DashboardIcon size={24} color="currentColor" />,
    title: 'Role-based dashboards',
    description: 'Separate, purpose-built views for staff, agents, and managers with the actions each role needs.',
  },
];

function FeaturesGrid() {
  return (
    <Box
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
            FEATURES
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
            Everything teams need to stay on top of support
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {features.map((feature) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={feature.title}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: 'background.paper',
                  transition: 'border-color 0.2s ease',
                  '&:hover': { borderColor: 'primary.main' },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'dark' ? 'rgba(37, 89, 170, 0.15)' : '#EBF2FC',
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default FeaturesGrid;
