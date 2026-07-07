import StatCard from './StatCard';
import {
  TicketSubmittedIcon,
  TicketResolvedIcon,
  TicketUrgentIcon,
  RatingIcon,
} from '@/components/icons';

interface StatsCardGridProps {
  assignedToMe?: number;
  resolved?: number;
  unassigned?: number;
}

/**
 * Grid of four KPI stat cards.
 */
const brandBlue = '#2559AA';

function StatsCardGrid({ assignedToMe, resolved, unassigned }: StatsCardGridProps) {
  const cards = [
    {
      title: 'Assigned to me',
      value: assignedToMe ?? 0,
      trend: 'Current workload',
      trendUp: true,
      icon: <TicketSubmittedIcon size={20} />,
      iconBg: brandBlue,
    },
    {
      title: 'Resolved',
      value: resolved ?? 0,
      trend: 'Completed tickets',
      trendUp: true,
      icon: <TicketResolvedIcon size={20} />,
      iconBg: '#86EFAC',
    },
    {
      title: 'Average rating',
      value: '—',
      trend: 'Coming soon',
      trendUp: true,
      icon: <RatingIcon color={brandBlue} />,
      iconBg: '#FEF08A',
    },
    {
      title: 'Unassigned',
      value: unassigned ?? 0,
      trend: 'Awaiting assignment',
      trendUp: false,
      icon: <TicketUrgentIcon size={20} />,
      iconBg: '#DBEAFE',
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
}

export default StatsCardGrid;
