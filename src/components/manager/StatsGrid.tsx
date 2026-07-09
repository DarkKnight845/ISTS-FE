import { Box, Card, Typography } from '@mui/material';
import {
  TicketSubmittedIcon,
  TicketResolvedIcon,
  TicketUrgentIcon,
  SlaBreachIcon,
  SlaComplianceIcon,
  TrendUpIcon,
  TrendDownIcon,
} from '@/components/icons';

interface StatCardProps {
  title: string;
  value: string | number;
  trend: string;
  trendUp?: boolean;
  icon: React.ReactNode;
  iconBg: string;
}

function StatCard({ title, value, trend, trendUp = true, icon, iconBg }: StatCardProps) {
  return (
    <Card
      sx={{
        width: '100%',
        borderRadius: '16px',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
        p: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        boxSizing: 'border-box',
        backgroundColor: 'background.paper',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 6 }}>
        <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500, fontSize: '14px' }}>
          {title}
        </Typography>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '10px',
            backgroundColor: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      </Box>

      <Box>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '32px', lineHeight: 1.2 }}>
          {value}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mt: '8px' }}>
          {trendUp ? <TrendUpIcon size={12} color="success.main" /> : <TrendDownIcon size={12} color="error.main" />}
          <Typography variant="caption" sx={{ color: trendUp ? 'success.main' : 'error.main', fontWeight: 500, fontSize: '12px' }}>
            {trend}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}

interface StatsGridProps {
  openTickets: number;
  resolved: number;
  unassigned: number;
  slaBreaches: number;
  slaCompliance: number;
  onSlaClick: () => void;
}

function StatsGrid({
  openTickets,
  resolved,
  unassigned,
  slaBreaches,
  slaCompliance,
  onSlaClick,
}: StatsGridProps) {
  const cards = [
    {
      title: 'Total open tickets',
      value: openTickets,
      trend: 'Currently active',
      trendUp: true,
      icon: <TicketSubmittedIcon size={20} />,
      iconBg: '#2559AA',
    },
    {
      title: 'Resolved',
      value: resolved,
      trend: 'Completed tickets',
      trendUp: true,
      icon: <TicketResolvedIcon size={20} />,
      iconBg: '#86EFAC',
    },
    {
      title: 'Unassigned',
      value: unassigned,
      trend: 'Awaiting assignment',
      trendUp: unassigned === 0,
      icon: <TicketUrgentIcon size={20} />,
      iconBg: '#DBEAFE',
    },
    {
      title: 'SLA breaches',
      value: slaBreaches,
      trend: slaBreaches === 0 ? 'No tickets past SLA' : `${slaBreaches} ticket${slaBreaches === 1 ? '' : 's'} past SLA`,
      trendUp: slaBreaches === 0,
      icon: <SlaBreachIcon color="#DC2626" />,
      iconBg: '#FECACA',
      onClick: onSlaClick,
    },
    {
      title: 'SLA Compliance',
      value: `${slaCompliance}%`,
      trend: `${slaCompliance}% of SLA-tracked tickets resolved on time`,
      trendUp: slaCompliance >= 80,
      icon: <SlaComplianceIcon color="#2559AA" />,
      iconBg: '#DBEAFE',
    },
  ];

  return (
    <div className="stats-grid-5">
      {cards.map((card) => (
        <Box
          key={card.title}
          onClick={card.onClick}
          sx={card.onClick ? { cursor: 'pointer' } : undefined}
        >
          <StatCard {...card} />
        </Box>
      ))}
    </div>
  );
}

export default StatsGrid;
