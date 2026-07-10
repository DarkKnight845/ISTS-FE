import { Box } from '@mui/material';
import StatCard from '@/components/StatCard';
import {
  TicketSubmittedIcon,
  TicketResolvedIcon,
  TicketUrgentIcon,
  SlaBreachIcon,
  SlaComplianceIcon,
} from '@/components/icons';

interface StatsGridProps {
  openTickets: number;
  resolved: number;
  unassigned: number;
  slaBreaches: number;
  slaCompliance: number;
  onSlaClick: () => void;
}

const brandBlue = '#2559AA';
const urgentRed = '#DC2626';

function StatsGrid({
  openTickets,
  resolved,
  unassigned,
  slaBreaches,
  slaCompliance,
  onSlaClick,
}: StatsGridProps) {
  const breachUrgent = slaBreaches > 5;

  const cards = [
    {
      title: 'Total open tickets',
      value: openTickets,
      trend: 'Active tickets',
      icon: <TicketSubmittedIcon size={20} />,
      iconBg: brandBlue,
    },
    {
      title: 'Resolved',
      value: resolved,
      trend: 'Tickets resolved',
      icon: <TicketResolvedIcon size={20} />,
      iconBg: '#86EFAC',
    },
    {
      title: 'Unassigned',
      value: unassigned,
      trend: 'Awaiting assignment',
      icon: <TicketUrgentIcon size={20} />,
      iconBg: brandBlue,
    },
    {
      title: 'SLA breaches',
      value: slaBreaches,
      trend: slaBreaches === 0 ? 'No tickets past SLA' : `${slaBreaches} ticket${slaBreaches === 1 ? '' : 's'} past SLA`,
      icon: <SlaBreachIcon color={breachUrgent ? urgentRed : '#DC2626'} />,
      iconBg: '#FECACA',
      valueColor: breachUrgent ? urgentRed : undefined,
    },
    {
      title: 'SLA Compliance',
      value: `${slaCompliance}%`,
      trend: 'Resolved within SLA',
      icon: <SlaComplianceIcon color="#2559AA" />,
      iconBg: '#DBEAFE',
    },
  ];

  return (
    <div className="stats-grid-5">
      {cards.map((card) => {
        const isSlaBreach = card.title === 'SLA breaches';
        return (
          <Box
            key={card.title}
            onClick={isSlaBreach ? onSlaClick : undefined}
            sx={isSlaBreach ? { cursor: 'pointer' } : undefined}
          >
            <StatCard {...card} />
          </Box>
        );
      })}
    </div>
  );
}

export default StatsGrid;
