import StatCard from './StatCard';

const blue = '#2559AA';
const white = '#fff';

// Ticket/tag variant icon.
const TicketTagIcon = ({ color = white }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M2 9V15C2 17 3 18 5 18H19C21 18 22 17 22 15V9C22 7 21 6 19 6H5C3 6 2 7 2 9Z"
      stroke={color}
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M6 6V4M18 6V4M9 14H15"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="16" cy="13" r="1.5" fill={color} />
  </svg>
);

const RatingIcon = ({ color = white }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={color}>
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

const cards = [
  {
    title: 'Assigned to me',
    value: 34,
    trend: '12% from last month',
    trendUp: true,
    icon: <TicketTagIcon color={white} />,
    iconBg: blue,
  },
  {
    title: 'Resolved',
    value: 21,
    trend: '12% from last month',
    trendUp: false,
    icon: <TicketTagIcon color={blue} />,
    iconBg: '#86EFAC',
  },
  {
    title: 'Average rating',
    value: 4.5,
    trend: '.5 from last month',
    trendUp: true,
    icon: <RatingIcon color={blue} />,
    iconBg: '#FEF08A',
  },
  {
    title: 'Unassigned',
    value: 5,
    trend: '12% from last month',
    trendUp: true,
    icon: <TicketTagIcon color={blue} />,
    iconBg: '#DBEAFE',
  },
];

/**
 * Grid of four KPI stat cards.
 */
function StatsCardGrid() {
  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
}

export default StatsCardGrid;
