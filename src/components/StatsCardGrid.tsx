import StatCard from './StatCard';
import {
  TicketSubmittedIcon,
  TicketResolvedIcon,
  TicketBlueIcon,
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
      trend: 'Tickets assigned to you',
      icon: <TicketSubmittedIcon size={20} />,
      iconBg: brandBlue,
    },
    {
      title: 'Resolved',
      value: resolved ?? 0,
      trend: 'Tickets you resolved',
      icon: <TicketResolvedIcon size={20} />,
      iconBg: '#86EFAC',
    },
    {
      title: 'Average rating',
      value: ratingValue,
      trend: (totalRatings ?? 0) > 0
        ? `${totalRatings ?? 0} total rating${(totalRatings ?? 0) === 1 ? '' : 's'}`
        : 'No ratings yet',
      icon: <RatingIcon color="#D97706" size={20} />,
      iconBg: '#FEF3C7',
    },
    {
      title: 'Unassigned',
      value: unassigned ?? 0,
      trend: 'Open tickets awaiting agent',
      icon: <TicketBlueIcon size={20} />,
      iconBg: '#FFFFFF',
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
