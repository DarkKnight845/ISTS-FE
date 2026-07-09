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
  averageRating?: number | null;
  totalRatings?: number;
}

/**
 * Grid of four KPI stat cards.
 */
const brandBlue = '#2559AA';

function StatsCardGrid({
  assignedToMe,
  resolved,
  unassigned,
  averageRating,
  totalRatings,
}: StatsCardGridProps) {
  const ratingValue =
    averageRating != null && !Number.isNaN(averageRating)
      ? averageRating.toFixed(1)
      : '—';

  const cards = [
    {
      title: 'Assigned to me',
      value: assignedToMe ?? 0,
      trend: `${assignedToMe ?? 0} ticket${(assignedToMe ?? 0) === 1 ? '' : 's'} assigned to you`,
      trendUp: true,
      icon: <TicketSubmittedIcon size={20} />,
      iconBg: brandBlue,
    },
    {
      title: 'Resolved',
      value: resolved ?? 0,
      trend: `${resolved ?? 0} ticket${(resolved ?? 0) === 1 ? '' : 's'} you resolved`,
      trendUp: true,
      icon: <TicketResolvedIcon size={20} />,
      iconBg: '#86EFAC',
    },
    {
      title: 'Average rating',
      value: ratingValue,
      trend: (totalRatings ?? 0) > 0
        ? `${totalRatings ?? 0} rating${(totalRatings ?? 0) === 1 ? '' : 's'}`
        : (averageRating != null && averageRating > 0 ? 'No rating count available' : 'No ratings yet'),
      trendUp: averageRating != null && averageRating >= 4,
      icon: <RatingIcon color={brandBlue} />,
      iconBg: '#FEF08A',
    },
    {
      title: 'Unassigned',
      value: unassigned ?? 0,
      trend: `${unassigned ?? 0} open ticket${(unassigned ?? 0) === 1 ? '' : 's'} awaiting agent`,
      trendUp: (unassigned ?? 0) === 0,
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
