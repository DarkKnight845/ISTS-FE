import { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Card,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LineChart from '@/components/analytics/LineChart';
import DonutChart from '@/components/analytics/DonutChart';
import BarChart from '@/components/analytics/BarChart';
import InsightCard from '@/components/analytics/InsightCard';
import DateRangeFilter from '@/components/DateRangeFilter';
import { useTicketAnalytics } from '@/hooks/useTicketAnalytics';
import { getAverageRatingRequest, type AgentWorkloadEntry } from '@/lib/api';

function AnalyticsPage() {
  const theme = useTheme();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [csat, setCsat] = useState<{ averageRating: number; totalRatings: number } | null>(null);
  const [csatLoading, setCsatLoading] = useState(false);
  const [csatError, setCsatError] = useState<string | null>(null);

  const filters = {
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
  };

  const { analytics, loading, error } = useTicketAnalytics(filters);

  useEffect(() => {
    let cancelled = false;
    setCsatLoading(true);
    setCsatError(null);
    getAverageRatingRequest()
      .then((data) => {
        if (!cancelled) setCsat(data);
      })
      .catch((err) => {
        if (!cancelled) setCsatError(err instanceof Error ? err.message : 'Failed to load CSAT');
      })
      .finally(() => {
        if (!cancelled) setCsatLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fromDate, toDate]);

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
          <Typography sx={{ color: 'error.dark', fontSize: '13px' }}>{error || 'No data returned from server'}</Typography>
        </Box>
      </Box>
    );
  }

  const totalTickets =
    analytics.statusDistribution.reduce((sum, segment) => sum + segment.value, 0) ||
    analytics.weeklyVolume.reduce((sum, point) => sum + point.received, 0);

  const breachInsight = analytics.insights.find((i) => i.label === 'SLA breaches');
  const breachCount = breachInsight ? parseInt(breachInsight.value, 10) || 0 : 0;
  const slaCaption =
    breachCount === 0
      ? 'All SLA-tracked tickets are within target.'
      : `${breachCount} ticket${breachCount === 1 ? '' : 's'} currently breached SLA.`;

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
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Analytics
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Ticket trends, agent performance, and SLA health.
          </Typography>
        </Box>

        <DateRangeFilter
          start={fromDate}
          end={toDate}
          onChange={(start, end) => {
            setFromDate(start);
            setToDate(end);
          }}
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: 3,
          }}
        >
          <InsightCard
            insight={{
              label: 'SLA compliance',
              value: `${analytics.slaCompliancePercentage}%`,
              change: slaCaption,
              changeUp: analytics.slaCompliancePercentage >= 90,
            }}
          />
          <InsightCard
            insight={{
              label: 'Average resolution time',
              value: analytics.averageResolutionTime,
              change: 'MTTR across selected period',
              changeUp: undefined,
            }}
          />
          <InsightCard
            insight={{
              label: 'Total tickets',
              value: String(totalTickets),
              change: 'Tickets in scope',
              changeUp: undefined,
            }}
          />
          <CsatCard csat={csat} loading={csatLoading} error={csatError} />
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <LineChart
          data={analytics.weeklyVolume}
          title="Ticket volume"
          subtitle="Received vs resolved over the last 7 weeks"
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr 1fr' },
          gap: '24px',
          mb: 4,
        }}
      >
        <DonutChart
          data={analytics.statusDistribution}
          title="Tickets by status"
          subtitle="Open, ongoing, and resolved tickets"
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

        <BarChart data={analytics.agentWorkload} title="Agent workload" subtitle="Active vs resolved tickets by agent" />
      </Box>

      <AgentLeaderboard data={analytics.agentWorkload} />
    </Box>
  );
}

function CsatCard({
  csat,
  loading,
  error,
}: {
  csat: { averageRating: number; totalRatings: number } | null;
  loading: boolean;
  error: string | null;
}) {
  const theme = useTheme();
  const value = csat ? csat.averageRating.toFixed(1) : '—';
  const caption = csat ? `From ${csat.totalRatings} rating${csat.totalRatings === 1 ? '' : 's'}` : 'No rating data';

  return (
    <Card
      sx={{
        p: '22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        boxSizing: 'border-box',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '13px' }}>
          Customer satisfaction (CSAT)
        </Typography>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '10px',
            backgroundColor: '#DBEAFE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TrendingUpIcon sx={{ color: theme.palette.primary.main, width: 20, height: 20 }} />
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <CircularProgress size={18} sx={{ color: 'primary.main' }} />
          <Typography sx={{ color: 'text.secondary', fontSize: '13px' }}>Loading CSAT…</Typography>
        </Box>
      ) : error ? (
        <Typography sx={{ color: 'error.main', fontSize: '13px' }}>{error}</Typography>
      ) : (
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '30px', lineHeight: 1.2 }}>
            {value}
            <Typography component="span" sx={{ color: 'text.secondary', fontSize: '16px', fontWeight: 500, ml: 0.5 }}>
              /5
            </Typography>
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '12px', display: 'block', mt: '8px' }}>
            {caption}
          </Typography>
        </Box>
      )}
    </Card>
  );
}

function AgentLeaderboard({ data }: { data: AgentWorkloadEntry[] }) {
  const theme = useTheme();
  const sorted = useMemo(() => [...data].sort((a, b) => b.resolved - a.resolved), [data]);

  const columnTooltip =
    'Active = Open + Ongoing tickets assigned to this agent. Resolved includes Closed tickets.';

  return (
    <Paper
      sx={{
        borderRadius: '16px',
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        boxShadow: 'none',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: '24px', borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '16px' }}>
          Agent leaderboard
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px', mt: 0.5 }}>
          Ranked by tickets resolved.
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '12px', mt: 0.5, display: 'block' }}>
          {columnTooltip}
        </Typography>
      </Box>

      <TableContainer>
        <Table stickyHeader sx={{ minWidth: 520 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'action.hover' }}>
              {['Rank', 'Agent', 'Active tickets', 'Resolved tickets', 'Total'].map((h) => (
                <TableCell
                  key={h}
                  sx={{
                    fontWeight: 600,
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: 'text.secondary',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    py: '12px',
                  }}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sorted.map((agent, index) => (
              <TableRow
                key={agent.name}
                hover
                sx={{
                  '&:last-child td': { borderBottom: 0 },
                }}
              >
                <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}`, width: 80 }}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: index < 3 ? 'primary.main' : 'action.hover',
                      color: index < 3 ? 'primary.contrastText' : 'text.secondary',
                      fontWeight: 700,
                      fontSize: '13px',
                    }}
                  >
                    {index + 1}
                  </Box>
                </TableCell>
                <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 30, height: 30, fontSize: 12, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                      {agent.initials}
                    </Avatar>
                    <Typography sx={{ fontSize: '14px', fontWeight: 600, color: 'text.primary' }}>{agent.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontSize: '14px', color: 'text.secondary', fontWeight: 600, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  {agent.open}
                </TableCell>
                <TableCell sx={{ fontSize: '14px', color: 'success.main', fontWeight: 700, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  {agent.resolved}
                </TableCell>
                <TableCell sx={{ fontSize: '14px', color: 'text.primary', fontWeight: 700, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  {agent.open + agent.resolved}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default AnalyticsPage;
