import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import LineChart from '@/components/analytics/LineChart';
import DonutChart from '@/components/analytics/DonutChart';
import BarChart from '@/components/analytics/BarChart';
import SlaGauge from '@/components/analytics/SlaGauge';
import InsightCard from '@/components/analytics/InsightCard';
import { CalendarIcon } from '@/components/icons';
import { useTicketAnalytics } from '@/hooks/useTicketAnalytics';

function AnalyticsPage() {
  const theme = useTheme();
  const { analytics, loading, error } = useTicketAnalytics();

  if (loading) {
    return (
      <Box sx={{ p: 4, flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={32} sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  if (error || !analytics) {
    return (
      <Box sx={{ p: 4, flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box
          sx={{
            py: 4,
            px: 3,
            borderRadius: '12px',
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.error.dark : theme.palette.error.light,
            border: `1px solid ${theme.palette.error.main}`,
            textAlign: 'center',
            maxWidth: 480,
          }}
        >
          <Typography sx={{ color: 'error.main', fontSize: '14px', fontWeight: 500, mb: 1 }}>
            Could not load analytics
          </Typography>
          <Typography sx={{ color: 'error.dark', fontSize: '13px' }}>
            {error || 'No data returned from server'}
          </Typography>
        </Box>
      </Box>
    );
  }

  const totalTickets =
    analytics.statusDistribution.reduce((sum, segment) => sum + segment.value, 0) ||
    analytics.weeklyVolume.reduce((sum, point) => sum + point.received, 0);

  return (
    <Box sx={{ p: 4, flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 500, color: 'text.primary' }}>
            Analytics
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Ticket trends, agent performance, and SLA health.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 1,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '10px',
            backgroundColor: 'background.paper',
            color: 'text.secondary',
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          <CalendarIcon size={16} />
          Apr 1 - Apr 7, 2026
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <div className="stats-grid-4">
          {analytics.insights.map((insight) => (
            <InsightCard key={insight.label} insight={insight} />
          ))}
        </div>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          gap: '24px',
          mb: 4,
        }}
      >
        <LineChart
          data={analytics.weeklyVolume}
          title="Ticket volume"
          subtitle="Received vs resolved over the last 7 weeks"
        />
        <SlaGauge
          value={analytics.slaCompliancePercentage}
          title="SLA compliance"
          subtitle="Percentage of tickets resolved within SLA"
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr 1fr' },
          gap: '24px',
        }}
      >
        <DonutChart
          data={analytics.statusDistribution}
          title="Tickets by status"
          subtitle="Active, ongoing, and resolved tickets"
          centerLabel="Total"
          centerValue={String(totalTickets)}
        />

        <DonutChart
          data={analytics.priorityDistribution}
          title="Tickets by priority"
          subtitle="Urgent, high, medium, and low priority"
          centerLabel="Total"
          centerValue={String(totalTickets)}
        />

        <BarChart data={analytics.agentWorkload} title="Agent workload" subtitle="Open vs resolved tickets by agent" />
      </Box>
    </Box>
  );
}

export default AnalyticsPage;
