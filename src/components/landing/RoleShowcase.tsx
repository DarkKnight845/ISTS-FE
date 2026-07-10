import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import { CheckCircleIcon } from '@/components/icons';

const roles = [
  {
    title: 'For Staff',
    subtitle: 'Submit and follow your requests',
    color: '#2559AA',
    items: [
      'Raise tickets with subject, description, priority, and department',
      'Attach files or screenshots for faster context',
      'Track status from Open through Ongoing to Resolved',
      'Edit or delete your own tickets before they are assigned',
      'Chat directly with the assigned agent in real time',
      'Rate the resolution once a ticket is closed',
    ],
  },
  {
    title: 'For Agents',
    subtitle: 'Own, resolve, and communicate',
    color: '#F59E0B',
    items: [
      'Accept tickets from your agent dashboard queue',
      'Send and receive messages inside each ticket instantly',
      'Update status and mark tickets as complete',
      'Escalate tickets back to managers for reassignment',
      'See your current workload and recent ratings',
      'Receive notifications for new assignments and replies',
    ],
  },
  {
    title: 'For Managers',
    subtitle: 'See everything, decide faster',
    color: '#10B981',
    items: [
      'View all tickets across the organization with filters',
      'Reassign tickets to the right agent in one click',
      'Monitor SLA breaches and overdue tickets',
      'Access analytics on volume, priorities, and workload',
      'Track agent performance and resolution trends',
      'Make staffing decisions with real-time data',
    ],
  },
];

function RoleShowcase() {
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
            BUILT FOR EVERY ROLE
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
            One platform, tailored to each user
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {roles.map((role) => (
            <Grid size={{ xs: 12, md: 4 }} key={role.title}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  height: '100%',
                  borderRadius: '20px',
                  border: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: 'background.paper',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '6px',
                    backgroundColor: role.color,
                  }}
                />

                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5, mt: 1 }}
                >
                  {role.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', mb: 3 }}
                >
                  {role.subtitle}
                </Typography>

                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  {role.items.map((item) => (
                    <Box
                      component="li"
                      key={item}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.5,
                        mb: 2,
                      }}
                    >
                      <Box sx={{ color: role.color, mt: '2px', flexShrink: 0 }}>
                        <CheckCircleIcon size={18} color={role.color} />
                      </Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                        {item}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default RoleShowcase;
