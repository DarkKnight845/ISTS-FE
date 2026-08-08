import StatCard from './StatCard';
import {
  TicketSubmittedIcon,
  TicketResolvedIcon,
  TicketBlueIcon,
} from '@/components/icons';

interface StaffStatsCardGridProps {
  submitted?: number;
  ongoing?: number;
  open?: number;
  resolved?: number;
}

/**
 * Grid of four KPI stat cards for the staff dashboard.
 * Cards lift on hover (inherited from the shared StatCard).
 */
const brandBlue = '#2563EB';

function StaffStatsCardGrid({
  submitted = 0,
  ongoing = 0,
  open = 0,
  resolved = 0,
}: StaffStatsCardGridProps) {
  const cards = [
    {
      title: 'Submitted',
      value: submitted,
      trend: 'Tickets you have raised',
      icon: <TicketSubmittedIcon size={20} />,
      iconBg: brandBlue,
    },
    {
      title: 'Ongoing',
      value: ongoing,
      trend: 'Tickets currently being worked on',
      icon: <TicketBlueIcon size={20} />,
      iconBg: '#FFFFFF',
    },
    {
      title: 'Open',
      value: open,
      trend: 'Tickets awaiting an agent',
      icon: <TicketBlueIcon size={20} />,
      iconBg: '#FEF3C7',
    },
    {
      title: 'Resolved',
      value: resolved,
      trend: 'Tickets marked as resolved',
      icon: <TicketResolvedIcon size={20} />,
      iconBg: '#86EFAC',
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

export default StaffStatsCardGrid;
