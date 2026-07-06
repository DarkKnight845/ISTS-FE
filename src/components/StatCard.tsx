import { Box, Card, Typography } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string | number;
  trend: string;
  /** True when the trend is positive/upward. */
  trendUp?: boolean;
  icon: React.ReactNode;
  iconBg: string;
}

const TrendArrow = ({ up }: { up: boolean }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path
      d={up ? 'M12 4L4 14H20L12 4Z' : 'M12 20L20 10H4L12 20Z'}
      fill={up ? '#16A34A' : '#DC2626'}
    />
  </svg>
);

/**
 * KPI stat card matching the dashboard design.
 */
function StatCard({ title, value, trend, trendUp = true, icon, iconBg }: StatCardProps) {
  return (
    <Card
      sx={{
        width: '100%',
        borderRadius: '16px',
        border: '1px solid #E5E7EB',
        boxShadow: 'none',
        p: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 6 }}>
        <Typography variant="body2" sx={{ color: '#111827', fontWeight: 500, fontSize: '14px' }}>
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
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#111827', fontSize: '32px', lineHeight: 1.2 }}>
          {value}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mt: '8px' }}>
          <TrendArrow up={trendUp} />
          <Typography
            variant="caption"
            sx={{ color: trendUp ? '#16A34A' : '#DC2626', fontWeight: 500, fontSize: '12px' }}
          >
            {trend}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}

export default StatCard;
