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

const brandBlue = '#2563EB';
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
      title: 'Open tickets',
      value: openTickets,
      trend: 'Currently active',
      trendUp: undefined as boolean | undefined,
      icon: <TicketSubmittedIcon size={20} />,
      iconBg: '#DBEAFE',
    },
    {
      title: 'Resolved',
      value: resolved,
      trend: 'Tickets closed',
      trendUp: undefined as boolean | undefined,
      icon: <TicketResolvedIcon size={20} />,
      iconBg: '#D1FAE5',
    },
    {
      title: 'Unassigned',
      value: unassigned,
      trend: 'Awaiting agent',
      trendUp: undefined as boolean | undefined,
      icon: <TicketUrgentIcon size={20} />,
      iconBg: '#FEF3C7',
    },
    {
      title: 'SLA breaches',
      value: slaBreaches,
      trend: slaBreaches === 0 ? 'On track' : `${slaBreaches} ticket${slaBreaches === 1 ? '' : 's'} past SLA`,
      trendUp: slaBreaches === 0,
      icon: <SlaBreachIcon color={breachUrgent ? urgentRed : '#DC2626'} />,
      iconBg: '#FEE2E2',
      valueColor: breachUrgent ? urgentRed : slaBreaches > 0 ? '#DC2626' : undefined,
    },
    {
      title: 'SLA compliance',
      value: `${slaCompliance}%`,
      trend: 'Resolved within SLA',
      trendUp: slaCompliance >= 90,
      icon: <SlaComplianceIcon color={brandBlue} />,
      iconBg: '#DBEAFE',
      valueColor: slaCompliance < 75 ? '#DC2626' : undefined,
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
